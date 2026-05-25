import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectMongo } from "@/lib/mongodb";
import { requireAdminResponse, isUnauthorized } from "@/lib/auth-guard";
import {
  buildReservedNightSet,
  isValidPropertyYmd,
  nightsInBookingRanges,
  shouldPersistCalendarDay,
  upsertRoomCalendarDay,
} from "@/lib/admin-room-pricing";
import { getBookingAvailabilityRanges } from "@/lib/room-availability-ranges";
import { ensureCatalogRoomsSeeded } from "@/lib/room-seed";
import { RoomCalendarDay } from "@/models/RoomCalendarDay";
import { Room } from "@/models/Room";

type Ctx = { params: Promise<{ roomId: string }> };

const bodySchema = z.object({
  date: z.string(),
  price: z.number().min(0).nullable().optional(),
  blocked: z.boolean().optional(),
});

// PUT /api/admin/rooms/[roomId]/pricing/day
export async function PUT(req: NextRequest, ctx: Ctx) {
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

    const room = await Room.findOne({ roomId }).lean();
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const json: unknown = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { date } = parsed.data;
    if (!isValidPropertyYmd(date)) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    const bookingRanges = await getBookingAvailabilityRanges(roomId);
    const reservedNights = buildReservedNightSet(bookingRanges);

    if (reservedNights.has(date)) {
      return NextResponse.json(
        { error: "This date is reserved and cannot be edited" },
        { status: 409 }
      );
    }

    const existing = await RoomCalendarDay.findOne({ roomId, date }).lean();

    let price: number | undefined = existing?.price ?? undefined;
    let blocked = existing?.blocked ?? false;

    const hasPrice = parsed.data.price !== undefined;
    const hasBlocked = parsed.data.blocked !== undefined;

    if (hasPrice) {
      price = parsed.data.price === null ? undefined : parsed.data.price;
    }
    if (hasBlocked) {
      blocked = parsed.data.blocked!;
    }

    if (!hasPrice && !hasBlocked) {
      return NextResponse.json(
        { error: "Provide price and/or blocked" },
        { status: 400 }
      );
    }

    if (!shouldPersistCalendarDay(price, blocked)) {
      await RoomCalendarDay.deleteOne({ roomId, date });
    } else {
      await upsertRoomCalendarDay({ roomId, date, price, blocked });
    }

    const effectivePrice =
      price != null && price >= 0 ? price : room.price;

    return NextResponse.json({
      date,
      effectivePrice,
      basePrice: room.price,
      hasCustomPrice: price != null,
      blocked,
      reserved: nightsInBookingRanges(bookingRanges).has(date),
    });
  } catch (err) {
    console.error("[PUT /api/admin/rooms/[roomId]/pricing/day]", err);
    return NextResponse.json(
      { error: "Failed to update day" },
      { status: 500 }
    );
  }
}
