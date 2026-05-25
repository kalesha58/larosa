import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { requireAdminResponse, isUnauthorized } from "@/lib/auth-guard";
import {
  activeBookingMongoFilter,
  adminCalendarDateWindow,
  formatPropertyDate,
} from "@/lib/active-booking-filter";
import { calendarDisplayTitle } from "@/lib/airbnb-event-label";
import {
  buildAdminPricingDays,
  buildReservedNightSet,
  isValidPropertyYmd,
} from "@/lib/admin-room-pricing";
import {
  enumeratePropertyDates,
  getRoomCalendarDayMap,
} from "@/lib/room-day-pricing";
import { getBookingAvailabilityRanges } from "@/lib/room-availability-ranges";
import { ensureCatalogRoomsSeeded } from "@/lib/room-seed";
import { Booking } from "@/models/Booking";
import { Room } from "@/models/Room";

type Ctx = { params: Promise<{ roomId: string }> };

// GET /api/admin/rooms/[roomId]/pricing?from=YYYY-MM-DD&to=YYYY-MM-DD
export async function GET(req: NextRequest, ctx: Ctx) {
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

    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    if (!from || !to || !isValidPropertyYmd(from) || !isValidPropertyYmd(to)) {
      return NextResponse.json(
        { error: "from and to (YYYY-MM-DD) are required" },
        { status: 400 }
      );
    }
    if (from >= to) {
      return NextResponse.json(
        { error: "from must be before to" },
        { status: 400 }
      );
    }

    const room = await Room.findOne({ roomId }).lean();
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const [bookingRanges, calendarDays, bookings] = await Promise.all([
      getBookingAvailabilityRanges(roomId),
      getRoomCalendarDayMap(roomId, enumeratePropertyDates(from, to)),
      Booking.find({
        ...activeBookingMongoFilter(roomId),
        ...adminCalendarDateWindow(),
      })
        .select("checkIn checkOut source guestName status")
        .sort({ checkIn: 1 })
        .lean(),
    ]);

    const reservedNights = buildReservedNightSet(bookingRanges);
    const days = buildAdminPricingDays({
      fromYmd: from,
      toYmdExclusive: to,
      basePrice: room.price,
      overrides: calendarDays,
      reservedNights,
    });

    const overrides = [...calendarDays.entries()].map(([date, v]) => ({
      date,
      ...(v.price != null ? { price: v.price } : {}),
      blocked: v.blocked,
    }));

    return NextResponse.json({
      roomId,
      roomTitle: room.title,
      basePrice: room.price,
      days,
      overrides,
      bookings: bookings.map((b) => {
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
      }),
    });
  } catch (err) {
    console.error("[GET /api/admin/rooms/[roomId]/pricing]", err);
    return NextResponse.json(
      { error: "Failed to fetch pricing calendar" },
      { status: 500 }
    );
  }
}
