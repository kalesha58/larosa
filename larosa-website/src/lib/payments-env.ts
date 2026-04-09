import { getRazorpayKeyId, getRazorpaySecret } from "@/lib/razorpay-config";

export const PAYMENT_NOT_CONFIGURED_CODE = "PAYMENT_NOT_CONFIGURED" as const;

export function isRazorpayConfigured(): boolean {
  return Boolean(getRazorpayKeyId() && getRazorpaySecret());
}
