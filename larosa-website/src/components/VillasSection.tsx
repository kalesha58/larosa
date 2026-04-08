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
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80",
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
    img: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1200&q=80",
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
    img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80",
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
    transition: { staggerChildren: 0.09, delayChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.21, 0.45, 0.32, 0.9] as const },
  },
};

export function VillasSection() {
  const [activeVillaIdx, setActiveVillaIdx] = useState(0);
  const activeVilla = VILLAS[activeVillaIdx];

  return (
    <section
      id="villas"
      className="relative overflow-hidden border-y border-border/60 bg-muted/25 py-16 sm:py-20 md:py-28 lg:py-36"
      aria-labelledby="villas-heading"
    >
      {/* Ambient layers — distinct from Signature Suites */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_100%_80%_at_100%_0%,hsl(var(--primary)/0.12),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_0%_100%,hsl(var(--muted-foreground)/0.08),transparent_45%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[32rem] w-[120%] -translate-x-1/2 bg-gradient-to-t from-background via-transparent to-transparent sm:w-full"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-[-20%] top-1/3 -z-10 h-72 w-72 rounded-full bg-primary/[0.05] blur-3xl sm:left-0 md:h-96 md:w-96"
        aria-hidden
      />

      <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-12 text-center sm:mb-16 lg:mb-20"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
        >
          <motion.div
            variants={item}
            className="mb-5 flex flex-wrap items-center justify-center gap-3 sm:mb-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-primary shadow-sm backdrop-blur-md sm:px-4 sm:py-2 sm:text-[11px]">
              <Trees className="h-3.5 w-3.5 shrink-0 opacity-85" aria-hidden />
              Private Estates
            </span>
          </motion.div>

          <motion.h2
            id="villas-heading"
            variants={item}
            className="font-serif text-[2rem] leading-[1.12] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[3.25rem] xl:text-7xl"
          >
            Larosa{" "}
            <span className="bg-gradient-to-r from-primary via-primary/85 to-primary/60 bg-clip-text text-transparent">
              Villas
            </span>
          </motion.h2>

          <motion.p
            variants={item}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg lg:mt-8 lg:max-w-3xl lg:text-xl lg:leading-relaxed"
          >
            For those who seek the ultimate in seclusion and personalized
            luxury, our private villas offer an entirely separate world of
            tranquil grandeur.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex justify-center sm:mt-10"
          >
            <Button
              asChild
              size="lg"
              variant="outline"
              className={cn(
                "h-12 rounded-full border-primary/35 bg-background/80 px-8 font-serif text-[11px] tracking-[0.2em] shadow-md backdrop-blur-sm sm:h-14 sm:px-10 sm:text-xs",
                "transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/15"
              )}
            >
              <Link href="/rooms" className="inline-flex items-center gap-2">
                Explore all villas
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 xl:col-span-3"
          >
            <div className="rounded-2xl border border-border/45 bg-background/70 p-3 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.22)] backdrop-blur-sm sm:rounded-3xl sm:p-4">
              <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto no-scrollbar touch-pan-x scroll-smooth px-1 pb-1 lg:mx-0 lg:block lg:space-y-3 lg:overflow-visible lg:px-0">
                {VILLAS.map((villa, i) => {
                  const selected = i === activeVillaIdx;
                  return (
                    <button
                      key={villa.name}
                      type="button"
                      onClick={() => setActiveVillaIdx(i)}
                      className={cn(
                        "min-w-[250px] snap-start rounded-xl border p-4 text-left transition-all duration-300 sm:min-w-[280px] sm:p-5 lg:min-w-0 lg:w-full",
                        selected
                          ? "border-primary/40 bg-primary/10 text-foreground shadow-[0_14px_28px_-18px_rgba(0,0,0,0.25)] ring-1 ring-primary/20"
                          : "border-border/55 bg-background text-foreground hover:border-primary/35 hover:bg-primary/[0.04]"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p
                            className={cn(
                              "text-[10px] uppercase tracking-[0.18em] font-medium",
                              selected
                                ? "text-primary"
                                : "text-muted-foreground/80"
                            )}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </p>
                          <h3 className="mt-2 font-serif text-lg leading-tight sm:text-xl">
                            {villa.name}
                          </h3>
                          <p
                            className={cn(
                              "mt-2 text-xs sm:text-sm",
                              selected
                                ? "text-foreground/80"
                                : "text-muted-foreground"
                            )}
                          >
                            {villa.size} • {villa.guests}
                          </p>
                        </div>
                        <ArrowRight
                          className={cn(
                            "h-4 w-4 shrink-0 transition-transform",
                            selected
                              ? "translate-x-0.5 text-primary"
                              : "text-muted-foreground/80"
                          )}
                          aria-hidden
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.article
            key={activeVilla.name}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-8 xl:col-span-9"
          >
            <div className="grid grid-cols-1 gap-6 rounded-2xl border border-border/55 bg-card/65 p-4 shadow-[0_20px_50px_-22px_rgba(0,0,0,0.22)] backdrop-blur-md sm:rounded-3xl sm:p-6 lg:grid-cols-12 lg:gap-8 lg:p-8">
              <div className="lg:col-span-7">
                <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-[11px]">
                  Featured villa
                </span>
                <h3 className="mt-4 font-serif text-3xl leading-tight text-foreground sm:text-4xl">
                  {activeVilla.name}
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {activeVilla.desc}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full border border-border/50 bg-background/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground sm:text-[11px]">
                    {activeVilla.size}
                  </span>
                  <span className="rounded-full border border-border/50 bg-background/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground sm:text-[11px]">
                    {activeVilla.guests}
                  </span>
                </div>

                <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {activeVilla.highlights.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-2 rounded-xl border border-border/45 bg-background/70 px-3 py-2"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm text-foreground">{point}</span>
                    </div>
                  ))}
                </div>

                <Button
                  asChild
                  size="lg"
                  className="mt-7 h-12 rounded-full px-8 font-serif text-xs tracking-[0.2em] sm:h-14 sm:text-sm"
                >
                  <Link href="/rooms" className="inline-flex items-center gap-2">
                    Enquire {activeVilla.name}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              </div>

              <div className="lg:col-span-5">
                <div className="relative h-[260px] overflow-hidden rounded-2xl border border-border/50 sm:h-[320px] lg:h-full lg:min-h-[360px]">
                  <Image
                    src={activeVilla.img}
                    alt={activeVilla.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-background/25 via-transparent to-transparent"
                    aria-hidden
                  />
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
