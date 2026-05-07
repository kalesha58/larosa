/** Razorpay amount in smallest currency unit (paise for INR, cents for USD). */

export function getRazorpayAmountMinorUnits(totalAmount: number): {
  amount: number;
  currency: string;
} {
  const currency = "INR";
  // amount in paise
  const paise = Math.round(totalAmount * 100);
  return {
    amount: Math.max(100, paise),
    currency,
  };
}

export function getRazorpayKeyId(): string | null {
  const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim();
  return key && key.length > 0 ? key : null;
}

export function getRazorpaySecret(): string | null {
  const s = process.env.RAZORPAY_KEY_SECRET?.trim();
  return s && s.length > 0 ? s : null;
}
