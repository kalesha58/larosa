import { connectMongo } from "@/lib/mongodb";
import { Room } from "@/models/Room";

export interface RoomPricingShape {
  id: number;
  title: string;
  type: string;
  price: number;
}

export async function getRoomForPricing(
  roomId: number
): Promise<RoomPricingShape | null> {
  await connectMongo();
  const room = await Room.findOne({ roomId }).lean();
  if (!room) return null;
  return {
    id: room.roomId,
    title: room.title,
    type: room.type,
    price: room.price,
  };
}

export async function getBookingTotal(
  roomId: number,
  checkInIso: string,
  checkOutIso: string
): Promise<{
  room: RoomPricingShape;
  subtotal: number;
  taxes: number;
  total: number;
  nights: number;
} | null> {
  const room = await getRoomForPricing(roomId);
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
  const taxes = Math.round(subtotal * 0.12);
  return { room, subtotal, taxes, total: subtotal + taxes, nights };
}
