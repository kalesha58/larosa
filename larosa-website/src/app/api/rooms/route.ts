import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { connectMongo } from "@/lib/mongodb";
import { requireAdminResponse, isUnauthorized } from "@/lib/auth-guard";
import { ensureCatalogRoomsSeeded } from "@/lib/room-seed";
import { serializeRoom } from "@/lib/room-api";
import { assertAllowedAirbnbIcalUrl } from "@/lib/ical-url";
import { Room, getNextRoomId } from "@/models/Room";

const listFilters = z.object({
  type: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  capacity: z.coerce.number().optional(),
});

const createSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  type: z.string().min(1),
  price: z.number().min(0),
  capacity: z.number().min(1),
  totalRooms: z.number().min(1),
  featured: z.boolean().optional(),
  images: z.array(z.string()).min(1),
  amenities: z.array(z.string()).min(1),
  sizeSqFt: z.number().min(1).optional(),
  airbnbIcalUrl: z.string().optional(),
  syncEnabled: z.boolean().optional(),
});

function applyFilters<T extends { type: string; price: number; capacity: number }>(
  rooms: T[],
  filters: z.infer<typeof listFilters>
): T[] {
  let list = [...rooms];
  if (filters.type && filters.type !== "all") {
    list = list.filter((r) => r.type === filters.type);
  }
  if (typeof filters.minPrice === "number") {
    list = list.filter((r) => r.price >= filters.minPrice!);
  }
  if (typeof filters.maxPrice === "number") {
    list = list.filter((r) => r.price <= filters.maxPrice!);
  }
  if (typeof filters.capacity === "number") {
    list = list.filter((r) => r.capacity >= filters.capacity!);
  }
  return list;
}

// GET /api/rooms — public list (optional filters)
export async function GET(request: NextRequest) {
  try {
    await connectMongo();
    await ensureCatalogRoomsSeeded();

    const sp = request.nextUrl.searchParams;
    const parsed = listFilters.safeParse({
      type: sp.get("type") ?? undefined,
      minPrice: sp.get("minPrice") ?? undefined,
      maxPrice: sp.get("maxPrice") ?? undefined,
      capacity: sp.get("capacity") ?? undefined,
    });
    const filters = parsed.success ? parsed.data : {};

    const docs = await Room.find().sort({ roomId: 1 }).lean();
    const serialized = docs.map(serializeRoom);
    const filtered = applyFilters(serialized, filters);

    return NextResponse.json(filtered);
  } catch (err) {
    console.error("[GET /api/rooms]", err);
    return NextResponse.json(
      { error: "Failed to load rooms" },
      { status: 500 }
    );
  }
}

// POST /api/rooms — admin create
export async function POST(request: NextRequest) {
  const auth = await requireAdminResponse();
  if (isUnauthorized(auth)) return auth;

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
    const icalUrl = (data.airbnbIcalUrl ?? "").trim();
    if (icalUrl) {
      try {
        assertAllowedAirbnbIcalUrl(icalUrl);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Invalid iCal URL";
        return NextResponse.json({ error: msg }, { status: 400 });
      }
    }

    const roomId = await getNextRoomId();
    const doc = await Room.create({
      roomId,
      title: data.title,
      description: data.description,
      type: data.type,
      price: data.price,
      images: data.images,
      amenities: data.amenities,
      capacity: data.capacity,
      sizeSqFt: data.sizeSqFt ?? 600,
      totalRooms: data.totalRooms,
      featured: data.featured ?? false,
      airbnbIcalUrl: icalUrl,
      syncEnabled: data.syncEnabled ?? true,
      syncStatus: "idle",
      calendarExportToken: randomBytes(24).toString("hex"),
    });

    return NextResponse.json(serializeRoom(doc.toObject()), { status: 201 });
  } catch (err) {
    console.error("[POST /api/rooms]", err);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}
