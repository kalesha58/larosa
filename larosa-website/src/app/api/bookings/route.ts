import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectMongo } from "@/lib/mongodb";
import { Booking, hasOverlap } from "@/models/Booking";
import { INITIAL_ROOMS } from "@/lib/room-catalog";

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

// GET /api/bookings — list all bookings (admin use)
export async function GET() {
  try {
    await connectMongo();
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .lean();

    const serialized = bookings.map((b) => ({
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
      specialRequests: b.specialRequests ?? "",
      razorpayOrderId: b.razorpayOrderId ?? "",
      razorpayPaymentId: b.razorpayPaymentId ?? "",
      createdAt: b.createdAt.toISOString(),
    }));

    return NextResponse.json(serialized);
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

    const json: unknown = await request.json();
    const parsed = createSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const room = INITIAL_ROOMS.find((r) => r.id === data.roomId);
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);

    // Validate dates
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return NextResponse.json(
        { error: "Invalid dates" },
        { status: 400 }
      );
    }
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

    // OVERLAP CHECK — core business rule
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

    const nights = Math.max(
      1,
      Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    );
    const subtotal = room.price * nights;
    const taxes = Math.round(subtotal * 0.12); // 12% GST
    const totalPrice = subtotal + taxes;

    const booking = await Booking.create({
      roomId: room.id,
      roomTitle: room.title,
      roomType: room.type,
      pricePerNight: room.price,
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
