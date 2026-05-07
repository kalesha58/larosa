"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Trees } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const VILLAS = [
  {
    name: "Garden Retreat Villa",
    desc: "Secluded one-bedroom villa with private plunge pool surrounded by lush tropical gardens.",
    size: "120 m²",
    guests: "2 Guests",
    img: "/poolview1.jpeg",
    highlights: [
      "Private plunge pool",
      "Garden-facing master suite",
      "Dedicated villa host",
      "Sunset dining deck",
    ],
  },
  {
    name: "Ocean View Villa",
    desc: "Elevated two-bedroom villa with breathtaking panoramic ocean views and a private terrace.",
    size: "200 m²",
    guests: "4 Guests",
    img: "/Balcony.jpeg",
    highlights: [
      "Panoramic ocean terrace",
      "Indoor-outdoor lounge",
      "Curated in-villa minibar",
      "Priority concierge service",
    ],
  },
  {
    name: "Royal Estate Villa",
    desc: "The pinnacle of seclusion — a full three-bedroom estate with a private pool, chef, and butler.",
    size: "450 m²",
    guests: "6 Guests",
    img: "/poolview2.jpeg",
    highlights: [
      "Three-suite private estate",
      "Butler and private chef",
      "Infinity-edge pool",
      "24/7 discreet security",
    ],
  },
] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.99 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.9, 
      ease: [0.16, 1, 0.3, 1] as const 
    },
  },
};

export function VillasSection() {
  const [activeVillaIdx, setActiveVillaIdx] = useState(0);
  const activeVilla = VILLAS[activeVillaIdx];

  return (
    <section
      id="villas"
      className="relative overflow-hidden py-16 sm:py-24 bg-[hsl(var(--section-alt))]/80"
      aria-labelledby="villas-heading"
    >
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[35%] h-[35%] bg-primary/4 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,transparent_0%,hsl(var(--section-alt))_100%)] opacity-60" />
      </div>

      <div className="container relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
              Private Residences
            </span>
            <h2
              id="villas-heading"
              className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-foreground"
            >
              The Villa <br />
              <span className="italic text-primary/90">Collection</span>
            </h2>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              For those who seek the ultimate in seclusion and personalized luxury, 
              our private villas offer an entirely separate world of tranquil grandeur.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Villa Selector - Modern Minimalist */}
          <div className="lg:col-span-4 space-y-4">
            {VILLAS.map((villa, i) => {
              const selected = i === activeVillaIdx;
              return (
                <button
                  key={villa.name}
                  onClick={() => setActiveVillaIdx(i)}
                  className={cn(
                    "w-full text-left p-6 rounded-[2rem] transition-all duration-500 relative overflow-hidden group",
                    selected 
                      ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/20 scale-[1.02]" 
                      : "bg-card/40 border border-border/50 text-foreground hover:bg-card/80"
                  )}
                >
                  <div className="relative z-10">
                    <span className={cn(
                      "text-[9px] font-bold uppercase tracking-widest mb-2 block",
                      selected ? "text-primary-foreground/70" : "text-primary"
                    )}>
                      Villa {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl leading-tight">
                      {villa.name}
                    </h3>
                  </div>
                  
                  {/* Hover/Selection Decor */}
                  {!selected && (
                    <div className="absolute top-1/2 right-6 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                      <ArrowRight size={20} className="text-primary/50" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <motion.article
            key={activeVilla.name}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8 h-full"
          >
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-0 rounded-[3rem] overflow-hidden bg-card/40 border border-border/50 shadow-2xl h-full backdrop-blur-xl">
              
              {/* Image Column */}
              <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto min-h-[400px]">
                <Image
                  src={activeVilla.img}
                  alt={activeVilla.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:bg-gradient-to-r" />
              </div>

              {/* Details Column */}
              <div className="lg:col-span-4 p-8 sm:p-12 flex flex-col justify-center space-y-8">
                <div className="space-y-4">
                  <h3 className="font-serif text-3xl sm:text-4xl text-foreground">
                    {activeVilla.name}
                  </h3>
                  <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-primary">
                    <span>{activeVilla.size}</span>
                    <span className="w-1 h-1 rounded-full bg-primary/30 mt-1.5" />
                    <span>{activeVilla.guests}</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    {activeVilla.desc}
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                    Villa Highlights
                  </p>
                  <ul className="space-y-3">
                    {activeVilla.highlights.map((point) => (
                      <li key={point} className="flex items-center gap-3 text-sm text-foreground font-light">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  asChild
                  className="h-14 rounded-full px-8 font-serif text-xs tracking-[0.2em] w-full sm:w-auto"
                >
                  <Link href="/rooms">
                    Discover Villa
                  </Link>
                </Button>
              </div>

            </div>
          </motion.article>

        </div>
      </div>
    </section>
  );
}
