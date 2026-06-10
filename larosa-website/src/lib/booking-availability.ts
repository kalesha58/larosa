import { addDays, parseISO } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  formatPropertyDate,
  propertyStayFromYmd,
} from "@/lib/property-dates";

export type AvailabilityRange = {
  checkIn: string;
  checkOut: string;
  source?: "website" | "airbnb" | "manual";
};

/** Nights blocked for guests: check-in through night before check-out (checkout day stays bookable). */
export function expandBlockedNights(
  checkInYmd: string,
  checkOutYmd: string
): string[] {
  const nights: string[] = [];
  let cursor = parseISO(checkInYmd);
  const end = parseISO(checkOutYmd);
  if (isNaN(cursor.getTime()) || isNaN(end.getTime()) || cursor >= end) {
    return nights;
  }
  while (cursor < end) {
    nights.push(formatPropertyDate(cursor));
    cursor = addDays(cursor, 1);
  }
  return nights;
}

export function buildBlockedNightSet(ranges: AvailabilityRange[]): Set<string> {
  const set = new Set<string>();
  for (const r of ranges) {
    for (const ymd of expandBlockedNights(r.checkIn, r.checkOut)) {
      set.add(ymd);
    }
  }
  return set;
}

export function isDateBlocked(date: Date, blockedSet: Set<string>): boolean {
  return blockedSet.has(formatPropertyDate(date));
}

export function startOfTodayLocal(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isPastDate(date: Date): boolean {
  return formatPropertyDate(date) < formatPropertyDate(startOfTodayLocal());
}

/** True if any night in [from, to) overlaps a blocked night (checkout day exclusive). */
export function rangeOverlapsBlocked(
  from: Date,
  to: Date,
  blockedSet: Set<string>
): boolean {
  const checkInYmd = formatPropertyDate(from);
  const checkOutYmd = formatPropertyDate(to);
  let cursor = parseISO(checkInYmd);
  const end = parseISO(checkOutYmd);
  if (isNaN(cursor.getTime()) || isNaN(end.getTime()) || cursor >= end) {
    return false;
  }
  while (cursor < end) {
    if (blockedSet.has(formatPropertyDate(cursor))) return true;
    cursor = addDays(cursor, 1);
  }
  return false;
}

export function pickerRangeToPropertyYmd(range: DateRange): {
  checkIn: string;
  checkOut: string;
} | null {
  if (!range.from || !range.to) return null;
  return {
    checkIn: formatPropertyDate(range.from),
    checkOut: formatPropertyDate(range.to),
  };
}

/** IST calendar days → ISO instants for API (matches server normalizeStayFromInstant). */
export function pickerRangeToBookingIso(range: DateRange): {
  checkIn: string;
  checkOut: string;
} | null {
  const ymd = pickerRangeToPropertyYmd(range);
  if (!ymd) return null;
  const { checkIn, checkOut } = propertyStayFromYmd(ymd.checkIn, ymd.checkOut);
  return {
    checkIn: checkIn.toISOString(),
    checkOut: checkOut.toISOString(),
  };
}
