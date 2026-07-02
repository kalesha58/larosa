import { PENDING_BOOKING_HOLD_MS } from "@/models/Booking";
import { formatPropertyDate } from "@/lib/property-dates";

export { formatPropertyDate };

/** Shared filter for non-cancelled bookings that block availability. */
export function activeBookingMongoFilter(roomIds: string | string[]) {
  const ids = Array.isArray(roomIds) ? roomIds : [roomIds];
  const holdSince = new Date(Date.now() - PENDING_BOOKING_HOLD_MS);
  return {
    roomId: ids.length === 1 ? ids[0] : { $in: ids },
    status: { $ne: "cancelled" as const },
    $or: [
      { status: "confirmed" as const },
      {
        status: "pending" as const,
        createdAt: { $gte: holdSince },
        $or: [{ source: "website" as const }, { source: { $exists: false } }],
      },
    ],
  };
}

/** Admin calendar window: past 90 days through ~2 years ahead (ICS import horizon). */
export function adminCalendarDateWindow() {
  const now = Date.now();
  return {
    checkIn: { $lt: new Date(now + 730 * 86400000) },
    checkOut: { $gt: new Date(now - 90 * 86400000) },
  };
}

/** @deprecated Use formatPropertyDate — kept for import compatibility. */
export const toUtcDateString = formatPropertyDate;
