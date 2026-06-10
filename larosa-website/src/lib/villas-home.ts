import { Trees, Waves, type LucideIcon } from "lucide-react";

export type VillaIconKey = "trees" | "waves";

const VILLA_ICONS: Record<VillaIconKey, LucideIcon> = {
  trees: Trees,
  waves: Waves,
};

export type HomeVilla = {
  name: string;
  desc: string;
  tagline: string;
  img: string;
  secondaryImg?: string;
  highlights: readonly string[];
  iconKey: VillaIconKey;
};

export const HOME_VILLAS: readonly HomeVilla[] = [
  {
    name: "Aqua Retreat",
    tagline: "Lakefront Serenity",
    desc: "Set across nearly 2 acres of serene landscape, this exclusive 3-bedroom luxury villa offers a private swimming pool, expansive landscaped gardens, and breathtaking lake views creating the perfect blend of elegance, space, and tranquility.",
    img: "/poolview1.jpeg",
    secondaryImg: "/room2.jpeg",
    highlights: [
      "Private swimming pool",
      "Expansive landscaped gardens",
      "Lake views",
      "Secluded estate setting",
    ],
    iconKey: "trees",
  },
  {
    name: "Villanova",
    tagline: "Mediterranean Elegance",
    desc: "Experience refined luxury in this stunning 5-bedroom featuring elegant architecture, a private swimming pool, and lush greenery thoughtfully woven throughout the property. Designed for comfort and sophistication, the villa offers a serene retreat surrounded by nature and timeless Mediterranean charm.",
    img: "/poolview2.jpeg",
    secondaryImg: "/room3.jpeg",
    highlights: [
      "Private swimming pool",
      "Lush greenery",
      "Elegant architecture",
      "Mediterranean charm",
    ],
    iconKey: "waves",
  },
] as const;

export function getVillaIcon(key: VillaIconKey): LucideIcon {
  return VILLA_ICONS[key];
}
