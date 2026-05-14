import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";
import mongoose from "mongoose";
import { getAuthPayload } from "@/lib/auth-guard";

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
    const { status } = body as { status?: string };

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

    const isAdmin = session.role === "admin";
    const isOwner =
      existing.guestEmail.toLowerCase() === session.email.toLowerCase();

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!isAdmin) {
      if (status !== "cancelled") {
        return NextResponse.json(
          { error: "Guests may only cancel a booking" },
          { status: 403 }
        );
      }
      if ((existing.source ?? "website") === "airbnb") {
        return NextResponse.json(
          { error: "This reservation cannot be cancelled here" },
          { status: 403 }
        );
      }
    }

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
    });
  } catch (err) {
    console.error("[PATCH /api/bookings/[id]]", err);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
