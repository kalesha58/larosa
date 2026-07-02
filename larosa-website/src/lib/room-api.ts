import { Room, type IRoom } from "@/models/Room";
import { absoluteUrl } from "@/lib/site-url";

/** Stable catalog id (1, 2, …) for booking documents — never Mongo `_id`. */
export function catalogRoomIdFromDoc(room: Pick<IRoom, "roomId">): string {
  return String(room.roomId);
}

/**
 * All `roomId` values that may appear on booking rows for a catalog villa.
 * Legacy bookings were saved with Mongo `_id` instead of catalog `roomId`.
 */
export async function resolveBookingRoomIds(roomId: string): Promise<string[]> {
  const ids = new Set<string>([roomId]);
  const num = Number(roomId);
  if (!isNaN(num) && String(num) === roomId) {
    const room = await Room.findOne({ roomId: num }).select("_id").lean();
    if (room?._id) ids.add(room._id.toString());
    return [...ids];
  }
  if (/^[a-f0-9]{24}$/i.test(roomId)) {
    try {
      const room = await Room.findById(roomId).select("roomId").lean();
      if (room?.roomId != null) ids.add(String(room.roomId));
    } catch {
      // ignore invalid ObjectId
    }
  }
  return [...ids];
}

/** Client-safe room shape (matches public Room type + sync metadata). */
export function serializeRoom(doc: IRoom) {
  return {
    id: doc.roomId,
    title: doc.title,
    description: doc.description,
    type: doc.type,
    category: doc.category ?? "room",
    price: doc.price,
    images: doc.images ?? [],
    amenities: doc.amenities ?? [],
    capacity: doc.capacity,
    sizeSqFt: doc.sizeSqFt ?? 600,
    totalRooms: doc.totalRooms,
    featured: doc.featured ?? false,
    status: doc.status ?? "active",
    airbnbIcalUrl: doc.airbnbIcalUrl ?? "",
    syncEnabled: doc.syncEnabled ?? true,
    syncStatus: doc.syncStatus ?? "idle",
    lastSyncedAt: doc.lastSyncedAt
      ? doc.lastSyncedAt.toISOString()
      : null,
    calendarExportUrl: absoluteUrl(
      `/api/rooms/${doc.roomId}/calendar.ics?token=${encodeURIComponent(doc.calendarExportToken)}`
    ),
  };
}

/**
 * Finds a room by either its stable numeric `roomId` or MongoDB `_id` string.
 */
export async function findRoomById(id: string) {
  const num = Number(id);
  if (!isNaN(num) && String(num) === id) {
    return await Room.findOne({ roomId: num });
  }
  try {
    return await Room.findById(id);
  } catch {
    return null;
  }
}
