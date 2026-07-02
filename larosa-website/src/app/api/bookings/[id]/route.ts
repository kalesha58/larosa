import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";
import mongoose from "mongoose";
import { getAuthPayload } from "@/lib/auth-guard";
import {
  issueFullRazorpayRefund,
  RazorpayRefundError,
} from "@/lib/razorpay-refund";
import {
  bookingToEmailData,
  sendBookingCancellationEmails,
} from "@/lib/booking-mailer";
import { CancellationFeedback } from "@/models/CancellationFeedback";
import {
  guestCancelFeedbackSchema,
  type GuestCancelFeedbackInput,
} from "@/lib/cancellation-feedback";

// GET /api/bookings/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongo();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 });
    }

    const booking = await Booking.findById(id).lean();
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: booking._id.toString(),
      roomId: booking.roomId,
      room: {
        id: booking.roomId,
        title: booking.roomTitle,
        type: booking.roomType,
      },
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone ?? "",
      checkIn: booking.checkIn.toISOString(),
      checkOut: booking.checkOut.toISOString(),
      nights: booking.nights,
      guests: booking.guests,
      totalPrice: booking.totalPrice,
      pricePerNight: booking.pricePerNight,
      status: booking.status,
      source: booking.source ?? "website",
      specialRequests: booking.specialRequests ?? "",
      razorpayOrderId: booking.razorpayOrderId ?? "",
      razorpayPaymentId: booking.razorpayPaymentId ?? "",
      razorpayRefundId: booking.razorpayRefundId ?? "",
      cancelledAt: booking.cancelledAt?.toISOString() ?? null,
      cancelledBy: booking.cancelledBy ?? null,
      createdAt: booking.createdAt.toISOString(),
    });
  } catch (err) {
    console.error("[GET /api/bookings/[id]]", err);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

// PATCH /api/bookings/[id] — admin: confirm/cancel; guest: cancel own website booking only
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthPayload();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 });
    }

    const body: unknown = await request.json();
    const { status, skipRefund, feedback: rawFeedback } = body as {
      status?: string;
      skipRefund?: boolean;
      feedback?: unknown;
    };

    if (!status || !["confirmed", "cancelled"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'confirmed' or 'cancelled'" },
        { status: 400 }
      );
    }

    const existing = await Booking.findById(id).lean();
    if (!existing) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (existing.status === "cancelled") {
      return NextResponse.json(
        { error: "Booking is already cancelled" },
        { status: 409 }
      );
    }

    const isAdmin = session.role === "admin";
    const isOwner =
      existing.guestEmail.toLowerCase() === session.email.toLowerCase();

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if ((existing.source ?? "website") === "airbnb") {
      return NextResponse.json(
        { error: "Airbnb-synced reservations cannot be cancelled here" },
        { status: 403 }
      );
    }

    if (!isAdmin) {
      if (status !== "cancelled") {
        return NextResponse.json(
          { error: "Guests may only cancel a booking" },
          { status: 403 }
        );
      }
    }

    if (status !== "cancelled") {
      const booking = await Booking.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      ).lean();
      if (!booking) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      }
      return NextResponse.json({
        id: booking._id.toString(),
        status: booking.status,
        refunded: false,
      });
    }

    if (skipRefund && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const cancelledBy: "admin" | "guest" = isAdmin ? "admin" : "guest";
    let refundId: string | undefined;
    let refunded = false;
    let guestFeedback: GuestCancelFeedbackInput | undefined;

    if (!isAdmin && rawFeedback) {
      const parsedFeedback = guestCancelFeedbackSchema.safeParse(rawFeedback);
      if (!parsedFeedback.success) {
        const first = parsedFeedback.error.issues[0];
        return NextResponse.json(
          { error: first?.message ?? "Invalid cancellation feedback" },
          { status: 400 }
        );
      }
      guestFeedback = parsedFeedback.data;
    }

    const needsRefund =
      existing.status === "confirmed" &&
      Boolean(existing.razorpayPaymentId?.trim());

    // Guests: no automatic Razorpay refund — team processes manually after cancellation.
    const shouldAttemptRefund =
      isAdmin && needsRefund && existing.razorpayPaymentId && !skipRefund;

    if (shouldAttemptRefund && existing.razorpayPaymentId) {
      try {
        refundId = await issueFullRazorpayRefund({
          paymentId: existing.razorpayPaymentId,
          bookingId: id,
          reason: `${cancelledBy} cancelled stay`,
        });
        refunded = true;
      } catch (err) {
        const msg =
          err instanceof RazorpayRefundError
            ? err.message
            : "Failed to issue Razorpay refund";
        console.error(`[PATCH /api/bookings/${id}] Refund failed:`, err);
        return NextResponse.json({ error: msg }, { status: 502 });
      }
    }

    const refundPending = needsRefund && !refunded;

    const booking = await Booking.findByIdAndUpdate(
      id,
      {
        status: "cancelled",
        cancelledAt: new Date(),
        cancelledBy,
        ...(refundId ? { razorpayRefundId: refundId } : {}),
      },
      { new: true }
    ).lean();

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (guestFeedback) {
      try {
        await CancellationFeedback.findOneAndUpdate(
          { bookingId: booking._id },
          {
            bookingId: booking._id,
            guestName: booking.guestName,
            guestEmail: booking.guestEmail,
            roomTitle: booking.roomTitle,
            roomType: booking.roomType,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            totalPrice: booking.totalPrice,
            ...guestFeedback,
          },
          { upsert: true, new: true }
        );
      } catch (feedbackErr) {
        console.warn(`[PATCH /api/bookings/${id}] Feedback save failed:`, feedbackErr);
      }
    }

    try {
      await sendBookingCancellationEmails({
        ...bookingToEmailData(booking),
        cancelledBy,
        refunded,
        refundPending,
        razorpayRefundId: refundId,
        guestFeedback,
      });
    } catch (emailErr) {
      console.warn(`[PATCH /api/bookings/${id}] Cancellation email failed:`, emailErr);
    }

    return NextResponse.json({
      id: booking._id.toString(),
      status: booking.status,
      refundId: refundId || undefined,
      refunded,
      refundPending,
    });
  } catch (err) {
    console.error("[PATCH /api/bookings/[id]]", err);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
