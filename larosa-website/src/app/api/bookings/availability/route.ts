import { NextRequest, NextResponse } from "next/server";
import { ensureCatalogRoomsSeeded } from "@/lib/room-seed";
import { getMergedAvailabilityRanges } from "@/lib/room-availability-ranges";
import { connectMongo } from "@/lib/mongodb";

// GET /api/bookings/availability?roomId=2
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomIdStr = searchParams.get("roomId");
    if (!roomIdStr) {
      return NextResponse.json(
        { error: "roomId is required" },
        { status: 400 }
      );
    }

    const roomId = parseInt(roomIdStr, 10);
    if (isNaN(roomId)) {
      return NextResponse.json({ error: "Invalid roomId" }, { status: 400 });
    }

    await connectMongo();
    await ensureCatalogRoomsSeeded();

    const ranges = await getMergedAvailabilityRanges(roomId);
    return NextResponse.json(ranges);
  } catch (err) {
    console.error("[GET /api/bookings/availability]", err);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}
