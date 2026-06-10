import { Room } from "@/models/Room";
import { connectMongo } from "./mongodb";

export async function getBookingTotal(
  roomId: string,
  checkInIso: string,
  checkOutIso: string
): Promise<{
  room: any;
  subtotal: number;
  taxes: number;
  total: number;
  nights: number;
} | null> {
  await connectMongo();
  let room = null;
  const num = Number(roomId);
  if (!isNaN(num) && String(num) === roomId) {
    room = await Room.findOne({ roomId: num }).lean();
  } else {
    try {
      room = await Room.findById(roomId).lean();
    } catch (e) {
      room = null;
    }
  }
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
  return { room, subtotal, taxes: 0, total: subtotal, nights };
}
