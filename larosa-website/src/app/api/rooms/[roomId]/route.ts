import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { connectMongo } from "@/lib/mongodb";
import { requireAdminResponse, isUnauthorized } from "@/lib/auth-guard";
import { ensureCatalogRoomsSeeded } from "@/lib/room-seed";
import { serializeRoom } from "@/lib/room-api";
import { assertAllowedAirbnbIcalUrl } from "@/lib/ical-url";
import { Room } from "@/models/Room";
import { Booking } from "@/models/Booking";

const patchSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  type: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  capacity: z.number().min(1).optional(),
  totalRooms: z.number().min(1).optional(),
  featured: z.boolean().optional(),
  images: z.array(z.string()).min(1).optional(),
  amenities: z.array(z.string()).min(1).optional(),
  sizeSqFt: z.number().min(1).optional(),
  airbnbIcalUrl: z.string().nullable().optional(),
  syncEnabled: z.boolean().optional(),
  regenerateExportToken: z.boolean().optional(),
});

type Ctx = { params: Promise<{ roomId: string }> };

// GET /api/rooms/[roomId]
export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    await connectMongo();
    await ensureCatalogRoomsSeeded();
    const { roomId: raw } = await ctx.params;
    const roomId = parseInt(raw, 10);
    if (isNaN(roomId)) {
      return NextResponse.json({ error: "Invalid room id" }, { status: 400 });
    }
    const doc = await Room.findOne({ roomId }).lean();
    if (!doc) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    return NextResponse.json(serializeRoom(doc));
  } catch (err) {
    console.error("[GET /api/rooms/[roomId]]", err);
    return NextResponse.json({ error: "Failed to load room" }, { status: 500 });
  }
}

// PATCH /api/rooms/[roomId] — admin
export async function PATCH(request: NextRequest, ctx: Ctx) {
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

    const json: unknown = await request.json();
    const parsed = patchSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const { airbnbIcalUrl, regenerateExportToken, ...rest } = data;
    const update: Record<string, unknown> = { ...rest };

    if (airbnbIcalUrl !== undefined) {
      const trimmed = (airbnbIcalUrl ?? "").trim();
      if (trimmed) {
        try {
          assertAllowedAirbnbIcalUrl(trimmed);
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Invalid iCal URL";
          return NextResponse.json({ error: msg }, { status: 400 });
        }
      }
      update.airbnbIcalUrl = trimmed;
    }

    if (regenerateExportToken) {
      update.calendarExportToken = randomBytes(24).toString("hex");
    }

    const doc = await Room.findOneAndUpdate(
      { roomId },
      { $set: update },
      { new: true }
    ).lean();

    if (!doc) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(serializeRoom(doc));
  } catch (err) {
    console.error("[PATCH /api/rooms/[roomId]]", err);
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 });
  }
}

// DELETE /api/rooms/[roomId] — admin
export async function DELETE(_request: NextRequest, ctx: Ctx) {
  const auth = await requireAdminResponse();
  if (isUnauthorized(auth)) return auth;

  try {
    await connectMongo();
    const { roomId: raw } = await ctx.params;
    const roomId = parseInt(raw, 10);
    if (isNaN(roomId)) {
      return NextResponse.json({ error: "Invalid room id" }, { status: 400 });
    }

    const active = await Booking.exists({
      roomId,
      status: { $in: ["pending", "confirmed"] },
    });
    if (active) {
      return NextResponse.json(
        { error: "Cannot delete room with active or pending bookings" },
        { status: 409 }
      );
    }

    const res = await Room.deleteOne({ roomId });
    if (res.deletedCount === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/rooms/[roomId]]", err);
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 });
  }
}
