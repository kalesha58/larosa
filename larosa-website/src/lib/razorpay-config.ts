/** Razorpay amount in smallest currency unit (paise for INR, cents for USD). */

export function getRazorpayAmountMinorUnits(totalUsd: number): {
  amount: number;
  currency: string;
} {
  // Cap at $18 to keep transaction < $20 and < ₹1500 for testing
  const cappedUsd = Math.min(totalUsd, 18);
  const currency = (process.env.RAZORPAY_CURRENCY || "INR").toUpperCase();
  if (currency === "USD") {
    return {
      amount: Math.max(100, Math.round(cappedUsd * 100)),
      currency: "USD",
    };
  }
  const rate = Number(process.env.RAZORPAY_USD_TO_INR || "83");
  const paise = Math.round(cappedUsd * 100 * rate);
  return {
    amount: Math.max(100, paise),
    currency: "INR",
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
