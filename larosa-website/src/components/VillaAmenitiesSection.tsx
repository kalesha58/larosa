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

const AMENITIES: IVillaAmenity[] = [
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

export function VillaAmenitiesSection() {
  return (
    <section
      id="amenities"
      className="relative overflow-hidden py-16 sm:py-24 bg-[hsl(var(--section-warm))]/40"
      aria-labelledby="amenities-heading"
    >
      {/* Background depth layers */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/3 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--section-warm))_100%)] opacity-30" />
      </div>

      <div className="container relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-6"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/80">
              Personalized Luxury
            </span>
            <h2
              id="amenities-heading"
              className="font-serif text-4xl sm:text-5xl lg:text-7xl leading-[1.1] text-foreground"
            >
              Beyond the <br />
              <span className="italic text-primary/90">Expected</span>
            </h2>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              Every Larosa villa is a private world designed for absolute comfort, 
              where world-class amenities meet the warmth of a personal sanctuary.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex gap-12 border-l border-primary/10 pl-8 hidden sm:flex"
          >
            {[
              { label: "Guest Rating", val: "4.9/5" },
              { label: "Private Pool", val: "100%" },
            ].map((m) => (
              <div key={m.label} className="space-y-1">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{m.label}</p>
                <p className="font-serif text-3xl text-foreground">{m.val}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {AMENITIES.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={cn(
                "group relative p-8 rounded-[2.5rem] transition-all duration-500 overflow-hidden",
                "bg-card/40 border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl",
                "hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:bg-card/60",
                idx === 2 || idx === 3 ? "md:col-span-2 lg:col-span-1" : ""
              )}
            >
              {/* Subtle Icon Decor */}
              <div className="absolute top-8 right-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                <item.icon size={120} strokeWidth={1} />
              </div>

              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                  <item.icon size={22} strokeWidth={1.5} />
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-serif text-2xl sm:text-3xl text-foreground leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-[240px] group-hover:text-foreground/80 transition-colors">
                    {item.description}
                  </p>
                </div>
                
                <div className="pt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
                   <div className="w-6 h-px bg-primary/30" />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Discover More</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
