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
const AMENITY_ACCENT_STYLES = [
  "from-emerald-400/80 to-teal-500/60",
  "from-amber-400/85 to-orange-500/65",
  "from-violet-400/80 to-fuchsia-500/60",
  "from-sky-400/80 to-cyan-500/60",
  "from-rose-400/80 to-pink-500/60",
  "from-lime-400/80 to-emerald-500/60",
  "from-blue-400/80 to-indigo-500/60",
  "from-yellow-400/80 to-amber-500/60",
] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.21, 0.45, 0.32, 0.9] as const },
  },
};

export function VillaAmenitiesSection() {
  return (
    <section
      className="relative overflow-hidden border-t border-border/60 bg-muted/20 py-16 sm:py-20 md:py-24 lg:py-32"
      aria-labelledby="villa-amenities-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_90%_65%_at_50%_0%,hsl(var(--primary)/0.12),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-1/2 -z-10 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />

      <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, ease: [0.21, 0.45, 0.32, 0.9] }}
            className="space-y-6"
          >
            <p className="inline-flex border border-primary/25 bg-primary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
              Your Comfort
            </p>
            <h2
              id="villa-amenities-heading"
              className="max-w-3xl font-serif text-4xl leading-tight text-foreground sm:text-5xl md:text-6xl"
            >
              Villa Amenities
              <span className="mt-2 block text-2xl font-normal italic text-primary/90 sm:text-3xl md:text-4xl">
                Designed for Elevated Living
              </span>
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              Every detail is composed to create a quieter, richer, and more
              personal stay experience - from wellness rituals and in-villa dining
              to private conveniences that anticipate your rhythm.
            </p>
            <div className="flex flex-wrap gap-2">
              {AMENITY_PILLARS.map((pillar) => (
                <span
                  key={pillar}
                  className="border border-border/70 bg-card/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
                >
                  {pillar}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, ease: [0.21, 0.45, 0.32, 0.9], delay: 0.04 }}
            className="relative overflow-hidden border border-border/70 bg-card/70 p-6 backdrop-blur-sm"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-transparent"
              aria-hidden
            />
            <div className="relative grid grid-cols-3 gap-3">
              {QUICK_METRICS.map((metric) => (
                <div
                  key={metric.label}
                  className="border border-border/60 bg-background/70 p-3 text-center"
                >
                  <p className="font-serif text-2xl text-primary">{metric.value}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
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
          className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 xl:gap-5"
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
                  "group relative overflow-hidden border border-border/70 bg-card/80 p-6 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.4)] backdrop-blur-sm",
                  "transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_22px_46px_-24px_rgba(0,0,0,0.5)]"
                )}
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-70"
                  aria-hidden
                />
                <div
                  className={cn(
                    "pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b",
                    accentStyle
                  )}
                  aria-hidden
                />
                <div className="relative flex items-start gap-4 pl-2">
                  <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center border border-primary/35 bg-primary/10 text-primary shadow-sm">
                    <Icon className="h-[18px] w-[18px]" aria-hidden />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl text-foreground md:text-2xl">
                      {amenity.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
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
