import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Room } from "@/models/Room";

export async function GET(request: Request) {
  try {
    await connectMongo();
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";
    
    // If not admin, only show active rooms
    const query = isAdmin ? {} : { status: "active" };
    
    const rooms = await Room.find(query).sort({ createdAt: -1 });
    
    // Map _id to id for frontend compatibility
    const formattedRooms = rooms.map(room => ({
      ...room.toObject(),
      id: room._id.toString(),
    }));

    return NextResponse.json(formattedRooms);
  } catch (err) {
    console.error("[api/rooms] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectMongo();
    const body = await request.json();
    
    const room = await Room.create(body);
    
    return NextResponse.json({
      ...room.toObject(),
      id: room._id.toString(),
    });
  } catch (err) {
    console.error("[api/rooms] POST error:", err);
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}
