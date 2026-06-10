import { NextRequest, NextResponse } from "next/server";
import { getBookingTotal } from "@/lib/booking-pricing";
import { ensureCatalogRoomsSeeded } from "@/lib/room-seed";
import { connectMongo } from "@/lib/mongodb";

// GET /api/bookings/quote?roomId=1&checkIn=...&checkOut=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomIdStr = searchParams.get("roomId");
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    if (!roomIdStr || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: "roomId, checkIn, and checkOut are required" },
        { status: 400 }
      );
    }

    const roomId = parseInt(roomIdStr, 10);
    if (isNaN(roomId)) {
      return NextResponse.json({ error: "Invalid roomId" }, { status: 400 });
    }

    await connectMongo();
    await ensureCatalogRoomsSeeded();

    const pricing = await getBookingTotal(roomId, checkIn, checkOut);
    if (!pricing) {
      return NextResponse.json(
        { error: "Invalid room or stay dates" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      subtotal: pricing.subtotal,
      taxes: pricing.taxes,
      total: pricing.total,
      nights: pricing.nights,
      pricePerNight: pricing.pricePerNight,
      nightlyBreakdown: pricing.nightlyRates,
    });
  } catch (err) {
    console.error("[GET /api/bookings/quote]", err);
    return NextResponse.json(
      { error: "Failed to calculate quote" },
      { status: 500 }
    );
  }
}
