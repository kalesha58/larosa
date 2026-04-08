"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoomCard } from "@/components/RoomCard";
import type { Room } from "@/hooks/use-queries";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.21, 0.45, 0.32, 0.9] as const },
  },
};

interface SignatureSuitesSectionProps {
  isLoading: boolean;
  rooms: Room[] | undefined;
}

export function SignatureSuitesSection({
  isLoading,
  rooms,
}: SignatureSuitesSectionProps) {
  return (
    <section
      className="relative overflow-hidden py-16 sm:py-20 md:py-28 lg:py-36"
      aria-labelledby="signature-suites-heading"
    >
      {/* Ambient background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_90%_60%_at_50%_-15%,hsl(var(--primary)/0.14),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-24 right-[-10%] -z-10 h-[28rem] w-[28rem] rounded-full bg-primary/[0.06] blur-3xl sm:right-0 md:h-[36rem] md:w-[36rem]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-[-15%] -z-10 h-[22rem] w-[22rem] rounded-full bg-muted/60 blur-3xl sm:left-0"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-border to-transparent"
        aria-hidden
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        <motion.div
          className="mb-10 sm:mb-12 lg:mb-14"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={container}
        >
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <div className="max-w-3xl space-y-5 sm:space-y-6 text-center lg:text-left lg:mx-0 mx-auto">
              <motion.div
                variants={item}
                className="flex flex-wrap items-center justify-center gap-3 lg:justify-start"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-primary sm:text-[11px] sm:px-4 sm:py-2">
                  <Sparkles className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
                  Curated Accommodations
                </span>
              </motion.div>

              <motion.div variants={item} className="space-y-4 sm:space-y-5">
                <h2
                  id="signature-suites-heading"
                  className="font-serif text-[2rem] leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-7xl"
                >
                  Signature{" "}
                  <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                    Suites
                  </span>
                </h2>
                <p className="text-muted-foreground mx-auto max-w-xl text-base leading-relaxed sm:text-lg lg:mx-0 lg:max-w-2xl lg:text-xl lg:leading-relaxed">
                  Our meticulously designed spaces offer a perfect harmony of
                  deep comfort, sophisticated aesthetics, and uncompromising
                  privacy.
                </p>
              </motion.div>

              {/* Mobile / tablet CTA */}
              <motion.div
                variants={item}
                className="flex justify-center pt-2 lg:hidden"
              >
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full px-8 font-serif text-xs tracking-[0.2em] shadow-lg shadow-primary/10"
                >
                  <Link
                    href="/rooms"
                    className="inline-flex items-center gap-2"
                  >
                    View all suites
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Desktop CTA */}
            <motion.div
              variants={item}
              className="hidden shrink-0 lg:block"
            >
              <Button
                asChild
                size="lg"
                variant="outline"
                className={cn(
                  "group h-14 rounded-full border-primary/35 bg-background/60 px-10 font-serif text-xs tracking-[0.22em] backdrop-blur-sm",
                  "transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-xl hover:shadow-primary/20"
                )}
              >
                <Link href="/rooms" className="inline-flex items-center gap-3">
                  View all suites
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Cards grid */}
        {isLoading ? (
          <div
            className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3"
            role="status"
            aria-label="Loading suites"
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-[4/5] animate-pulse rounded-2xl border border-border/50 bg-gradient-to-br from-muted/80 to-muted/30 sm:rounded-3xl"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
            {rooms?.map((room, idx) => (
              <RoomCard
                key={room.id}
                room={room}
                featured
                index={idx}
                variant="showcase"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
