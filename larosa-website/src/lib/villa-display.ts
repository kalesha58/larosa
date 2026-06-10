import type { Room } from "@/lib/room-catalog";
import type { HomeVilla, VillaIconKey } from "@/lib/villas-home";

const GENERIC_AMENITIES = new Set([
  "Wifi",
  "Air Conditioning",
  "Room Service",
]);

const ICON_KEYS: VillaIconKey[] = ["trees", "waves"];

function deriveTagline(title: string, index: number): string {
  if (index === 0) return "Lakefront Serenity";
  if (index === 1) return "Mediterranean Elegance";
  return title;
}

export function roomToDisplayVilla(room: Room, index: number): HomeVilla {
  const highlights = room.amenities.filter((a) => !GENERIC_AMENITIES.has(a));

  return {
    roomId: room.id,
    name: room.title,
    tagline: deriveTagline(room.title, index),
    desc: room.description,
    img: room.images[0] ?? "/room-deluxe.png",
    secondaryImg: room.images[1],
    highlights: highlights.length > 0 ? highlights : room.amenities.slice(0, 4),
    iconKey: ICON_KEYS[index % ICON_KEYS.length],
  };
}

export function roomsToDisplayVillas(rooms: Room[]): HomeVilla[] {
  return rooms.map((room, index) => roomToDisplayVilla(room, index));
}

export function buildHeroSlides(rooms: Room[]) {
  return rooms
    .filter((r) => r.images.length > 0)
    .map((r) => ({
      src: r.images[0],
      label: r.title,
      caption: r.description.length > 120
        ? `${r.description.slice(0, 117)}…`
        : r.description,
    }));
}
