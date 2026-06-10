import { randomBytes } from "crypto";
import { INITIAL_ROOMS } from "@/lib/room-catalog";
import { assertAllowedAirbnbIcalUrl } from "@/lib/ical-url";
import { Booking } from "@/models/Booking";
import { Room } from "@/models/Room";

const CATALOG_ROOM_IDS = new Set(INITIAL_ROOMS.map((r) => r.id));

const SEED_ICAL_BY_ROOM: Record<number, string> = {
  1: "SEED_AIRBNB_ICAL_URL",
  2: "SEED_AIRBNB_ICAL_URL_2",
};

export type CatalogSeedResult = {
  upserted: number[];
  updated: number[];
  pruned: number[];
  skippedWithBookings: number[];
};

function seedIcalForRoom(roomId: number): string {
  const envKey = SEED_ICAL_BY_ROOM[roomId];
  if (!envKey) return "";
  const raw = process.env[envKey]?.trim() ?? "";
  if (!raw) return "";
  try {
    assertAllowedAirbnbIcalUrl(raw);
    return raw;
  } catch (e) {
    console.warn(
      `[room-seed] Skipping invalid ${envKey} for roomId ${roomId}:`,
      e instanceof Error ? e.message : e
    );
    return "";
  }
}

function catalogSetFields(r: (typeof INITIAL_ROOMS)[number]) {
  return {
    title: r.title,
    description: r.description,
    type: r.type,
    price: r.price,
    images: r.images,
    amenities: r.amenities,
    capacity: r.capacity,
    sizeSqFt: r.sizeSqFt,
    totalRooms: 1,
    featured: r.featured ?? false,
  };
}

async function pruneStaleCatalogRooms(): Promise<{
  pruned: number[];
  skippedWithBookings: number[];
}> {
  const pruned: number[] = [];
  const skippedWithBookings: number[] = [];

  const all = await Room.find({}, { roomId: 1 }).lean();
  for (const doc of all) {
    const roomId = doc.roomId;
    if (CATALOG_ROOM_IDS.has(roomId)) continue;

    const bookingCount = await Booking.countDocuments({ roomId });
    if (bookingCount > 0) {
      console.warn(
        `[room-seed] Skipping prune of roomId ${roomId}: ${bookingCount} booking(s) exist`
      );
      skippedWithBookings.push(roomId);
      continue;
    }

    await Room.deleteOne({ roomId });
    pruned.push(roomId);
  }

  return { pruned, skippedWithBookings };
}

/**
 * Upsert catalog villas by stable `roomId`, sync metadata from INITIAL_ROOMS,
 * prune stale roomIds without bookings. Idempotent; safe on every API load.
 */
export async function ensureCatalogRoomsSeeded(): Promise<CatalogSeedResult> {
  const upserted: number[] = [];
  const updated: number[] = [];

  for (const r of INITIAL_ROOMS) {
    const seedIcal = seedIcalForRoom(r.id);
    const existing = await Room.findOne({ roomId: r.id }).lean();

    const setOnInsert: Record<string, unknown> = {
      roomId: r.id,
      syncEnabled: true,
      syncStatus: "idle",
      calendarExportToken: randomBytes(24).toString("hex"),
    };

    const $set: Record<string, unknown> = catalogSetFields(r);

    if (seedIcal && !existing?.airbnbIcalUrl?.trim()) {
      $set.airbnbIcalUrl = seedIcal;
    }

    const hadExisting = !!existing;
    await Room.findOneAndUpdate(
      { roomId: r.id },
      { $setOnInsert: setOnInsert, $set },
      { upsert: true }
    );

    if (hadExisting) {
      updated.push(r.id);
    } else {
      upserted.push(r.id);
    }
  }

  const { pruned, skippedWithBookings } = await pruneStaleCatalogRooms();

  return { upserted, updated, pruned, skippedWithBookings };
}
