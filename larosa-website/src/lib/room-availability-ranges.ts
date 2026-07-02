import { addDays, parseISO } from "date-fns";
import { connectMongo } from "@/lib/mongodb";
import {
  adminCalendarDateWindow,
  formatPropertyDate,
} from "@/lib/active-booking-filter";
import {
  buildBlockedNightSet,
  expandBlockedNights,
  rangeOverlapsBlocked,
  type AvailabilityRange,
} from "@/lib/booking-availability";
import { Booking, PENDING_BOOKING_HOLD_MS } from "@/models/Booking";
import { RoomCalendarDay } from "@/models/RoomCalendarDay";
import { resolveBookingRoomIds } from "@/lib/room-api";

export async function getBookingAvailabilityRanges(
  roomId: number
): Promise<AvailabilityRange[]> {
  await connectMongo();
  const holdSince = new Date(Date.now() - PENDING_BOOKING_HOLD_MS);
  const roomIds = await resolveBookingRoomIds(String(roomId));

  const bookings = await Booking.find({
    roomId: roomIds.length === 1 ? roomIds[0] : { $in: roomIds },
    status: { $ne: "cancelled" },
    ...adminCalendarDateWindow(),
    $or: [
      { status: "confirmed" },
      {
        status: "pending",
        createdAt: { $gte: holdSince },
        $or: [{ source: "website" }, { source: { $exists: false } }],
      },
    ],
  })
    .select("checkIn checkOut source")
    .lean();

  return bookings.map((b) => ({
    checkIn: formatPropertyDate(b.checkIn),
    checkOut: formatPropertyDate(b.checkOut),
    source: (b.source ?? "website") as "website" | "airbnb",
  }));
}

export function manualBlockToRange(dateYmd: string): AvailabilityRange {
  const next = formatPropertyDate(addDays(parseISO(dateYmd), 1));
  return { checkIn: dateYmd, checkOut: next, source: "manual" };
}

export async function getManualBlockRanges(
  roomId: number
): Promise<AvailabilityRange[]> {
  await connectMongo();
  const blocked = await RoomCalendarDay.find({ roomId, blocked: true })
    .select("date")
    .lean();
  return blocked.map((b) => manualBlockToRange(b.date));
}

export async function getMergedAvailabilityRanges(
  roomId: number
): Promise<AvailabilityRange[]> {
  const [bookingRanges, manualRanges] = await Promise.all([
    getBookingAvailabilityRanges(roomId),
    getManualBlockRanges(roomId),
  ]);
  return [...bookingRanges, ...manualRanges];
}

export async function stayOverlapsManualBlock(
  roomId: number,
  checkIn: Date,
  checkOut: Date
): Promise<boolean> {
  const checkInYmd = formatPropertyDate(checkIn);
  const checkOutYmd = formatPropertyDate(checkOut);
  const nights = expandBlockedNights(checkInYmd, checkOutYmd);
  if (nights.length === 0) return false;

  await connectMongo();
  const count = await RoomCalendarDay.countDocuments({
    roomId,
    date: { $in: nights },
    blocked: true,
  });
  return count > 0;
}

export async function stayOverlapsAvailability(
  roomId: number,
  checkIn: Date,
  checkOut: Date
): Promise<boolean> {
  const ranges = await getMergedAvailabilityRanges(roomId);
  const blockedSet = buildBlockedNightSet(ranges);
  return rangeOverlapsBlocked(checkIn, checkOut, blockedSet);
}
