import { INITIAL_ROOMS, type Room } from "@/lib/room-catalog";

export function getBookingTotalUsd(
  roomId: number,
  checkInIso: string,
  checkOutIso: string
): {
  room: Room;
  subtotal: number;
  taxes: number;
  total: number;
  nights: number;
} | null {
  const room = INITIAL_ROOMS.find((r) => r.id === roomId);
  if (!room) return null;
  const checkIn = new Date(checkInIso);
  const checkOut = new Date(checkOutIso);
  const nights = Math.max(
    1,
    Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    )
  );
  const subtotal = room.price * nights;
  const taxes = Math.floor(subtotal * 0.15);
  return { room, subtotal, taxes, total: subtotal + taxes, nights };
}
