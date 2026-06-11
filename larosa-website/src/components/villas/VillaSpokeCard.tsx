"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useTransform,
  useInView,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { VillaIcon } from "@/components/villas/VillaIcon";
import type { HomeVilla } from "@/lib/villas-home";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Stagger variants for content items ── */
const contentContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const contentItem = {
  hidden: { opacity: 0, y: 14, filter: "blur(3px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: EASE },
  },
};

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
  const cardRef = useRef<HTMLButtonElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-60px" });

  /* ── Tilt effect on hover ── */
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useTransform(mouseY, [0, 1], [4, -4]);
  const rotateY = useTransform(mouseX, [0, 1], [-4, 4]);
  /* Parallax shift for the image */
  const imgX = useTransform(mouseX, [0, 1], [6, -6]);
  const imgY = useTransform(mouseY, [0, 1], [6, -6]);

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  const shouldAnimate = animate && isInView;

  return (
    <motion.button
      ref={cardRef}
      type="button"
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label={`View details for ${villa.name}`}
      aria-pressed={isActive}
      initial={
        animate
          ? { opacity: 0, y: 36, scale: 0.95, rotateX: 3 }
          : false
      }
      animate={
        shouldAnimate
          ? { opacity: 1, y: 0, scale: 1, rotateX: 0 }
          : undefined
      }
      transition={{
        duration: 0.9,
        delay: 0.3 + index * 0.18,
        ease: EASE,
      }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
      }}
      className={cn(
        "group w-full max-w-[380px] text-left",
        "rounded-3xl border border-border/60 bg-card/85 p-5 shadow-md backdrop-blur-sm sm:max-w-[400px]",
        "transition-all duration-500",
        "hover:border-primary/30 hover:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.18)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isActive && "border-primary/40 ring-2 ring-primary/25 shadow-lg",
        className
      )}
    >
      {/* ── Image with parallax + zoom ── */}
      <div className="relative mb-5 aspect-[4/3] min-h-[200px] overflow-hidden rounded-2xl border border-border/40 sm:min-h-[220px]">
        <motion.div
          className="absolute inset-[-8px]"
          style={{ x: imgX, y: imgY }}
        >
          <Image
            src={villa.img}
            alt=""
            fill
            className="object-cover grayscale-[0.35] contrast-[1.08] transition-all duration-700 group-hover:scale-[1.05] group-hover:grayscale-0"
            sizes="(max-width: 1024px) 100vw, 400px"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

        {/* Villa badge with scale-in animation */}
        <motion.span
          className="absolute left-3 top-3 rounded-full border border-primary/30 bg-background/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-primary shadow-sm"
          initial={animate ? { opacity: 0, scale: 0.7 } : false}
          animate={shouldAnimate ? { opacity: 1, scale: 1 } : undefined}
          transition={{
            duration: 0.5,
            delay: 0.6 + index * 0.18,
            ease: EASE,
          }}
        >
          Villa {String(index + 1).padStart(2, "0")}
        </motion.span>

        {/* Shimmer sweep over image on hover */}
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        </div>
      </div>

      {/* ── Staggered content section ── */}
      <motion.div
        className="space-y-4 px-0.5"
        variants={contentContainer}
        initial="hidden"
        animate={shouldAnimate ? "visible" : "hidden"}
      >
        <motion.div
          className="flex items-start gap-3.5"
          variants={contentItem}
        >
          {/* Icon with pulse ring */}
          <div className="relative">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/5 text-primary">
              <VillaIcon iconKey={villa.iconKey} className="h-[18px] w-[18px]" />
            </div>
            {/* Subtle expanding ring */}
            <motion.div
              className="absolute inset-0 rounded-full border border-primary/15"
              animate={
                shouldAnimate
                  ? { scale: [1, 1.5, 1.5], opacity: [0.5, 0, 0] }
                  : {}
              }
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 3,
                delay: 1.2 + index * 0.3,
                ease: "easeOut",
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-2xl leading-tight text-foreground">
              {villa.name}
            </h3>
          </div>
        </motion.div>

        {/* Animated separator */}
        <motion.div
          className="h-px w-0 bg-border/50"
          animate={shouldAnimate ? { width: "100%" } : { width: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.8 + index * 0.18,
            ease: EASE,
          }}
        />

        <ul className="space-y-2 pt-1">
          {previewHighlights.map((point, pointIndex) => (
            <motion.li
              key={point}
              className="flex items-center gap-2 text-sm font-light text-muted-foreground"
              variants={contentItem}
              custom={pointIndex}
            >
              <motion.span
                className="h-1 w-1 shrink-0 rounded-full bg-primary/50"
                initial={animate ? { scale: 0 } : false}
                animate={shouldAnimate ? { scale: 1 } : undefined}
                transition={{
                  duration: 0.4,
                  delay: 1 + index * 0.18 + pointIndex * 0.1,
                  ease: "easeOut",
                }}
              />
              {point}
            </motion.li>
          ))}
        </ul>

        <motion.span
          className="inline-flex items-center gap-1.5 pt-1 font-serif text-xs tracking-[0.15em] text-primary"
          variants={contentItem}
        >
          <span className="transition-transform duration-300 group-hover:translate-x-0.5">
            Explore residence
          </span>
          <motion.span
            className="inline-flex"
            animate={
              shouldAnimate
                ? { x: [0, 4, 0] }
                : {}
            }
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 2,
              delay: 1.5 + index * 0.3,
              ease: "easeInOut",
            }}
          >
            <ArrowRight className="h-4 w-4" aria-hidden />
          </motion.span>
        </motion.span>
      </motion.div>
    </motion.button>
  );
}
