"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  CarFront,
  Clapperboard,
  Leaf,
  TreePine,
  Wind,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IVillaAmenity } from "./VillaAmenitiesSection.interfaces";

const EASE = [0.16, 1, 0.3, 1] as const;

const AMENITIES: IVillaAmenity[] = [
  {
    title: "Home Cinema",
    description: "Immersive in-villa entertainment setup with premium surround audio.",
    icon: Clapperboard,
  },
  {
    title: "Garden Dining",
    description: "Open-air dining terraces for intimate breakfasts and sunset dinners.",
    icon: TreePine,
  },
  {
    title: "Private Parking",
    description: "Secure gated parking access with dedicated bays for each residence.",
    icon: CarFront,
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

/* ── Staggered header variants ── */
const headerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
};

const headerItem = {
  hidden: { opacity: 0, y: 22, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: EASE },
  },
};

/* ── Amenity card with hover tilt ── */
function AmenityCard({
  item,
  idx,
  animate,
  isInView,
}: {
  item: IVillaAmenity;
  idx: number;
  animate: boolean;
  isInView: boolean;
}) {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useTransform(mouseY, [0, 1], [3, -3]);
  const rotateY = useTransform(mouseX, [0, 1], [-3, 3]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  const shouldAnimate = animate && isInView;

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX: animate ? rotateX : 0,
        rotateY: animate ? rotateY : 0,
        transformPerspective: 800,
      }}
      initial={
        animate
          ? { opacity: 0, y: 32, scale: 0.96, rotateX: 4 }
          : false
      }
      animate={
        shouldAnimate
          ? { opacity: 1, y: 0, scale: 1, rotateX: 0 }
          : undefined
      }
      transition={{
        duration: 0.7,
        delay: 0.15 + idx * 0.1,
        ease: EASE,
      }}
      className={cn(
        "group relative p-8 rounded-[2.5rem] overflow-hidden",
        "bg-card/40 border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl",
        "transition-all duration-500",
        "hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)] hover:-translate-y-1 hover:bg-card/60",
        "hover:border-primary/25"
      )}
    >
      {/* Subtle Icon Decor */}
      <div className="absolute top-8 right-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none">
        <item.icon size={120} strokeWidth={1} />
      </div>

      {/* Shimmer sweep on hover */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[2.5rem]">
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/8 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
      </div>

      <motion.div
        className="relative z-10 space-y-6"
        initial="hidden"
        animate={shouldAnimate ? "visible" : "hidden"}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.08, delayChildren: 0.2 + idx * 0.1 },
          },
        }}
      >
        {/* Icon with scale-in and pulse ring */}
        <motion.div
          className="relative"
          variants={{
            hidden: { opacity: 0, scale: 0.7 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { duration: 0.5, ease: EASE },
            },
          }}
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
            <item.icon size={22} strokeWidth={1.5} />
          </div>
          {/* Expanding pulse ring */}
          {animate && (
            <motion.div
              className="absolute inset-0 rounded-2xl border border-primary/15"
              animate={
                shouldAnimate
                  ? { scale: [1, 1.6, 1.6], opacity: [0.4, 0, 0] }
                  : {}
              }
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 4,
                delay: 1.5 + idx * 0.3,
                ease: "easeOut",
              }}
            />
          )}
        </motion.div>

        <motion.div
          className="space-y-3"
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: EASE },
            },
          }}
        >
          <h3 className="font-serif text-2xl sm:text-3xl text-foreground leading-tight">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-[240px] group-hover:text-foreground/80 transition-colors duration-300">
            {item.description}
          </p>
        </motion.div>

        {/* "Discover More" with slide-in */}
        <motion.div
          className="pt-4 flex items-center gap-2"
          variants={{
            hidden: { opacity: 0, x: -16 },
            visible: {
              opacity: 0,
              x: -10,
              transition: { duration: 0.4, ease: EASE },
            },
          }}
        >
          <div className="w-0 h-px bg-primary/30 transition-all duration-500 group-hover:w-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
            Discover More
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ── Stats counter animation ── */
function AnimatedStat({
  label,
  val,
  delay,
  animate,
  isInView,
}: {
  label: string;
  val: string;
  delay: number;
  animate: boolean;
  isInView: boolean;
}) {
  const shouldAnimate = animate && isInView;

  return (
    <motion.div
      className="space-y-1"
      initial={animate ? { opacity: 0, y: 16 } : false}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <motion.p
        className="font-serif text-3xl text-foreground"
        initial={animate ? { opacity: 0, scale: 0.8 } : false}
        animate={shouldAnimate ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.5, delay: delay + 0.15, ease: EASE }}
      >
        {val}
      </motion.p>
    </motion.div>
  );
}

export function VillaAmenitiesSection() {
  const shouldReduceMotion = useReducedMotion();
  const animate = !shouldReduceMotion;
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

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
          {/* ── Header with staggered reveal ── */}
          <motion.div
            ref={headerRef}
            className="max-w-2xl space-y-6"
            variants={animate ? headerContainer : undefined}
            initial={animate ? "hidden" : false}
            animate={animate ? (headerInView ? "visible" : "hidden") : undefined}
          >
            {/* "Personalized Luxury" with letter-spacing reveal */}
            <motion.span
              className="block text-[10px] font-bold uppercase tracking-[0.4em] text-primary/80"
              variants={animate ? headerItem : undefined}
            >
              <motion.span
                animate={
                  animate && headerInView
                    ? { letterSpacing: "0.4em" }
                    : { letterSpacing: "0.1em" }
                }
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                Personalized Luxury
              </motion.span>
            </motion.span>

            <motion.h2
              id="amenities-heading"
              className="font-serif text-4xl sm:text-5xl lg:text-7xl leading-[1.1] text-foreground"
              variants={animate ? headerItem : undefined}
            >
              Beyond the <br />
              <motion.span
                className="italic text-primary/90"
                initial={animate ? { opacity: 0, x: -20 } : false}
                animate={
                  animate && headerInView
                    ? { opacity: 1, x: 0 }
                    : undefined
                }
                transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
              >
                Expected
              </motion.span>
            </motion.h2>

            {/* Decorative reveal line */}
            <motion.div
              className="h-[2px] bg-gradient-to-r from-primary/40 via-primary/20 to-transparent"
              initial={animate ? { width: 0, opacity: 0 } : false}
              animate={
                animate && headerInView
                  ? { width: 80, opacity: 1 }
                  : undefined
              }
              transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
            />

            <motion.p
              className="text-lg text-muted-foreground font-light leading-relaxed"
              variants={animate ? headerItem : undefined}
            >
              Every LaRosa villa is a private world designed for absolute comfort,
              where world-class amenities meet the warmth of a personal sanctuary.
            </motion.p>
          </motion.div>

          {/* ── Stats with counter animation ── */}
          <div className="flex gap-12 border-l border-primary/10 pl-8 hidden sm:flex">
            {[
              { label: "Guest Rating", val: "4.9/5", delay: 0.4 },
              { label: "Private Pool", val: "100%", delay: 0.55 },
            ].map((m) => (
              <AnimatedStat
                key={m.label}
                label={m.label}
                val={m.val}
                delay={m.delay}
                animate={animate}
                isInView={headerInView}
              />
            ))}
          </div>
        </div>

        {/* ── Amenity cards grid with tilt + staggered entrance ── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {AMENITIES.map((amenity, idx) => (
            <AmenityCard
              key={amenity.title}
              item={amenity}
              idx={idx}
              animate={animate}
              isInView={gridInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
