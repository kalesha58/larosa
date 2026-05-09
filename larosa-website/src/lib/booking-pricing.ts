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
  const room = await Room.findById(roomId).lean();
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
  const taxes = Math.floor(subtotal * 0.12); // Using 12% GST consistently
  return { room, subtotal, taxes, total: subtotal + taxes, nights };
}
