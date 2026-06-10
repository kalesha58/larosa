import {
  BedDouble,
  CarFront,
  Headphones,
  Home,
  Sparkles,
  Trees,
  Waves,
  type LucideIcon,
} from "lucide-react";

export type CollectionCriterionIconKey =
  | "home"
  | "pool"
  | "bedrooms"
  | "greenery"
  | "concierge"
  | "parking"
  | "upkeep";

const COLLECTION_ICONS: Record<CollectionCriterionIconKey, LucideIcon> = {
  home: Home,
  pool: Waves,
  bedrooms: BedDouble,
  greenery: Trees,
  concierge: Headphones,
  parking: CarFront,
  upkeep: Sparkles,
};

export type CollectionCriterion = {
  label: string;
  iconKey: CollectionCriterionIconKey;
};

export const LAROSA_COLLECTION_INTRO =
  "To become part of the LaRosa Collection, every property must embody the level of comfort, aesthetics, and hospitality we promise our guests. We look for:";

export const LAROSA_COLLECTION_CLOSING =
  "At LaRosa, we curate stays that offer more than accommodation—they deliver a refined and memorable experience.";

export const LAROSA_COLLECTION_CTA_PROMPT =
  "Own a property that matches the LaRosa experience?";

export const LAROSA_COLLECTION_CRITERIA: readonly CollectionCriterion[] = [
  {
    label: "Spacious farmhouse-style properties",
    iconKey: "home",
  },
  {
    label: "A well-maintained private swimming pool",
    iconKey: "pool",
  },
  {
    label: "Elegantly maintained rooms with a minimum of 3 bedrooms",
    iconKey: "bedrooms",
  },
  {
    label: "Lush greenery, landscaped gardens, and a natural ambience",
    iconKey: "greenery",
  },
  {
    label: "Dedicated 24/7 concierge or on-site assistance",
    iconKey: "concierge",
  },
  {
    label: "Secure private parking for guests",
    iconKey: "parking",
  },
  {
    label:
      "Premium upkeep, cleanliness, and guest-ready presentation at all times",
    iconKey: "upkeep",
  },
] as const;

export function getCollectionCriterionIcon(
  key: CollectionCriterionIconKey
): LucideIcon {
  return COLLECTION_ICONS[key];
}

export const CONTACT_SUBJECT_PROPERTY = "property" as const;
