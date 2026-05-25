import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectMongo } from "@/lib/mongodb";
import { getBookingTotal } from "@/lib/booking-pricing";
import { normalizeStayFromInstant } from "@/lib/property-dates";
import { stayOverlapsManualBlock } from "@/lib/room-availability-ranges";
import { Booking, hasOverlap } from "@/models/Booking";
import { Room } from "@/models/Room";
import { getAuthPayload } from "@/lib/auth-guard";
import { ensureCatalogRoomsSeeded } from "@/lib/room-seed";

const createSchema = z.object({
  roomId: z.number().int().positive(),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().int().positive(),
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().optional(),
  specialRequests: z.string().optional(),
});

function serializeBooking(b: {
  _id: { toString: () => string };
  roomId: number;
  roomTitle: string;
  roomType: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: number;
  totalPrice: number;
  status: string;
  source?: string;
  specialRequests?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: Date;
}) {
  return {
    id: b._id.toString(),
    roomId: b.roomId,
    room: {
      id: b.roomId,
      title: b.roomTitle,
      type: b.roomType,
    },
    guestName: b.guestName,
    guestEmail: b.guestEmail,
    guestPhone: b.guestPhone ?? "",
    checkIn: b.checkIn.toISOString(),
    checkOut: b.checkOut.toISOString(),
    nights: b.nights,
    guests: b.guests,
    totalPrice: b.totalPrice,
    status: b.status,
    source: b.source ?? "website",
    specialRequests: b.specialRequests ?? "",
    razorpayOrderId: b.razorpayOrderId ?? "",
    razorpayPaymentId: b.razorpayPaymentId ?? "",
    createdAt: b.createdAt.toISOString(),
  };
}

// GET /api/bookings — admin: all; user: own bookings only
export async function GET() {
  try {
    const session = await getAuthPayload();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    await ensureCatalogRoomsSeeded();

    const filter =
      session.role === "admin"
        ? {}
        : { guestEmail: session.email.toLowerCase() };

    const bookings = await Booking.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json(bookings.map(serializeBooking));
  } catch (err) {
    console.error("[GET /api/bookings]", err);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST /api/bookings — create a new pending booking (before payment)
export async function POST(request: NextRequest) {
  try {
    await connectMongo();
    await ensureCatalogRoomsSeeded();

    const json: unknown = await request.json();
    const parsed = createSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const room = await Room.findOne({ roomId: data.roomId }).lean();
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const rawCheckIn = new Date(data.checkIn);
    const rawCheckOut = new Date(data.checkOut);

    if (isNaN(rawCheckIn.getTime()) || isNaN(rawCheckOut.getTime())) {
      return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
    }
    const { checkIn, checkOut } = normalizeStayFromInstant(
      rawCheckIn,
      rawCheckOut
    );

    if (checkIn >= checkOut) {
      return NextResponse.json(
        { error: "Check-in must be before check-out" },
        { status: 400 }
      );
    }
    if (checkIn < new Date()) {
      return NextResponse.json(
        { error: "Check-in date cannot be in the past" },
        { status: 400 }
      );
    }

    const conflict = await hasOverlap(data.roomId, checkIn, checkOut);
    if (conflict) {
      return NextResponse.json(
        {
          error: "These dates are already booked",
          code: "DATES_UNAVAILABLE",
        },
        { status: 409 }
      );
    }

    const manualBlock = await stayOverlapsManualBlock(
      data.roomId,
      checkIn,
      checkOut
    );
    if (manualBlock) {
      return NextResponse.json(
        {
          error: "These dates are not available",
          code: "DATES_UNAVAILABLE",
        },
        { status: 409 }
      );
    }

    const pricing = await getBookingTotal(
      data.roomId,
      checkIn.toISOString(),
      checkOut.toISOString()
    );
    if (!pricing) {
      return NextResponse.json({ error: "Invalid stay dates" }, { status: 400 });
    }

    const { nights, subtotal, taxes, total: totalPrice, pricePerNight } =
      pricing;

    const booking = await Booking.create({
      roomId: room.roomId,
      roomTitle: room.title,
      roomType: room.type,
      pricePerNight,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      checkIn,
      checkOut,
      nights,
      guests: data.guests,
      totalPrice,
      specialRequests: data.specialRequests,
      status: "pending",
      source: "website",
    });

    return NextResponse.json(
      {
        bookingId: booking._id.toString(),
        totalPrice,
        nights,
        subtotal,
        taxes,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/bookings]", err);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
