import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { requireAdminResponse, isUnauthorized } from "@/lib/auth-guard";
import { ensureCatalogRoomsSeeded } from "@/lib/room-seed";
import { serializeRoom } from "@/lib/room-api";
import { Room } from "@/models/Room";
import { randomBytes } from "crypto";

// GET /api/rooms — list all rooms (public: active only; admin: all)
export async function GET(request: NextRequest) {
  try {
    await connectMongo();
    await ensureCatalogRoomsSeeded();

    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";
    const typeFilter = searchParams.get("type");

    const query: Record<string, unknown> = isAdmin ? {} : { status: "active" };
    if (typeFilter && typeFilter !== "all") {
      query.type = typeFilter;
    }

    const rooms = await Room.find(query).sort({ roomId: 1 }).lean();
    return NextResponse.json(rooms.map(serializeRoom));
  } catch (err) {
    console.error("[GET /api/rooms]", err);
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}

// POST /api/rooms — create a new room (admin only)
export async function POST(request: NextRequest) {
  const auth = await requireAdminResponse();
  if (isUnauthorized(auth)) return auth;

  try {
    await connectMongo();
    const body = await request.json();

    // Auto-assign the next roomId
    const last = await Room.findOne().sort({ roomId: -1 }).lean();
    const nextId = (last?.roomId ?? 0) + 1;

    const room = await Room.create({
      ...body,
      roomId: nextId,
      calendarExportToken: randomBytes(24).toString("hex"),
      syncEnabled: true,
      syncStatus: "idle",
    });

    return NextResponse.json(serializeRoom(room.toObject()));
  } catch (err) {
    console.error("[POST /api/rooms]", err);
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}
