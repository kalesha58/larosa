"use client";

import { motion } from "framer-motion";
import {
  CarFront,
  Clapperboard,
  Dumbbell,
  Leaf,
  TreePine,
  Waves,
  Wifi,
  Wind,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IVillaAmenity } from "./VillaAmenitiesSection.interfaces";

const VILLA_AMENITIES: IVillaAmenity[] = [
  {
    title: "High-Speed WiFi",
    description: "Ultra-fast internet coverage throughout villas and outdoor lounges.",
    icon: Wifi,
  },
  {
    title: "Private Parking",
    description: "Secure gated parking access with dedicated bays for each residence.",
    icon: CarFront,
  },
  {
    title: "Home Cinema",
    description: "Immersive in-villa entertainment setup with premium surround audio.",
    icon: Clapperboard,
  },
  {
    title: "Fitness Area",
    description: "Private training spaces with curated modern equipment and recovery tools.",
    icon: Dumbbell,
  },
  {
    title: "Spa & Wellness",
    description: "Serene treatment-ready spaces designed for restoration and stillness.",
    icon: Waves,
  },
  {
    title: "Garden Dining",
    description: "Open-air dining terraces for intimate breakfasts and sunset dinners.",
    icon: TreePine,
  },
  {
    title: "Climate Control",
    description: "Independent room-by-room temperature settings for personalized comfort.",
    icon: Wind,
  },
  {
    title: "Nature Courtyards",
    description: "Landscaped private courtyards to relax, read, and reconnect.",
    icon: Leaf,
  },
];
const AMENITY_PILLARS = ["Privacy", "Wellness", "Comfort", "Seamless Service"] as const;
const QUICK_METRICS = [
  { label: "Private Villas", value: "5" },
  { label: "Curated Amenities", value: "20+" },
  { label: "Concierge Access", value: "24/7" },
] as const;
/** Muted jewel tones — reads luxe on light cards without candy-bright edges */
const AMENITY_ACCENT_STYLES = [
  "from-teal-800/95 via-teal-700/85 to-emerald-800/75 dark:from-teal-500/90 dark:via-teal-400/75 dark:to-emerald-500/65",
  "from-amber-800/95 via-amber-700/85 to-orange-900/75 dark:from-amber-500/85 dark:via-amber-400/70 dark:to-orange-600/60",
  "from-violet-900/90 via-violet-800/80 to-fuchsia-900/70 dark:from-violet-500/80 dark:via-fuchsia-500/70 dark:to-purple-600/55",
  "from-sky-900/90 via-sky-800/80 to-cyan-900/72 dark:from-sky-500/80 dark:via-cyan-500/68 dark:to-teal-600/55",
  "from-rose-900/88 via-rose-800/78 to-pink-900/68 dark:from-rose-500/78 dark:via-pink-500/65 dark:to-rose-700/52",
  "from-emerald-900/90 via-emerald-800/78 to-lime-900/65 dark:from-emerald-500/75 dark:via-lime-500/62 dark:to-emerald-700/50",
  "from-indigo-900/92 via-blue-900/82 to-indigo-950/72 dark:from-indigo-500/78 dark:via-blue-500/68 dark:to-indigo-600/55",
  "from-yellow-900/88 via-amber-800/78 to-yellow-950/68 dark:from-yellow-500/72 dark:via-amber-500/62 dark:to-yellow-700/50",
] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 25, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.7, 
      ease: [0.16, 1, 0.3, 1] as const 
    },
  },
};

