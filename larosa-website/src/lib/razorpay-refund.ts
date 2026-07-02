import Razorpay from "razorpay";
import { getRazorpayKeyId, getRazorpaySecret } from "@/lib/razorpay-config";

export class RazorpayRefundError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "RazorpayRefundError";
  }
}

/** Issue a full refund for a captured Razorpay payment. */
export async function issueFullRazorpayRefund(params: {
  paymentId: string;
  bookingId: string;
  reason?: string;
}): Promise<string> {
  const keyId = getRazorpayKeyId();
  const secret = getRazorpaySecret();
  if (!keyId || !secret) {
    throw new RazorpayRefundError(
      "Payment gateway is not configured. Cannot issue refund."
    );
  }

  const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: secret,
  });

  try {
    const refund = await razorpay.payments.refund(params.paymentId, {
      notes: {
        bookingId: params.bookingId,
        reason: params.reason ?? "Booking cancelled",
      },
    });
    if (!refund?.id) {
      throw new RazorpayRefundError("Razorpay did not return a refund ID");
    }
    return refund.id;
  } catch (err) {
    const msg =
      err &&
      typeof err === "object" &&
      "error" in err &&
      err.error &&
      typeof err.error === "object" &&
      "description" in err.error &&
      typeof (err.error as { description: unknown }).description === "string"
        ? (err.error as { description: string }).description
        : err instanceof Error
          ? err.message
          : "Refund failed";
    throw new RazorpayRefundError(msg, err);
  }
}
