import { connectMongo } from "@/lib/mongodb";
import {
  getNightlyRates,
  sumNightlyRates,
  type NightlyRate,
} from "@/lib/room-day-pricing";
import { formatPropertyDate, normalizeStayFromInstant } from "@/lib/property-dates";
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
  nightlyRates: NightlyRate[];
  pricePerNight: number;
} | null> {
  const room = await getRoomForPricing(roomId);
  if (!room) return null;

  const rawCheckIn = new Date(checkInIso);
  const rawCheckOut = new Date(checkOutIso);
  if (isNaN(rawCheckIn.getTime()) || isNaN(rawCheckOut.getTime())) {
    return null;
  }

  const { checkIn, checkOut } = normalizeStayFromInstant(
    rawCheckIn,
    rawCheckOut
  );
  if (checkIn >= checkOut) return null;

  const checkInYmd = formatPropertyDate(checkIn);
  const checkOutYmd = formatPropertyDate(checkOut);
  const nightlyRates = await getNightlyRates(roomId, checkInYmd, checkOutYmd);
  const nights = nightlyRates.length;
  if (nights < 1) return null;

  const subtotal = sumNightlyRates(nightlyRates);
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;
  const pricePerNight = Math.round(subtotal / nights);

  return {
    room,
    subtotal,
    taxes,
    total,
    nights,
    nightlyRates,
    pricePerNight,
  };
}