export function VillaAmenitiesSection() {
  return (
    <section
      className="relative overflow-hidden border-t border-border/50 bg-gradient-to-b from-stone-50/90 via-background to-muted/25 py-12 sm:py-14 md:py-20 lg:py-24 dark:from-background dark:via-background dark:to-muted/15"
      aria-labelledby="villa-amenities-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_85%_55%_at_50%_-5%,hsl(var(--primary)/0.08),transparent_50%),radial-gradient(ellipse_60%_40%_at_100%_30%,hsl(35_30%_94%/0.55),transparent_45%)] dark:bg-[radial-gradient(ellipse_85%_55%_at_50%_-5%,hsl(var(--primary)/0.14),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-1/2 -z-10 h-[28rem] w-[32rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,hsl(35_25%_88%/0.35)_0%,transparent_70%)] blur-3xl dark:bg-primary/12"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
        aria-hidden
      />

      <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            <p className="inline-flex items-center gap-2 border border-primary/20 bg-gradient-to-br from-primary/[0.07] to-transparent px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-primary shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_-12px_rgba(0,0,0,0.12)] dark:shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]">
              <span className="h-px w-6 bg-gradient-to-r from-transparent to-primary/40" aria-hidden />
              Your Comfort
            </p>
            <h2
              id="villa-amenities-heading"
              className="max-w-3xl font-serif text-4xl leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl"
            >
              Villa Amenities
              <span className="mt-3 block max-w-2xl text-[1.35rem] font-normal italic leading-snug text-foreground/85 sm:text-3xl md:text-[2.15rem] md:leading-tight">
                <span className="bg-gradient-to-r from-foreground/95 via-foreground/80 to-foreground/65 bg-clip-text text-transparent dark:from-foreground dark:via-foreground/90 dark:to-foreground/75">
                  Designed for Elevated Living
                </span>
              </span>
            </h2>
            <p className="max-w-2xl text-[15px] leading-[1.75] text-muted-foreground md:text-base">
              Every detail is composed to create a quieter, richer, and more
              personal stay experience - from wellness rituals and in-villa dining
              to private conveniences that anticipate your rhythm.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {AMENITY_PILLARS.map((pillar) => (
                <span
                  key={pillar}
                  className="border border-border/60 bg-card/60 px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground shadow-[0_1px_0_rgba(255,255,255,0.5)_inset] backdrop-blur-[2px] transition-colors duration-300 hover:border-primary/25 hover:bg-primary/[0.06] hover:text-foreground dark:bg-card/40 dark:shadow-none dark:hover:bg-primary/10"
                >
                  {pillar}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative overflow-hidden rounded-sm border border-border/60 bg-gradient-to-br from-card/95 via-card/85 to-muted/30 p-6 shadow-[0_1px_0_rgba(255,255,255,0.65)_inset,0_24px_56px_-28px_rgba(0,0,0,0.18)] backdrop-blur-md dark:from-card/80 dark:via-card/60 dark:to-muted/20 dark:shadow-[0_28px_64px_-32px_rgba(0,0,0,0.55)]"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--primary)/0.06)_0%,transparent_42%,transparent_100%)]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-primary/[0.07] blur-2xl dark:bg-primary/15"
              aria-hidden
            />
            <div className="relative grid grid-cols-3 divide-x divide-border/50">
              {QUICK_METRICS.map((metric) => (
                <div
                  key={metric.label}
                  className="px-2 py-1 text-center first:pl-0 last:pr-0 sm:px-3"
                >
                  <p className="font-serif text-[1.65rem] tabular-nums tracking-tight text-foreground sm:text-3xl">
                    <span className="bg-gradient-to-b from-foreground to-foreground/75 bg-clip-text text-transparent dark:from-foreground dark:to-foreground/80">
                      {metric.value}
                    </span>
                  </p>
                  <p className="mt-2 text-[9px] font-medium uppercase leading-snug tracking-[0.2em] text-muted-foreground">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={container}
          className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4 xl:gap-5"
        >
          {VILLA_AMENITIES.map((amenity, index) => {
            const Icon = amenity.icon;
            const accentStyle =
              AMENITY_ACCENT_STYLES[
                index % AMENITY_ACCENT_STYLES.length
              ];
            return (
              <motion.article
                key={amenity.title}
                variants={item}
                className={cn(
                  "group relative overflow-hidden rounded-xl border border-border/55 bg-card/90 p-6 md:p-7",
                  "shadow-[0_1px_0_rgba(255,255,255,0.72)_inset,0_18px_48px_-26px_rgba(0,0,0,0.16),0_0_0_1px_rgba(0,0,0,0.02)]",
                  "backdrop-blur-[6px] transition-all duration-500 ease-out",
                  "hover:-translate-y-[3px] hover:border-primary/30 hover:shadow-[0_1px_0_rgba(255,255,255,0.85)_inset,0_28px_56px_-24px_rgba(0,0,0,0.22),0_0_0_1px_hsl(var(--primary)/0.08)]",
                  "dark:bg-card/70 dark:shadow-[0_24px_52px_-28px_rgba(0,0,0,0.65)] dark:hover:shadow-[0_32px_64px_-26px_rgba(0,0,0,0.75)]"
                )}
              >
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-primary/[0.08] to-transparent opacity-80 blur-2xl transition-opacity duration-500 group-hover:opacity-100 dark:from-primary/20"
                  aria-hidden
                />
                <div
                  className={cn(
                    "pointer-events-none absolute inset-y-3 left-0 w-1 rounded-full bg-gradient-to-b shadow-[2px_0_12px_-2px_rgba(0,0,0,0.12)] transition-[width,box-shadow] duration-500 ease-out group-hover:w-1.5 group-hover:shadow-[3px_0_18px_-2px_rgba(0,0,0,0.18)]",
                    accentStyle
                  )}
                  aria-hidden
                />
                <div className="relative flex items-start gap-5 pl-3 md:pl-4">
                  <div
                    className={cn(
                      "mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
                      "border border-border/50 bg-gradient-to-br from-muted/90 via-muted/50 to-background/80 text-primary",
                      "shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_6px_16px_-8px_rgba(0,0,0,0.12)]",
                      "transition-transform duration-500 ease-out group-hover:scale-[1.05] group-hover:border-primary/25 group-hover:text-primary dark:from-muted/40 dark:via-muted/25 dark:to-background/30 dark:shadow-inner"
                    )}
                  >
                    <Icon className="h-[19px] w-[19px]" strokeWidth={1.5} aria-hidden />
                  </div>
                  <div className="min-w-0 space-y-2.5 pt-0.5">
                    <h3 className="font-serif text-xl font-medium tracking-tight text-foreground md:text-[1.35rem]">
                      {amenity.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground/95 md:text-[15px] md:leading-relaxed">
                      {amenity.description}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
