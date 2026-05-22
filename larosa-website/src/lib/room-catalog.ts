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

/**
 * Default bookable units seeded into MongoDB.
 * One `id` = one Airbnb listing (private .ics URL on the room record).
 */
export const INITIAL_ROOMS: Room[] = [
  {
    id: 1,
    title: "Garden Retreat Villa",
    type: "Villa",
    price: 12000,
    images: ["/poolview1.jpeg", "/room2.jpeg"],
    description:
      "Secluded one-bedroom villa with private plunge pool surrounded by lush tropical gardens. Perfect for couples seeking intimate tranquility away from the world.",
    amenities: [
      "Wifi",
      "Private plunge pool",
      "Air Conditioning",
      "Dedicated villa host",
      "Room Service",
    ],
    capacity: 2,
    sizeSqFt: 1200,
    totalRooms: 1,
    featured: true,
  },
  {
    id: 2,
    title: "Ocean View Villa",
    type: "Villa",
    price: 18000,
    images: ["/poolview2.jpeg", "/Balcony.jpeg"],
    description:
      "Elevated two-bedroom villa with breathtaking panoramic ocean views and a private terrace. Designed for those who live for the sea and infinite horizons.",
    amenities: [
      "Wifi",
      "Panoramic ocean terrace",
      "Air Conditioning",
      "Indoor-outdoor lounge",
      "Room Service",
    ],
    capacity: 4,
    sizeSqFt: 2000,
    totalRooms: 1,
    featured: true,
  },
];

export function cloneInitialRooms(): Room[] {
  return INITIAL_ROOMS.map((r) => ({
    ...r,
    images: [...r.images],
    amenities: [...r.amenities],
  }));
}
