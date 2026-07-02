import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";
import { findRoomById, resolveBookingRoomIds } from "@/lib/room-api";
import { fetchExternalBookings } from "@/lib/ical-service";

// GET /api/bookings/availability?roomId=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");
    if (!roomId) {
      return NextResponse.json({ error: "roomId is required" }, { status: 400 });
    }

    await connectMongo();

    const roomIds = await resolveBookingRoomIds(roomId);

    // 1. Fetch internal confirmed bookings
    const internalBookings = await Booking.find({
      roomId: roomIds.length === 1 ? roomIds[0] : { $in: roomIds },
      status: "confirmed",
      checkOut: { $gte: new Date() },
    }).select("checkIn checkOut").lean();

    const ranges = internalBookings.map((b) => ({
      checkIn: b.checkIn.toISOString().split("T")[0],
      checkOut: b.checkOut.toISOString().split("T")[0],
      source: "Larosa",
    }));

    // 2. Fetch external Airbnb bookings if configured
    const room = await findRoomById(roomId);
    if (room?.airbnbIcalUrl) {
      const externalBookings = await fetchExternalBookings(room.airbnbIcalUrl);
      externalBookings.forEach((eb) => {
        ranges.push({
          checkIn: eb.start.toISOString().split("T")[0],
          checkOut: eb.end.toISOString().split("T")[0],
          source: eb.source,
        });
      });
    }

    return NextResponse.json(ranges);
  } catch (err) {
    console.error("[GET /api/bookings/availability]", err);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}
