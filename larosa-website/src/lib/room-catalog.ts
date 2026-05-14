/** Shared room definitions for client hooks and server-side payment validation. */

export interface Room {
  id: number;
  title: string;
  type: string;
  price: number;
  images: string[];
  description: string;
  amenities: string[];
  capacity: number;
  sizeSqFt: number;
  totalRooms: number;
  featured?: boolean;
  /** One Airbnb listing calendar ↔ this `id` (see server sync). */
  airbnbIcalUrl?: string;
  syncEnabled?: boolean;
  syncStatus?: string;
  lastSyncedAt?: string | null;
  /** Relative path; prepend site origin for Airbnb import. */
  calendarExportUrl?: string;
}

export const INITIAL_ROOMS: Room[] = [
  {
    id: 2,
    title: "Presidential Suite",
    type: "Presidential",
    price: 15000,
    images: ["/Hero3.jpeg"],
    description:
      "The pinnacle of Larosa hospitality with panoramic views and a private terrace.",
    amenities: ["Wifi", "Minibar", "Air Conditioning", "Room Service"],
    capacity: 4,
    sizeSqFt: 1400,
    totalRooms: 3,
    featured: true,
  },
  {
    id: 3,
    title: "Deluxe Heritage",
    type: "Deluxe",
    price: 8500,
    images: ["/poolview2.jpeg", "/Bathroom.jpeg"],
    description:
      "Intimate and refined for the modern traveler with Italian marble bathroom.",
    amenities: ["Wifi", "Air Conditioning", "Room Service"],
    capacity: 2,
    sizeSqFt: 520,
    totalRooms: 14,
    featured: true,
  },
  {
    id: 4,
    title: "Garden Courtyard",
    type: "Standard",
    price: 5000,
    images: ["/poolview3.jpeg"],
    description:
      "Quiet courtyard views and refined simplicity for short urban stays.",
    amenities: ["Wifi", "Air Conditioning"],
    capacity: 2,
    sizeSqFt: 380,
    totalRooms: 20,
  },
  {
    id: 5,
    title: "Ocean Penthouse",
    type: "Deluxe",
    price: 12500,
    images: ["/poolview4.jpeg"],
    description:
      "Elevated living with wraparound glass and a deep soaking tub.",
    amenities: ["Wifi", "Minibar", "Air Conditioning", "Room Service"],
    capacity: 3,
    sizeSqFt: 980,
    totalRooms: 4,
  },
];

export function cloneInitialRooms(): Room[] {
  return INITIAL_ROOMS.map((r) => ({
    ...r,
    images: [...r.images],
    amenities: [...r.amenities],
  }));
}
