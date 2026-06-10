import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { requireAdminResponse, isUnauthorized } from "@/lib/auth-guard";
import { ensureCatalogRoomsSeeded } from "@/lib/room-seed";
import { syncRoomFromAirbnb } from "@/lib/calendar-sync";

type Ctx = { params: Promise<{ roomId: string }> };

// POST /api/rooms/[roomId]/sync — admin manual Airbnb import
export async function POST(_req: NextRequest, ctx: Ctx) {
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

    const result = await syncRoomFromAirbnb(roomId);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[POST /api/rooms/[roomId]/sync]", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
