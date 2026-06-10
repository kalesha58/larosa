import { Room, type IRoom } from "@/models/Room";

/** Client-safe room shape (matches public Room type + sync metadata). */
export function serializeRoom(doc: IRoom) {
  return {
    id: doc.roomId,
    title: doc.title,
    description: doc.description,
    type: doc.type,
    price: doc.price,
    images: doc.images ?? [],
    amenities: doc.amenities ?? [],
    capacity: doc.capacity,
    sizeSqFt: doc.sizeSqFt ?? 600,
    totalRooms: doc.totalRooms,
    featured: doc.featured ?? false,
    airbnbIcalUrl: doc.airbnbIcalUrl ?? "",
    syncEnabled: doc.syncEnabled ?? true,
    syncStatus: doc.syncStatus ?? "idle",
    lastSyncedAt: doc.lastSyncedAt
      ? doc.lastSyncedAt.toISOString()
      : null,
    calendarExportUrl: `/api/rooms/${doc.roomId}/calendar.ics?token=${encodeURIComponent(doc.calendarExportToken)}`,
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
