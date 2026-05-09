import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { connectMongo } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";
import { getRazorpayWebhookSecret } from "@/lib/razorpay-config";
import { sendBookingEmails } from "@/lib/booking-mailer";
import { sendAdminBookingNotifications, isMsg91Configured } from "@/lib/notifications";

/**
 * RAZORPAY WEBHOOK HANDLER
 * This is the ultimate "fail-safe" for payments.
 * Even if the user's browser crashes after payment, Razorpay will notify this endpoint.
 */

export async function POST(request: NextRequest) {
  try {
    const secret = getRazorpayWebhookSecret();
    if (!secret) {
      console.warn("[razorpay-webhook] Secret not configured, skipping verification.");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    const signature = request.headers.get("x-razorpay-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const body = await request.text();
    const expectedSignature = createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    const a = Buffer.from(signature, "utf8");
    const b = Buffer.from(expectedSignature, "utf8");

    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      console.error("[razorpay-webhook] Invalid signature detected.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(body);
    const event = payload.event;

    console.log(`[razorpay-webhook] Received event: ${event}`);

    // Handle order.paid or payment.captured
    if (event === "order.paid" || event === "payment.captured") {
      const orderId = payload.payload.order?.entity?.id || payload.payload.payment?.entity?.order_id;
      const paymentId = payload.payload.payment?.entity?.id;

      if (!orderId) {
        return NextResponse.json({ error: "Missing order ID in payload" }, { status: 400 });
      }

      await connectMongo();

      // Find the pending booking by orderId
      // We use findOne instead of findById because orderId is a property, not the _id
      const booking = await Booking.findOne({ 
        razorpayOrderId: orderId,
        status: "pending" 
      });

      if (!booking) {
        console.log(`[razorpay-webhook] No pending booking found for order ${orderId} (might be already processed).`);
        return NextResponse.json({ received: true });
      }

      // Update status to confirmed
      booking.status = "confirmed";
      booking.razorpayPaymentId = paymentId;
      await booking.save();

      console.log(`[razorpay-webhook] Booking ${booking._id} confirmed via webhook.`);

      // Send emails
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
          razorpayPaymentId: paymentId,
          specialRequests: booking.specialRequests,
        });
        console.log(`[razorpay-webhook] Emails sent for ${booking._id}`);
      } catch (emailErr) {
        console.warn(`[razorpay-webhook] Email failed for ${booking._id}:`, emailErr);
      }

      // Send WhatsApp/SMS notifications
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
            razorpayPaymentId: paymentId,
            specialRequests: booking.specialRequests,
          });
        } catch (notifErr) {
          console.warn(`[razorpay-webhook] Notification failed for ${booking._id}:`, notifErr);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[razorpay-webhook] Error processing webhook:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
