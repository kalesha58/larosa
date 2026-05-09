import { format, isWithinInterval, parseISO } from "date-fns";

export interface ExternalBooking {
  start: Date;
  end: Date;
  source: string;
  summary?: string;
}

/**
 * Fetches and parses an external iCal feed.
 * @param url The URL of the iCal feed (e.g., from Airbnb).
 * @returns A list of blocked date ranges.
 */
export async function fetchExternalBookings(url: string): Promise<ExternalBooking[]> {
  if (!url) return [];

  try {
    const ical = await import("node-ical");
    const webEvents = await ical.async.fromURL(url);
    const bookings: ExternalBooking[] = [];

    Object.values(webEvents).forEach((event) => {
      if (event && event.type === "VEVENT") {
        const ev = event as ical.VEvent;
        if (ev.start && ev.end) {
          const start = new Date(ev.start as any);
          const end = new Date(ev.end as any);
          
          // Handle summary which can be a string or an object
          let summary = "";
          if (typeof ev.summary === "string") {
            summary = ev.summary;
          } else if (ev.summary && typeof ev.summary === "object" && "val" in ev.summary) {
            summary = (ev.summary as any).val;
          }

          bookings.push({
            start,
            end,
            source: "Airbnb",
            summary,
          });
        }
      }
    });

    return bookings;
  } catch (err) {
    console.error("[ical-service] Failed to fetch or parse external calendar:", err);
    return [];
  }
}

/**
 * Checks if a requested date range overlaps with any external bookings.
 */
export function hasExternalOverlap(
  checkIn: Date,
  checkOut: Date,
  externalBookings: ExternalBooking[]
): boolean {
  return externalBookings.some((booking) => {
    const start = booking.start;
    const end = booking.end;

    // Overlap logic: (StartA < EndB) and (EndA > StartB)
    return checkIn < end && checkOut > start;
  });
}
