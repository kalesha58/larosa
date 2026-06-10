"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type VillaHubCenterProps = {
  className?: string;
  animate?: boolean;
  size?: "default" | "compact";
};

export function VillaHubCenter({
  className,
  animate = true,
  size = "default",
}: VillaHubCenterProps) {
  const compact = size === "compact";

  return (
    <motion.div
      className={cn("relative flex shrink-0 items-center justify-center", className)}
      initial={animate ? { opacity: 0, scale: 0.92 } : false}
      whileInView={animate ? { opacity: 1, scale: 1 } : undefined}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: EASE }}
      aria-hidden
    >
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full border border-primary/20 bg-background/90 shadow-lg backdrop-blur-sm",
          compact ? "h-[120px] w-[120px]" : "h-[148px] w-[148px] sm:h-[168px] sm:w-[168px]"
        )}
      >
        <span
          className={cn(
            "absolute inset-1 rounded-full border border-border/60",
            compact ? "inset-0.5" : "inset-1.5"
          )}
        />
        <div
          className={cn(
            "flex flex-col items-center justify-center rounded-full bg-primary text-center text-primary-foreground",
            compact ? "h-[88px] w-[88px] px-2" : "h-[108px] w-[108px] px-3 sm:h-[120px] sm:w-[120px]"
          )}
        >
          <span
            className={cn(
              "font-bold uppercase tracking-[0.25em] text-primary-foreground/75",
              compact ? "text-[7px]" : "text-[8px] sm:text-[9px]"
            )}
          >
            The Villa
          </span>
          <span
            className={cn(
              "font-serif italic leading-tight",
              compact ? "text-base" : "text-lg sm:text-xl"
            )}
          >
            Collection
          </span>
        </div>
      </div>
      <span
        className={cn(
          "absolute -top-8 left-1/2 w-max max-w-[140px] -translate-x-1/2 text-center font-bold uppercase tracking-[0.35em] text-primary/80",
          compact ? "text-[8px]" : "text-[9px] sm:text-[10px]"
        )}
      >
        Private Residences
      </span>
    </motion.div>
  );
}
