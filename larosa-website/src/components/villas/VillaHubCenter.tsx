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
      initial={animate ? { opacity: 0, scale: 0.85 } : false}
      whileInView={animate ? { opacity: 1, scale: 1 } : undefined}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: EASE }}
      aria-hidden
    >
      {/* Outer pulsing glow ring */}
      {animate && (
        <motion.div
          className={cn(
            "absolute rounded-full border border-primary/10",
            compact
              ? "h-[140px] w-[140px]"
              : "h-[180px] w-[180px] sm:h-[200px] sm:w-[200px]"
          )}
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.4, 0.15, 0.4],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Orbiting dot */}
      {animate && (
        <motion.div
          className={cn(
            "absolute",
            compact ? "h-[136px] w-[136px]" : "h-[170px] w-[170px] sm:h-[190px] sm:w-[190px]"
          )}
          animate={{ rotate: 360 }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary/30" />
        </motion.div>
      )}

      {/* Main hub container */}
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

        {/* Inner circle with scale-in animation */}
        <motion.div
          className={cn(
            "flex flex-col items-center justify-center rounded-full bg-primary text-center text-primary-foreground",
            compact ? "h-[88px] w-[88px] px-2" : "h-[108px] w-[108px] px-3 sm:h-[120px] sm:w-[120px]"
          )}
          initial={animate ? { scale: 0.8, opacity: 0 } : false}
          whileInView={animate ? { scale: 1, opacity: 1 } : undefined}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
        >
          <motion.span
            className={cn(
              "font-bold uppercase tracking-[0.25em] text-primary-foreground/75",
              compact ? "text-[7px]" : "text-[8px] sm:text-[9px]"
            )}
            initial={animate ? { opacity: 0, y: 6 } : false}
            whileInView={animate ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
          >
            The Villa
          </motion.span>
          <motion.span
            className={cn(
              "font-serif italic leading-tight",
              compact ? "text-base" : "text-lg sm:text-xl"
            )}
            initial={animate ? { opacity: 0, y: 6 } : false}
            whileInView={animate ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
          >
            Collection
          </motion.span>
        </motion.div>
      </div>

      {/* "Private Residences" label */}
      <motion.span
        className={cn(
          "absolute -top-8 left-1/2 w-max max-w-[140px] -translate-x-1/2 text-center font-bold uppercase tracking-[0.35em] text-primary/80",
          compact ? "text-[8px]" : "text-[9px] sm:text-[10px]"
        )}
        initial={animate ? { opacity: 0, y: 8, letterSpacing: "0.15em" } : false}
        whileInView={
          animate ? { opacity: 1, y: 0, letterSpacing: "0.35em" } : undefined
        }
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
      >
        Private Residences
      </motion.span>
    </motion.div>
  );
}
