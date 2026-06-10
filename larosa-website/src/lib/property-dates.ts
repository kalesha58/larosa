import { fromZonedTime } from "date-fns-tz";

/** La Rosa property calendar timezone (check-in/out calendar days). */
export const PROPERTY_TIMEZONE = "Asia/Kolkata";

/** Format an instant as YYYY-MM-DD in the property timezone. */
export function formatPropertyDate(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PROPERTY_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function instantToPropertyDate(d: Date): string {
  return formatPropertyDate(d);
}

/**
 * Map node-ical DATE (VALUE=DATE) or DATE-TIME to a property calendar YYYY-MM-DD.
 * Airbnb all-day rows are floating dates for the listing (IST).
 */
export function icalDateToPropertyYmd(d: Date): string {
  return formatPropertyDate(d);
}

/** Mongo instants for an inclusive check-in / exclusive check-out pair of YMD strings. */
export function propertyStayFromYmd(checkInYmd: string, checkOutYmd: string): {
  checkIn: Date;
  checkOut: Date;
} {
  return {
    checkIn: propertyDateToInstant(checkInYmd),
    checkOut: propertyDateToInstant(checkOutYmd),
  };
}

/** Start of calendar day in PROPERTY_TIMEZONE as a UTC instant (for Mongo). */
export function propertyDateToInstant(ymd: string): Date {
  return fromZonedTime(`${ymd}T00:00:00`, PROPERTY_TIMEZONE);
}

/** Map any instants to IST calendar-day boundaries (check-out day still exclusive in overlap logic). */
export function normalizeStayFromInstant(
  checkIn: Date,
  checkOut: Date
): { checkIn: Date; checkOut: Date } {
  const inYmd = instantToPropertyDate(checkIn);
  const outYmd = instantToPropertyDate(checkOut);
  return {
    checkIn: propertyDateToInstant(inYmd),
    checkOut: propertyDateToInstant(outYmd),
  };
}

/** Display YYYY-MM-DD in UI without timezone shift from parseISO. */
export function formatPropertyDateLabel(ymd: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!match) return ymd;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: PROPERTY_TIMEZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(Date.UTC(y, m - 1, d, 12, 0, 0)));
}
