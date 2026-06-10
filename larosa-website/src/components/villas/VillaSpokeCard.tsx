"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { VillaIcon } from "@/components/villas/VillaIcon";
import type { HomeVilla } from "@/lib/villas-home";

const EASE = [0.16, 1, 0.3, 1] as const;

type VillaSpokeCardProps = {
  villa: HomeVilla;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  animate?: boolean;
  className?: string;
};

export function VillaSpokeCard({
  villa,
  index,
  isActive,
  onSelect,
  animate = true,
  className,
}: VillaSpokeCardProps) {
  const previewHighlights = villa.highlights.slice(0, 2);

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-label={`View details for ${villa.name}`}
      aria-pressed={isActive}
      initial={animate ? { opacity: 0, y: 24 } : false}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.85,
        delay: 0.35 + index * 0.12,
        ease: EASE,
      }}
      className={cn(
        "group w-full max-w-[380px] text-left transition-shadow duration-300",
        "rounded-3xl border border-border/60 bg-card/85 p-5 shadow-md backdrop-blur-sm sm:max-w-[400px]",
        "hover:border-primary/30 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isActive && "border-primary/40 ring-2 ring-primary/25 shadow-lg",
        className
      )}
    >
      <div className="relative mb-5 aspect-[4/3] min-h-[200px] overflow-hidden rounded-2xl border border-border/40 sm:min-h-[220px]">
        <Image
          src={villa.img}
          alt=""
          fill
          className="object-cover grayscale-[0.35] contrast-[1.08] transition-transform duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
          sizes="(max-width: 1024px) 100vw, 400px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full border border-primary/30 bg-background/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-primary shadow-sm">
          Villa {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="space-y-4 px-0.5">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/5 text-primary">
            <VillaIcon iconKey={villa.iconKey} className="h-[18px] w-[18px]" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-2xl leading-tight text-foreground">
              {villa.name}
            </h3>
          </div>
        </div>

        <ul className="space-y-2 border-t border-border/50 pt-3.5">
          {previewHighlights.map((point) => (
            <li
              key={point}
              className="flex items-center gap-2 text-sm font-light text-muted-foreground"
            >
              <span className="h-1 w-1 shrink-0 rounded-full bg-primary/50" />
              {point}
            </li>
          ))}
        </ul>

        <span className="inline-flex items-center gap-1.5 pt-1 font-serif text-xs tracking-[0.15em] text-primary transition-transform group-hover:translate-x-0.5">
          Explore residence
          <ArrowRight className="h-4 w-4" aria-hidden />
        </span>
      </div>
    </motion.button>
  );
}
