import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";
import { Room } from "@/models/Room";
import { format } from "date-fns";

// GET /api/rooms/[id]/calendar/export
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connectMongo();

    const room = await Room.findById(id);
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Fetch all confirmed bookings for this room
    const bookings = await Booking.find({
      roomId: id,
      status: "confirmed",
    });

    // Generate iCal content manually to avoid extra dependencies
    // Standard RFC 5545 format
    let ical = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Larosa Luxury//Property Management System//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      `X-WR-CALNAME:Larosa - ${room.title}`,
      "X-WR-TIMEZONE:UTC",
    ];

    bookings.forEach((booking) => {
      const dtStart = format(new Date(booking.checkIn), "yyyyMMdd");
      const dtEnd = format(new Date(booking.checkOut), "yyyyMMdd");
      const dtStamp = format(new Date(), "yyyyMMdd'T'HHmmss'Z'");
      const uid = `${booking._id}@larosa.co.in`;

      ical.push(
        "BEGIN:VEVENT",
        `DTSTAMP:${dtStamp}`,
        `DTSTART;VALUE=DATE:${dtStart}`,
        `DTEND;VALUE=DATE:${dtEnd}`,
        `UID:${uid}`,
        `SUMMARY:Reserved - ${booking.guestName}`,
        "DESCRIPTION:Booking via Larosa Website",
        "STATUS:CONFIRMED",
        "END:VEVENT"
      );
    });

    ical.push("END:VCALENDAR");

    const content = ical.join("\r\n");

    return new Response(content, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="room-${id}.ics"`,
      },
    });
  } catch (err) {
    console.error("[GET /api/rooms/[id]/calendar/export]", err);
    return NextResponse.json(
      { error: "Failed to export calendar" },
      { status: 500 }
    );
  }
}
