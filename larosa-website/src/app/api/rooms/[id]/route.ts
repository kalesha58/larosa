import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Room } from "@/models/Room";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectMongo();
    const room = await Room.findById(id);
    
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...room.toObject(),
      id: room._id.toString(),
    });
  } catch (err) {
    console.error("[api/rooms/[id]] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch room" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectMongo();
    const body = await request.json();
    
    const room = await Room.findByIdAndUpdate(id, body, { new: true });
    
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...room.toObject(),
      id: room._id.toString(),
    });
  } catch (err) {
    console.error("[api/rooms/[id]] PATCH error:", err);
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectMongo();
    const room = await Room.findByIdAndDelete(id);
    
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/rooms/[id]] DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 });
  }
}
