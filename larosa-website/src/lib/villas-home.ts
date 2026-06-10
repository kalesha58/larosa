import { Trees, Waves, type LucideIcon } from "lucide-react";

export type VillaIconKey = "trees" | "waves";

const VILLA_ICONS: Record<VillaIconKey, LucideIcon> = {
  trees: Trees,
  waves: Waves,
};

export type HomeVilla = {
  roomId: string;
  name: string;
  desc: string;
  tagline: string;
  img: string;
  secondaryImg?: string;
  highlights: readonly string[];
  iconKey: VillaIconKey;
};

export function getVillaIcon(key: VillaIconKey): LucideIcon {
  return VILLA_ICONS[key];
}
