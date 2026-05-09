/** Shared room definitions for client hooks and server-side payment validation. */

export interface Room {
  id: string;
  title: string;
  category: "room" | "villa";
  type: string;
  price: number;
  images: string[];
  description: string;
  amenities: string[];
  capacity: number;
  sizeSqFt: number;
  totalRooms: number;
  featured?: boolean;
  status?: "active" | "hidden";
  airbnbCalendarUrl?: string;
}

export const INITIAL_ROOMS: Room[] = [
  {
    id: "2",
    title: "Presidential Suite",
    category: "room",
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
    status: "active",
  },
  {
    id: "3",
    title: "Deluxe Heritage",
    category: "room",
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
    status: "active",
  },
  {
    id: "4",
    title: "Garden Courtyard",
    category: "room",
    type: "Standard",
    price: 5000,
    images: ["/poolview3.jpeg"],
    description:
      "Quiet courtyard views and refined simplicity for short urban stays.",
    amenities: ["Wifi", "Air Conditioning"],
    capacity: 2,
    sizeSqFt: 380,
    totalRooms: 20,
    status: "active",
  },
  {
    id: "5",
    title: "Ocean Penthouse",
    category: "room",
    type: "Deluxe",
    price: 12500,
    images: ["/poolview4.jpeg"],
    description:
      "Elevated living with wraparound glass and a deep soaking tub.",
    amenities: ["Wifi", "Minibar", "Air Conditioning", "Room Service"],
    capacity: 3,
    sizeSqFt: 980,
    totalRooms: 4,
    status: "active",
  },
];

export function cloneInitialRooms(): Room[] {
  return INITIAL_ROOMS.map((r) => ({
    ...r,
    images: [...r.images],
    amenities: [...r.amenities],
  }));
}
