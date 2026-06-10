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
  airbnbIcalUrl?: string;
  lastSyncedAt?: string | null;
  calendarExportUrl?: string;
}

export const INITIAL_ROOMS: Room[] = [
  {
    id: "1",
    title: "Aqua Retreat",
    category: "villa",
    type: "Villa",
    price: 25000,
    images: ["/poolview1.jpeg", "/room2.jpeg"],
    description:
      "Set across nearly 2 acres of serene landscape, this exclusive 3-bedroom luxury villa offers a private swimming pool, expansive landscaped gardens, and breathtaking lake views creating the perfect blend of elegance, space, and tranquility.",
    amenities: [
      "Wifi",
      "Air Conditioning",
      "Room Service",
      "Private swimming pool",
      "Expansive landscaped gardens",
      "Lake views",
      "Secluded estate setting",
    ],
    capacity: 6,
    sizeSqFt: 3500,
    totalRooms: 1,
    featured: true,
    status: "active",
  },
  {
    id: "2",
    title: "Villanova",
    category: "villa",
    type: "Villa",
    price: 35000,
    images: ["/poolview2.jpeg", "/room3.jpeg"],
    description:
      "Experience refined luxury in this stunning 5-bedroom featuring elegant architecture, a private swimming pool, and lush greenery thoughtfully woven throughout the property. Designed for comfort and sophistication, the villa offers a serene retreat surrounded by nature and timeless Mediterranean charm.",
    amenities: [
      "Wifi",
      "Air Conditioning",
      "Room Service",
      "Private swimming pool",
      "Lush greenery",
      "Elegant architecture",
      "Mediterranean charm",
    ],
    capacity: 10,
    sizeSqFt: 5000,
    totalRooms: 1,
    featured: true,
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
