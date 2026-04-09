import { NextResponse } from "next/server";
import { z } from "zod";
import Razorpay from "razorpay";
import { getBookingTotalUsd } from "@/lib/booking-pricing";
import {
  getRazorpayAmountMinorUnits,
  getRazorpayKeyId,
  getRazorpaySecret,
} from "@/lib/razorpay-config";
import { PAYMENT_NOT_CONFIGURED_CODE } from "@/lib/payments-env";

const bodySchema = z.object({
  roomId: z.number().int().positive(),
  checkIn: z.string(),
  checkOut: z.string(),
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

    const { roomId, checkIn, checkOut } = parsed.data;
    const pricing = getBookingTotalUsd(roomId, checkIn, checkOut);
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
        totalUsd: String(pricing.total),
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount,
      currency,
      keyId,
      totalUsd: pricing.total,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not create payment order" },
      { status: 500 }
    );
  }
}
