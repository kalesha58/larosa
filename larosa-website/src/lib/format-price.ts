/** Compact nightly rate for calendar cells (e.g. ₹18K). */
export function formatCompactInr(amount: number): string {
  if (amount >= 100_000) {
    return `₹${(amount / 100_000).toFixed(amount % 100_000 === 0 ? 0 : 1)}L`;
  }
  if (amount >= 1000) {
    const k = amount / 1000;
    return `₹${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
