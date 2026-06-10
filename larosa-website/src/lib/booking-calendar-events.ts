import type { EventInput } from "@fullcalendar/core";
import type { AirbnbEventKind } from "@/lib/airbnb-event-label";
import { calendarDisplayTitle } from "@/lib/airbnb-event-label";

export type AdminCalendarBooking = {
  id: string;
  checkIn: string;
  checkOut: string;
  source: "website" | "airbnb";
  guestName: string;
  status: string;
  displayTitle?: string;
  airbnbKind?: AirbnbEventKind;
};

export const CALENDAR_COLORS = {
  airbnbBooking: "hsl(0 72% 51%)",
  airbnbBlocked: "hsl(0 0% 28%)",
  airbnbOther: "hsl(25 85% 45%)",
  website: "hsl(220 65% 42%)",
} as const;

function colorForBooking(b: AdminCalendarBooking): string {
  if (b.source === "website") return CALENDAR_COLORS.website;
  const kind = b.airbnbKind ?? "other";
  switch (kind) {
    case "booking":
      return CALENDAR_COLORS.airbnbBooking;
    case "blocked":
      return CALENDAR_COLORS.airbnbBlocked;
    default:
      return CALENDAR_COLORS.airbnbOther;
  }
}

export function bookingsToFullCalendarEvents(
  bookings: AdminCalendarBooking[]
): EventInput[] {
  return bookings.map((b, index) => {
    const { displayTitle, airbnbKind } =
      b.displayTitle != null
        ? {
            displayTitle: b.displayTitle,
            airbnbKind: b.airbnbKind,
          }
        : calendarDisplayTitle({
            source: b.source,
            guestName: b.guestName,
            status: b.status,
            airbnbKind: b.airbnbKind,
          });

    const color = colorForBooking({
      ...b,
      airbnbKind: b.source === "airbnb" ? airbnbKind : undefined,
    });

    // Plain YYYY-MM-DD all-day events (no calendar timeZone) — matches Airbnb DATE rows.
    return {
      id: `${b.id}-${b.checkIn}-${index}`,
      title: displayTitle,
      start: b.checkIn,
      end: b.checkOut,
      allDay: true,
      backgroundColor: color,
      borderColor: color,
      extendedProps: {
        bookingId: b.id,
        source: b.source,
        status: b.status,
        guestName: b.guestName,
        displayTitle,
        airbnbKind,
        checkIn: b.checkIn,
        checkOut: b.checkOut,
      },
    };
  });
}
