import { NextResponse } from "next/server";
import { z } from "zod";
import Razorpay from "razorpay";
import { getBookingTotal } from "@/lib/booking-pricing";
import {
  getRazorpayAmountMinorUnits,
  getRazorpayKeyId,
  getRazorpaySecret,
} from "@/lib/razorpay-config";
import { PAYMENT_NOT_CONFIGURED_CODE } from "@/lib/payments-env";
import { connectMongo } from "@/lib/mongodb";
import { Booking, hasOverlap } from "@/models/Booking";
import { findRoomById } from "@/lib/room-api";
import { fetchExternalBookings, hasExternalOverlap } from "@/lib/ical-service";

const bodySchema = z.object({
  roomId: z.union([z.string(), z.number()]).transform(String),
  checkIn: z.string(),
  checkOut: z.string(),
  bookingId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const keyId = getRazorpayKeyId();
    const secret = getRazorpaySecret();
    if (!keyId || !secret) {
      return NextResponse.json(
        {
          error:
            "Payment gateway is not configured. Add NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local, then restart the dev server.",
          code: PAYMENT_NOT_CONFIGURED_CODE,
        },
        { status: 503 }
      );
    }

    const json: unknown = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { roomId, checkIn, checkOut, bookingId } = parsed.data;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
    }

    // ── OVERLAP CHECK (before hitting Razorpay) ──────────────────────────────
    await connectMongo();
    const conflict = await hasOverlap(roomId, checkInDate, checkOutDate);
    if (conflict) {
      return NextResponse.json(
        {
          error: "These dates were just booked on Larosa. Please select different dates.",
          code: "DATES_UNAVAILABLE",
        },
        { status: 409 }
      );
    }

    const room = await findRoomById(roomId);
    if (room?.airbnbIcalUrl) {
      const externalBookings = await fetchExternalBookings(room.airbnbIcalUrl);
      if (hasExternalOverlap(checkInDate, checkOutDate, externalBookings)) {
        return NextResponse.json(
          {
            error: "These dates are reserved on Airbnb. Please select different dates.",
            code: "DATES_UNAVAILABLE",
          },
          { status: 409 }
        );
      }
    }
    // ─────────────────────────────────────────────────────────────────────────

    const pricing = await getBookingTotal(roomId, checkIn, checkOut);
    if (!pricing) {
      return NextResponse.json(
        { error: "Invalid room or stay dates" },
        { status: 400 }
      );
    }

    const { amount, currency } = getRazorpayAmountMinorUnits(pricing.total);

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: secret,
    });

    const receipt = `lr_${Date.now()}`.slice(0, 40);
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
      notes: {
        roomId: String(roomId),
        total: String(pricing.total),
        bookingId: bookingId || "",
      },
    });

    // ── Link orderId to booking in DB ────────────────────────────────────────
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, {
        razorpayOrderId: order.id,
      });
    }

    return NextResponse.json({
      orderId: order.id,
      amount,
      currency,
      keyId,
      total: pricing.total,
    });
  } catch (err: any) {
    console.error(err);
    const isRazorpayError = err && err.statusCode === 400 && err.error;
    const errorMsg = isRazorpayError ? err.error.description : "Could not create payment order";
    const status = isRazorpayError ? 400 : 500;
    
    return NextResponse.json(
      { error: errorMsg },
      { status }
    );
  }
}
