import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { requireAdminResponse, isUnauthorized } from "@/lib/auth-guard";
import { ensureCatalogRoomsSeeded } from "@/lib/room-seed";
import {
  activeBookingMongoFilter,
  adminCalendarDateWindow,
  formatPropertyDate,
} from "@/lib/active-booking-filter";
import { calendarDisplayTitle } from "@/lib/airbnb-event-label";
import { Booking } from "@/models/Booking";

type Ctx = { params: Promise<{ roomId: string }> };

// GET /api/admin/rooms/[roomId]/calendar — admin room calendar events
export async function GET(_req: NextRequest, ctx: Ctx) {
  const auth = await requireAdminResponse();
  if (isUnauthorized(auth)) return auth;

  try {
    await connectMongo();
    await ensureCatalogRoomsSeeded();
    const { roomId: raw } = await ctx.params;
    const roomId = parseInt(raw, 10);
    if (isNaN(roomId)) {
      return NextResponse.json({ error: "Invalid room id" }, { status: 400 });
    }

    const bookings = await Booking.find({
      ...activeBookingMongoFilter(roomId),
      ...adminCalendarDateWindow(),
    })
      .select("checkIn checkOut source guestName status")
      .sort({ checkIn: 1 })
      .lean();

    return NextResponse.json(
      bookings.map((b) => {
        const source = (b.source ?? "website") as "website" | "airbnb";
        const { displayTitle, airbnbKind } = calendarDisplayTitle({
          source,
          guestName: b.guestName,
          status: b.status,
        });
        return {
          id: b._id.toString(),
          checkIn: formatPropertyDate(b.checkIn),
          checkOut: formatPropertyDate(b.checkOut),
          source,
          guestName: b.guestName,
          status: b.status,
          displayTitle,
          ...(airbnbKind ? { airbnbKind } : {}),
        };
      })
    );
  } catch (err) {
    console.error("[GET /api/admin/rooms/[roomId]/calendar]", err);
    return NextResponse.json(
      { error: "Failed to fetch calendar" },
      { status: 500 }
    );
  }
}
