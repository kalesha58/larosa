"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Sparkles,
  Star,
  Utensils,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EXPERIENCES = [
  {
    title: "The Obsidian Spa",
    body: "Dark stone and still waters create a profound silence. Specialized treatments designed to restore your deepest equilibrium.",
    icon: Star,
  },
  {
    title: "Aureate Dining",
    body: "Michelin-starred culinary artistry served in an intimate, candlelit setting with panoramic views.",
    icon: Utensils,
  },
  {
    title: "Private Concierge",
    body: "Unobtrusive, anticipatory service available 24/7. Whatever you need, arranged effortlessly.",
    icon: Wifi,
  },
  {
    title: "Infinity Pool & Fitness",
    body: "A resort-style infinity pool overlooking the city, alongside a fully-equipped private wellness suite.",
    icon: Dumbbell,
  },
] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.21, 0.45, 0.32, 0.9] as const },
  },
};

export function ExperiencesSection() {
  return (
    <section
      id="amenities"
      className="relative overflow-hidden py-16 sm:py-20 md:py-28 lg:py-36"
      aria-labelledby="experiences-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_85%_55%_at_20%_20%,hsl(var(--primary)/0.1),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[28rem] w-[28rem] translate-x-1/4 rounded-full bg-muted/50 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-border to-transparent"
        aria-hidden
      />

      <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.21, 0.45, 0.32, 0.9] }}
            className="relative order-2 lg:order-1"
          >
            <div
              className={cn(
                "relative aspect-[4/5] w-full overflow-hidden rounded-2xl sm:aspect-[3/4] sm:rounded-3xl",
                "border border-border/50 shadow-[0_28px_64px_-24px_rgba(0,0,0,0.25)] dark:shadow-[0_28px_64px_-24px_rgba(0,0,0,0.55)]",
                "ring-1 ring-border/30"
              )}
            >
              <Image
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&q=80"
                alt="Luxury spa interior"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1.2s] ease-out hover:scale-[1.02]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"
                aria-hidden
              />
            </div>
            <div className="absolute -bottom-4 -right-2 z-10 w-36 sm:-bottom-6 sm:-right-4 sm:w-44 md:w-48">
              <div
                className={cn(
                  "overflow-hidden rounded-2xl border-4 border-background shadow-xl",
                  "ring-1 ring-border/40"
                )}
              >
                <Image
                  src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80"
                  alt="Spa treatment detail"
                  width={192}
                  height={192}
                  className="aspect-square w-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Copy + features */}
          <motion.div
            className="order-1 space-y-8 sm:space-y-10 lg:order-2 lg:pl-4 xl:pl-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            variants={container}
          >
            <motion.div variants={item} className="space-y-4 sm:space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-primary sm:px-4 sm:py-2 sm:text-[11px]">
                <Sparkles className="h-3.5 w-3.5 shrink-0 opacity-85" aria-hidden />
                Curated for You
              </span>
              <h2
                id="experiences-heading"
                className="font-serif text-[2rem] leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-[3rem] xl:text-6xl"
              >
                Elevated{" "}
                <span className="bg-gradient-to-r from-primary via-primary/85 to-primary/55 bg-clip-text text-transparent">
                  Experiences
                </span>
              </h2>
            </motion.div>

            <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto no-scrollbar touch-pan-x scroll-smooth px-1 pb-1 md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-1 xl:grid-cols-2">
              {EXPERIENCES.map((exp) => {
                const Icon = exp.icon;
                return (
                <motion.div
                  key={exp.title}
                  variants={item}
                  className={cn(
                    "group min-w-[280px] snap-start rounded-2xl border border-border/45 bg-card/50 p-4 backdrop-blur-[2px] transition-all duration-300 sm:min-w-[320px] md:min-w-0",
                    "hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5",
                    "sm:p-5"
                  )}
                >
                  <div className="flex gap-4">
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/5",
                        "transition-colors group-hover:border-primary/50 group-hover:bg-primary/10"
                      )}
                    >
                      <Icon className="h-[18px] w-[18px] text-primary" aria-hidden />
                    </div>
                    <div className="min-w-0 space-y-1.5">
                      <h3 className="font-serif text-base text-foreground sm:text-lg">
                        {exp.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {exp.body}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
