"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useGetRooms } from "@/hooks/use-queries";
import { roomsToDisplayVillas } from "@/lib/villa-display";
import { VillaDetailModal } from "@/components/villas/VillaDetailModal";
import { VillaHubDiagram } from "@/components/villas/VillaHubDiagram";
import { Skeleton } from "@/components/ui/skeleton";

const EASE = [0.16, 1, 0.3, 1] as const;

const VIEWPORT = { once: true, margin: "-80px" } as const;

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
      ease: EASE,
    },
  },
};

export function VillasSection() {
  const [openVillaIndex, setOpenVillaIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { data: rooms, isLoading } = useGetRooms();
  const villas = rooms ? roomsToDisplayVillas(rooms) : [];

  const instant = { duration: 0 };

  return (
    <section
      id="villas"
      className="relative isolate overflow-hidden rounded-t-[2.5rem] bg-background pb-16 pt-24 shadow-[0_-32px_64px_-24px_rgba(0,0,0,0.35)] sm:rounded-t-[3.5rem] sm:pb-24 sm:pt-28 sm:shadow-[0_-40px_80px_-28px_rgba(0,0,0,0.4)]"
      aria-labelledby="villas-heading"
    >
      {/* Hero-to-section blend (section overlaps cinematic hero) */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[min(42vh,440px)] rounded-t-[inherit] bg-[linear-gradient(180deg,hsl(0_0%_0%/0.35)_0%,hsl(var(--background)/0.55)_38%,hsl(var(--background))_100%)]"
        aria-hidden
      />

      {/* Warm base + depth */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,hsl(var(--section-warm))_0%,hsl(var(--background))_42%,hsl(var(--background))_100%)]"
        aria-hidden
      />

      {/* Ambient light */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-[10%] top-[18%] h-[45%] w-[50%] rounded-full bg-primary/[0.06] blur-[120px]" />
        <div className="absolute -right-[5%] bottom-[8%] h-[40%] w-[45%] rounded-full bg-primary/[0.05] blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.35] bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,hsl(var(--section-warm)/0.9),transparent_70%)]" />
      </div>

      {/* Subtle linen texture */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] mix-blend-multiply dark:opacity-[0.06] dark:mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      <div className="container relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          className="max-w-3xl mb-12 sm:mb-16"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={shouldReduceMotion ? instant : { duration: 0.9, ease: EASE }}
        >
          <div className="space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
              Private Residences
            </span>
            <motion.h2
              id="villas-heading"
              className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-foreground"
              variants={shouldReduceMotion ? undefined : container}
              initial={shouldReduceMotion ? false : "hidden"}
              whileInView={shouldReduceMotion ? undefined : "show"}
              viewport={VIEWPORT}
            >
              <motion.span className="block" variants={shouldReduceMotion ? undefined : item}>
                The Villa
              </motion.span>
              <motion.span
                className="block italic text-primary/90"
                variants={shouldReduceMotion ? undefined : item}
              >
                Collection
              </motion.span>
            </motion.h2>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              For those who seek the ultimate in seclusion and personalized luxury,
              our private villas offer an entirely separate world of tranquil grandeur.
            </p>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-[420px] rounded-3xl" />
            <Skeleton className="hidden h-[420px] rounded-3xl lg:block" />
          </div>
        ) : villas.length >= 2 ? (
          <VillaHubDiagram
            villas={villas}
            activeIndex={openVillaIndex}
            onSelectVilla={setOpenVillaIndex}
            animate={!shouldReduceMotion}
          />
        ) : villas.length === 1 ? (
          <VillaHubDiagram
            villas={villas}
            activeIndex={openVillaIndex}
            onSelectVilla={setOpenVillaIndex}
            animate={!shouldReduceMotion}
          />
        ) : null}
      </div>

      <VillaDetailModal
        villas={villas}
        openIndex={openVillaIndex}
        onOpenChange={(open) => {
          if (!open) setOpenVillaIndex(null);
        }}
      />
    </section>
  );
}
