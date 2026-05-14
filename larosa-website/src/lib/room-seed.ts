import { randomBytes } from "crypto";
import { INITIAL_ROOMS } from "@/lib/room-catalog";
import { Room } from "@/models/Room";

/** Inserts catalog rooms when the collection is empty (first deploy / fresh DB). */
export async function ensureCatalogRoomsSeeded(): Promise<void> {
  const count = await Room.countDocuments();
  if (count > 0) return;

  const docs = INITIAL_ROOMS.map((r) => ({
    roomId: r.id,
    title: r.title,
    description: r.description,
    type: r.type,
    price: r.price,
    images: r.images,
    amenities: r.amenities,
    capacity: r.capacity,
    sizeSqFt: r.sizeSqFt,
    totalRooms: r.totalRooms,
    featured: r.featured ?? false,
    airbnbIcalUrl: "",
    syncEnabled: true,
    syncStatus: "idle" as const,
    calendarExportToken: randomBytes(24).toString("hex"),
  }));

  await Room.insertMany(docs);
}
