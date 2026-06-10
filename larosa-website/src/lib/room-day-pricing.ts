import { addDays, parseISO } from "date-fns";
import { connectMongo } from "@/lib/mongodb";
import { expandBlockedNights } from "@/lib/booking-availability";
import { formatPropertyDate } from "@/lib/property-dates";
import { Room } from "@/models/Room";
import { RoomCalendarDay } from "@/models/RoomCalendarDay";

export type NightlyRate = { date: string; price: number };

export function resolveNightPrice(
  basePrice: number,
  override?: number | null
): number {
  if (override != null && override >= 0) return override;
  return basePrice;
}

export async function getRoomCalendarDayMap(
  roomId: number,
  dates: string[]
): Promise<Map<string, { price?: number; blocked: boolean }>> {
  if (dates.length === 0) return new Map();
  await connectMongo();
  const days = await RoomCalendarDay.find({
    roomId,
    date: { $in: dates },
  }).lean();
  const map = new Map<string, { price?: number; blocked: boolean }>();
  for (const d of days) {
    map.set(d.date, {
      price: d.price,
      blocked: d.blocked ?? false,
    });
  }
  return map;
}

export async function getNightlyRates(
  roomId: number,
  checkInYmd: string,
  checkOutYmd: string
): Promise<NightlyRate[]> {
  await connectMongo();
  const room = await Room.findOne({ roomId }).lean();
  if (!room) return [];

  const nights = expandBlockedNights(checkInYmd, checkOutYmd);
  if (nights.length === 0) return [];

  const dayMap = await getRoomCalendarDayMap(roomId, nights);
  return nights.map((date) => ({
    date,
    price: resolveNightPrice(room.price, dayMap.get(date)?.price),
  }));
}

export function sumNightlyRates(rates: NightlyRate[]): number {
  return rates.reduce((sum, r) => sum + r.price, 0);
}

export function enumeratePropertyDates(
  fromYmd: string,
  toYmdExclusive: string
): string[] {
  const nights: string[] = [];
  let cursor = parseISO(fromYmd);
  const end = parseISO(toYmdExclusive);
  if (isNaN(cursor.getTime()) || isNaN(end.getTime()) || cursor >= end) {
    return nights;
  }
  while (cursor < end) {
    nights.push(formatPropertyDate(cursor));
    cursor = addDays(cursor, 1);
  }
  return nights;
}
