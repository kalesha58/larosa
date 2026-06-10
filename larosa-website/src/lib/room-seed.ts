import { randomBytes } from "crypto";
import { INITIAL_ROOMS } from "@/lib/room-catalog";
import { assertAllowedAirbnbIcalUrl } from "@/lib/ical-url";
import { Booking } from "@/models/Booking";
import { Room } from "@/models/Room";

const CATALOG_ROOM_IDS = new Set(INITIAL_ROOMS.map((r) => parseInt(r.id, 10)));

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

/** Content fields applied only on first insert — admin edits are preserved. */
function catalogInsertFields(r: (typeof INITIAL_ROOMS)[number]) {
  return {
    title: r.title,
    description: r.description,
    type: r.type,
    category: r.category,
    price: r.price,
    images: r.images,
    amenities: r.amenities,
    capacity: r.capacity,
    sizeSqFt: r.sizeSqFt,
    totalRooms: 1,
    featured: r.featured ?? false,
    status: r.status ?? "active",
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
    const numericId = parseInt(r.id, 10);
    const seedIcal = seedIcalForRoom(numericId);
    const existing = await Room.findOne({ roomId: numericId }).lean();

    const setOnInsert: Record<string, unknown> = {
      roomId: numericId,
      syncEnabled: true,
      syncStatus: "idle",
      calendarExportToken: randomBytes(24).toString("hex"),
      ...catalogInsertFields(r),
    };

    const $set: Record<string, unknown> = {};

    if (seedIcal && !existing?.airbnbIcalUrl?.trim()) {
      $set.airbnbIcalUrl = seedIcal;
    }

    const hadExisting = !!existing;
    const update: Record<string, unknown> = { $setOnInsert: setOnInsert };
    if (Object.keys($set).length > 0) {
      update.$set = $set;
    }

    await Room.findOneAndUpdate(
      { roomId: numericId },
      update,
      { upsert: true }
    );

    if (hadExisting) {
      updated.push(numericId);
    } else {
      upserted.push(numericId);
    }
  }

  const { pruned, skippedWithBookings } = await pruneStaleCatalogRooms();

  return { upserted, updated, pruned, skippedWithBookings };
}
