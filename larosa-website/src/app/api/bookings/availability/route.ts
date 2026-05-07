import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";

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
      return NextResponse.json(
        { error: "Invalid roomId" },
        { status: 400 }
      );
    }

    await connectMongo();

    // Only return confirmed bookings (cancelled ones free up the dates)
    const bookings = await Booking.find({
      roomId,
      status: "confirmed",
      checkOut: { $gte: new Date() }, // only future/current bookings
    })
      .select("checkIn checkOut")
      .lean();

    const ranges = bookings.map((b) => ({
      checkIn: b.checkIn.toISOString().split("T")[0],
      checkOut: b.checkOut.toISOString().split("T")[0],
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
