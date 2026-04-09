import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { z } from "zod";
import { getRazorpaySecret } from "@/lib/razorpay-config";
import { PAYMENT_NOT_CONFIGURED_CODE } from "@/lib/payments-env";

const bodySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
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

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      parsed.data;
    const ok = verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      secret
    );
    if (!ok) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    return NextResponse.json({ verified: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
