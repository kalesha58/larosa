"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATS = [
  { num: "37+", label: "Years of Excellence" },
  { num: "124", label: "Rooms & Suites" },
  { num: "98%", label: "Guest Satisfaction" },
] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.21, 0.45, 0.32, 0.9] as const },
  },
};

export function StorySection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden border-t border-border/60 bg-muted/20 py-16 sm:py-20 md:py-28 lg:py-36"
      aria-labelledby="story-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_90%_70%_at_0%_50%,hsl(var(--primary)/0.08),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[-20%] right-[-10%] -z-10 h-[32rem] w-[32rem] rounded-full bg-primary/[0.04] blur-3xl"
        aria-hidden
      />

      <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <motion.div
            className="order-2 space-y-6 sm:space-y-8 lg:order-1"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={container}
          >
            <motion.div variants={item} className="space-y-4 sm:space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-primary shadow-sm backdrop-blur-sm sm:px-4 sm:py-2 sm:text-[11px]">
                <BookOpen className="h-3.5 w-3.5 shrink-0 opacity-85" aria-hidden />
                Our Story
              </span>
              <h2
                id="story-heading"
                className="font-serif text-[2rem] leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-6xl"
              >
                Born from a Vision{" "}
                <span className="mt-1 block font-normal italic text-primary/90 sm:mt-2">
                  of Timeless Grace
                </span>
              </h2>
            </motion.div>

            <motion.div variants={item} className="space-y-4 text-base leading-relaxed text-muted-foreground sm:text-[17px] sm:leading-relaxed">
              <p>
                Founded in 1987, La Rosa began as a singular vision: to craft a
                sanctuary that would honour the traveller who seeks not spectacle,
                but substance. Nestled between heritage architecture and modern
                sensibility, we have become a landmark of quiet distinction.
              </p>
              <p>
                Every room, every corridor, every curated detail reflects decades
                of dedication to an artform we call &quot;elevated stillness&quot;
                — the rare ability to make a guest feel that time has slowed, and
                that every moment belongs entirely to them.
              </p>
            </motion.div>

            <motion.div
              variants={item}
              className="grid grid-cols-3 gap-2 sm:gap-4"
            >
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className={cn(
                    "rounded-2xl border border-border/50 bg-card/70 py-5 text-center shadow-sm backdrop-blur-sm",
                    "transition-all duration-300 hover:border-primary/25 hover:shadow-md sm:py-6"
                  )}
                >
                  <div className="font-serif text-2xl text-primary sm:text-3xl">
                    {stat.num}
                  </div>
                  <div className="mt-1.5 px-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground sm:text-[11px] sm:tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={item}>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-primary/35 bg-background/80 px-8 font-serif text-[11px] tracking-[0.2em] shadow-md backdrop-blur-sm transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-lg sm:h-14 sm:px-10 sm:text-xs"
              >
                <Link href="/about">Read our story</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.21, 0.45, 0.32, 0.9] }}
            className="relative order-1 lg:order-2"
          >
            <div
              className={cn(
                "relative aspect-[4/5] w-full overflow-hidden rounded-2xl sm:rounded-3xl",
                "border border-border/50 shadow-[0_28px_64px_-24px_rgba(0,0,0,0.22)] ring-1 ring-border/30",
                "dark:shadow-[0_28px_64px_-24px_rgba(0,0,0,0.55)]"
              )}
            >
              <Image
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80"
                alt="La Rosa Hotel exterior"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent"
                aria-hidden
              />
            </div>
            <div className="absolute -left-2 top-6 z-10 hidden sm:block sm:-left-4 lg:top-10">
              <div className="overflow-hidden rounded-2xl border-4 border-background shadow-xl ring-1 ring-border/40">
                <Image
                  src="/architectural-detail.png"
                  alt="Architectural detail"
                  width={160}
                  height={160}
                  className="aspect-square w-32 object-cover sm:w-40"
                />
              </div>
            </div>
            <div className="absolute -bottom-3 right-4 z-10 sm:-bottom-4 sm:right-6">
              <div className="rounded-2xl bg-primary px-5 py-4 text-primary-foreground shadow-xl shadow-primary/25 sm:px-6 sm:py-5">
                <p className="font-serif text-xl font-semibold sm:text-2xl">
                  Est. 1987
                </p>
                <p className="mt-1 text-[10px] tracking-[0.25em] text-primary-foreground/90 uppercase sm:text-xs">
                  Beverly Hills
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
