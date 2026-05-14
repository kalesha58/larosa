import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Booking, PENDING_BOOKING_HOLD_MS } from "@/models/Booking";
import { ensureCatalogRoomsSeeded } from "@/lib/room-seed";

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

    const holdSince = new Date(Date.now() - PENDING_BOOKING_HOLD_MS);

    const bookings = await Booking.find({
      roomId,
      status: { $ne: "cancelled" },
      checkOut: { $gte: new Date() },
      $or: [
        { status: "confirmed" },
        {
          status: "pending",
          createdAt: { $gte: holdSince },
          $or: [{ source: "website" }, { source: { $exists: false } }],
        },
      ],
    })
      .select("checkIn checkOut source")
      .lean();

    const ranges = bookings.map((b) => ({
      checkIn: b.checkIn.toISOString().split("T")[0],
      checkOut: b.checkOut.toISOString().split("T")[0],
      source: (b.source ?? "website") as "website" | "airbnb",
    }));

    return NextResponse.json(ranges);
  } catch (err) {
    console.error("[GET /api/bookings/availability]", err);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}
