import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { ensureCatalogRoomsSeeded } from "@/lib/room-seed";
import { Room } from "@/models/Room";
import { buildWebsiteExportIcs } from "@/lib/calendar-sync";

type Ctx = { params: Promise<{ roomId: string }> };

// GET /api/rooms/[roomId]/calendar.ics — Airbnb "import calendar" (token required)
export async function GET(request: NextRequest, ctx: Ctx) {
  try {
    await connectMongo();
    await ensureCatalogRoomsSeeded();
    const { roomId: raw } = await ctx.params;
    const roomId = parseInt(raw, 10);
    if (isNaN(roomId)) {
      return NextResponse.json({ error: "Invalid room id" }, { status: 400 });
    }

    const token = request.nextUrl.searchParams.get("token")?.trim() ?? "";
    const doc = await Room.findOne({ roomId }).lean();
    if (!doc) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    if (!token || token !== doc.calendarExportToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ics = await buildWebsiteExportIcs({
      roomId,
      roomTitle: doc.title,
    });

    return new NextResponse(ics, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Cache-Control": "private, max-age=300",
        "Content-Disposition": `attachment; filename="larosa-room-${roomId}.ics"`,
      },
    });
  } catch (err) {
    console.error("[GET calendar.ics]", err);
    return NextResponse.json({ error: "Failed to build calendar" }, { status: 500 });
  }
}
