import { addDays, parseISO } from "date-fns";
import {
  buildBlockedNightSet,
  expandBlockedNights,
  type AvailabilityRange,
} from "@/lib/booking-availability";
import {
  enumeratePropertyDates,
  resolveNightPrice,
} from "@/lib/room-day-pricing";
import { formatPropertyDate } from "@/lib/property-dates";
import { RoomCalendarDay } from "@/models/RoomCalendarDay";

export type AdminPricingDay = {
  date: string;
  effectivePrice: number;
  basePrice: number;
  hasCustomPrice: boolean;
  blocked: boolean;
  reserved: boolean;
};

export function buildReservedNightSet(
  bookingRanges: AvailabilityRange[]
): Set<string> {
  return buildBlockedNightSet(
    bookingRanges.filter((r) => r.source !== "manual")
  );
}

export function buildAdminPricingDays(params: {
  fromYmd: string;
  toYmdExclusive: string;
  basePrice: number;
  overrides: Map<string, { price?: number; blocked: boolean }>;
  reservedNights: Set<string>;
}): AdminPricingDay[] {
  const dates = enumeratePropertyDates(
    params.fromYmd,
    params.toYmdExclusive
  );
  return dates.map((date) => {
    const override = params.overrides.get(date);
    const reserved = params.reservedNights.has(date);
    const hasCustomPrice = override?.price != null;
    const effectivePrice = resolveNightPrice(
      params.basePrice,
      override?.price
    );
    return {
      date,
      effectivePrice,
      basePrice: params.basePrice,
      hasCustomPrice,
      blocked: override?.blocked ?? false,
      reserved,
    };
  });
}

export function isValidPropertyYmd(ymd: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(ymd) && !isNaN(parseISO(ymd).getTime());
}

export function nextPropertyYmd(ymd: string): string {
  return formatPropertyDate(addDays(parseISO(ymd), 1));
}

/** True if sparse row should be kept in Mongo. */
export function shouldPersistCalendarDay(
  price: number | undefined,
  blocked: boolean
): boolean {
  return blocked || price != null;
}

export async function upsertRoomCalendarDay(params: {
  roomId: number;
  date: string;
  price?: number;
  blocked: boolean;
}): Promise<void> {
  if (!shouldPersistCalendarDay(params.price, params.blocked)) {
    await RoomCalendarDay.deleteOne({
      roomId: params.roomId,
      date: params.date,
    });
    return;
  }

  const update =
    params.price != null
      ? { $set: { blocked: params.blocked, price: params.price } }
      : { $set: { blocked: params.blocked }, $unset: { price: 1 } };

  await RoomCalendarDay.findOneAndUpdate(
    { roomId: params.roomId, date: params.date },
    update,
    { upsert: true }
  );
}

export function nightsInBookingRanges(
  ranges: AvailabilityRange[]
): Set<string> {
  const set = new Set<string>();
  for (const r of ranges) {
    if (r.source === "manual") continue;
    for (const ymd of expandBlockedNights(r.checkIn, r.checkOut)) {
      set.add(ymd);
    }
  }
  return set;
}
