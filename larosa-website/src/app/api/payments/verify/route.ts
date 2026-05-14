import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { z } from "zod";
import { getRazorpaySecret } from "@/lib/razorpay-config";
import { PAYMENT_NOT_CONFIGURED_CODE } from "@/lib/payments-env";
import { connectMongo } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";
import { sendContactMail, isMailConfigured } from "@/lib/mailer";
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

function buildConfirmationEmail(booking: {
  guestName: string;
  roomTitle: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: number;
  totalPrice: number;
  razorpayPaymentId?: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Georgia, serif; background: #faf9f7; margin: 0; padding: 40px;">
  <div style="max-width: 560px; margin: 0 auto; background: #fff; border: 1px solid #e5e0d8; padding: 48px;">
    <h1 style="font-size: 28px; color: #1a1510; margin: 0 0 8px;">Reservation Confirmed</h1>
    <p style="color: #8a7e6e; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 40px;">La Rosa — Luxury Stays</p>
    
    <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear ${booking.guestName},</p>
    <p style="color: #333; font-size: 15px; line-height: 1.6; margin-bottom: 32px;">
      Your reservation at <strong>${booking.roomTitle}</strong> has been confirmed. We look forward to welcoming you.
    </p>

    <div style="background: #faf9f7; border-left: 3px solid #c9a96e; padding: 24px; margin-bottom: 32px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #333;">
        <tr style="border-bottom: 1px solid #e5e0d8;">
          <td style="padding: 10px 0; color: #8a7e6e; text-transform: uppercase; letter-spacing: 2px; font-size: 10px;">Check-in</td>
          <td style="padding: 10px 0; text-align: right; font-weight: bold;">${format(booking.checkIn, "MMMM dd, yyyy")}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e0d8;">
          <td style="padding: 10px 0; color: #8a7e6e; text-transform: uppercase; letter-spacing: 2px; font-size: 10px;">Check-out</td>
          <td style="padding: 10px 0; text-align: right; font-weight: bold;">${format(booking.checkOut, "MMMM dd, yyyy")}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e0d8;">
          <td style="padding: 10px 0; color: #8a7e6e; text-transform: uppercase; letter-spacing: 2px; font-size: 10px;">Duration</td>
          <td style="padding: 10px 0; text-align: right;">${booking.nights} night${booking.nights > 1 ? "s" : ""}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e0d8;">
          <td style="padding: 10px 0; color: #8a7e6e; text-transform: uppercase; letter-spacing: 2px; font-size: 10px;">Guests</td>
          <td style="padding: 10px 0; text-align: right;">${booking.guests}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #8a7e6e; text-transform: uppercase; letter-spacing: 2px; font-size: 10px;">Total Paid</td>
          <td style="padding: 10px 0; text-align: right; font-weight: bold; font-size: 18px; color: #c9a96e;">₹${booking.totalPrice.toLocaleString("en-IN")}</td>
        </tr>
      </table>
    </div>

    ${booking.razorpayPaymentId ? `<p style="color: #8a7e6e; font-size: 11px; font-family: monospace;">Payment ID: ${booking.razorpayPaymentId}</p>` : ""}

    <p style="color: #333; font-size: 14px; line-height: 1.8; margin-top: 32px;">
      For any queries, please contact us at <a href="mailto:info@larosa.co.in" style="color: #c9a96e;">info@larosa.co.in</a> or call us.
    </p>

    <p style="color: #8a7e6e; font-size: 12px; margin-top: 48px; border-top: 1px solid #e5e0d8; padding-top: 24px;">
      La Rosa Luxury Hotel &amp; Villas<br>
      This is an automated confirmation. Please do not reply.
    </p>
  </div>
</body>
</html>
  `.trim();
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

        if ((booking.source ?? "website") !== "airbnb" && isMailConfigured()) {
          try {
            await sendContactMail({
              to: booking.guestEmail,
              replyTo: process.env.CONTACT_TO_EMAIL ?? "info@larosa.co.in",
              subject: `Booking Confirmed — ${booking.roomTitle} | La Rosa`,
              html: buildConfirmationEmail({
                guestName: booking.guestName,
                roomTitle: booking.roomTitle,
                checkIn: booking.checkIn,
                checkOut: booking.checkOut,
                nights: booking.nights,
                guests: booking.guests,
                totalPrice: booking.totalPrice,
                razorpayPaymentId: razorpay_payment_id,
              }),
            });
          } catch (emailErr) {
            // Don't fail the verification if email fails
            console.warn("[verify] Email send failed:", emailErr);
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
