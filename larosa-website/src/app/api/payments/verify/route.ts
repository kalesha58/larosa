import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { z } from "zod";
import { getRazorpaySecret } from "@/lib/razorpay-config";
import { PAYMENT_NOT_CONFIGURED_CODE } from "@/lib/payments-env";
import { connectMongo } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";
import { isMailConfigured } from "@/lib/mailer";
import { sendBookingEmails } from "@/lib/booking-mailer";
import { sendAdminBookingNotifications, isMsg91Configured } from "@/lib/notifications";
import { format } from "date-fns";

const bodySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  bookingId: z.string().optional(), // Optional: link payment to a pending booking
});

function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean {
  const expected = createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  if (expected.length !== signature.length) {
    return false;
  }
  try {
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(signature, "utf8");
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}



export async function POST(request: Request) {
  try {
    const secret = getRazorpaySecret();
    if (!secret) {
      return NextResponse.json(
        {
          error:
            "Payment gateway is not configured. Add RAZORPAY_KEY_SECRET to .env.local.",
          code: PAYMENT_NOT_CONFIGURED_CODE,
        },
        { status: 503 }
      );
    }

    const json: unknown = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = parsed.data;

    const ok = verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      secret
    );
    if (!ok) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // ── Confirm booking in DB ─────────────────────────────────────────────────
    await connectMongo();

    let confirmedBookingId: string | null = null;

    if (bookingId) {
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          status: "confirmed",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
        },
        { new: true }
      ).lean();

      if (booking) {
        confirmedBookingId = booking._id.toString();

        // ── Send confirmation emails (Client & Admin) ───────────────────────
        if (isMailConfigured()) {
          try {
            await sendBookingEmails({
              guestName: booking.guestName,
              guestEmail: booking.guestEmail,
              guestPhone: booking.guestPhone,
              roomTitle: booking.roomTitle,
              roomType: booking.roomType,
              checkIn: booking.checkIn,
              checkOut: booking.checkOut,
              nights: booking.nights,
              guests: booking.guests,
              totalPrice: booking.totalPrice,
              razorpayPaymentId: razorpay_payment_id,
              specialRequests: booking.specialRequests,
            });
          } catch (emailErr) {
            console.warn("[verify] Email send failed:", emailErr);
          }
        }

        // ── Send WhatsApp/SMS notifications (Admin) ─────────────────────────
        if (isMsg91Configured()) {
          try {
            await sendAdminBookingNotifications({
              guestName: booking.guestName,
              guestEmail: booking.guestEmail,
              guestPhone: booking.guestPhone,
              roomTitle: booking.roomTitle,
              roomType: booking.roomType,
              checkIn: booking.checkIn,
              checkOut: booking.checkOut,
              nights: booking.nights,
              guests: booking.guests,
              totalPrice: booking.totalPrice,
              razorpayPaymentId: razorpay_payment_id,
              specialRequests: booking.specialRequests,
            });
          } catch (notifErr) {
            console.warn("[verify] Notification send failed:", notifErr);
          }
        }
      }
    }

    return NextResponse.json({
      verified: true,
      bookingId: confirmedBookingId,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
