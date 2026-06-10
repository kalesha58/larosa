"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CONTACT_SUBJECT_PROPERTY,
  LAROSA_COLLECTION_CLOSING,
  LAROSA_COLLECTION_CRITERIA,
  LAROSA_COLLECTION_CTA_PROMPT,
  LAROSA_COLLECTION_INTRO,
  getCollectionCriterionIcon,
  type CollectionCriterion,
} from "@/lib/larosa-collection";

const EASE = [0.16, 1, 0.3, 1] as const;
const VIEWPORT = { once: true, margin: "-60px" } as const;

const headerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const headerItem = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE },
  },
};

const criteriaContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const criteriaItem = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: EASE },
  },
};

type CriterionCardProps = {
  criterion: CollectionCriterion;
  index: number;
  animate: boolean;
};

function CriterionCard({ criterion, index, animate }: CriterionCardProps) {
  const Icon = getCollectionCriterionIcon(criterion.iconKey);
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.li
      variants={animate ? criteriaItem : undefined}
      whileHover={animate ? { y: -4, transition: { duration: 0.25 } } : undefined}
      className="group relative list-none"
    >
      <div
        className={cn(
          "relative flex h-full items-start gap-3.5 overflow-hidden rounded-2xl border border-border/50 p-4 sm:gap-4 sm:p-5",
          "bg-card/50 backdrop-blur-md transition-[border-color,box-shadow,background] duration-500",
          "hover:border-primary/25 hover:bg-card/80 hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.12)]",
          "dark:hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.35)]"
        )}
      >
        <span
          className="pointer-events-none absolute -right-2 -top-3 font-serif text-6xl font-light leading-none text-primary/[0.06] transition-colors duration-500 group-hover:text-primary/[0.1] sm:text-7xl"
          aria-hidden
        >
          {num}
        </span>

        <div
          className={cn(
            "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/15",
            "bg-primary/5 text-primary transition-all duration-500",
            "group-hover:scale-105 group-hover:border-primary/30 group-hover:bg-primary group-hover:text-primary-foreground"
          )}
        >
          <Icon size={18} strokeWidth={1.5} aria-hidden />
        </div>

        <p className="relative z-10 flex-1 pt-1.5 text-sm font-light leading-snug text-foreground sm:text-[15px] sm:leading-relaxed">
          {criterion.label}
        </p>
      </div>
    </motion.li>
  );
}

export function LarosaCollectionSection() {
  const shouldReduceMotion = useReducedMotion();
  const animate = !shouldReduceMotion;

  return (
    <section
      id="collection"
      className="relative isolate overflow-hidden py-20 sm:py-28 lg:py-32"
      aria-labelledby="collection-heading"
    >
      {/* Warm base + depth */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--section-warm)/0.5)_0%,hsl(var(--background))_45%,hsl(var(--background))_100%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <motion.div
          className="absolute -left-[15%] top-[10%] h-[50%] w-[55%] rounded-full bg-primary/[0.07] blur-[100px]"
          animate={
            animate
              ? { x: [0, 24, 0], y: [0, -16, 0] }
              : undefined
          }
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-[10%] bottom-[5%] h-[45%] w-[50%] rounded-full bg-primary/[0.05] blur-[120px]"
          animate={
            animate
              ? { x: [0, -20, 0], y: [0, 12, 0] }
              : undefined
          }
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 opacity-[0.25] bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,hsl(var(--section-warm)/0.8),transparent_65%)]" />
      </div>

      {/* Subtle texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025] mix-blend-multiply dark:opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      <div className="container relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12 xl:gap-16 lg:items-start">
          {/* Copy column */}
          <motion.div
            className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-24 xl:top-28"
            variants={animate ? headerContainer : undefined}
            initial={animate ? "hidden" : false}
            whileInView={animate ? "show" : undefined}
            viewport={VIEWPORT}
          >
            <motion.span
              variants={animate ? headerItem : undefined}
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-primary"
            >
              <span className="h-px w-8 bg-primary/40" aria-hidden />
              The LaRosa Collection
            </motion.span>

            <motion.h2
              id="collection-heading"
              variants={animate ? headerItem : undefined}
              className="mt-6 font-serif text-[2rem] leading-[1.08] text-foreground sm:text-5xl lg:text-[3.25rem] xl:text-6xl"
            >
              What Makes a{" "}
              <span className="block italic text-primary/90 sm:inline">
                LaRosa Property
              </span>
            </motion.h2>

            <motion.p
              variants={animate ? headerItem : undefined}
              className="mt-6 text-base text-muted-foreground font-light leading-relaxed sm:text-lg"
            >
              {LAROSA_COLLECTION_INTRO}
            </motion.p>

            <motion.div
              variants={animate ? headerItem : undefined}
              className="mt-8 hidden lg:block"
            >
              <p className="text-sm text-muted-foreground font-light leading-relaxed border-l-2 border-primary/20 pl-5 xl:text-base">
                {LAROSA_COLLECTION_CLOSING}
              </p>
            </motion.div>

            <motion.div
              variants={animate ? headerItem : undefined}
              className="mt-10 hidden rounded-[1.75rem] border border-border/60 bg-card/60 p-6 backdrop-blur-sm sm:p-8 lg:block"
            >
              <p className="text-sm font-medium text-foreground sm:text-base">
                {LAROSA_COLLECTION_CTA_PROMPT}
              </p>
              <Button
                asChild
                className="mt-5 h-12 w-full rounded-full px-8 font-serif text-xs tracking-[0.18em] shadow-lg shadow-primary/10 transition-shadow hover:shadow-xl hover:shadow-primary/15 sm:h-14 sm:w-auto"
              >
                <Link
                  href={`/contact?subject=${CONTACT_SUBJECT_PROPERTY}`}
                  className="group inline-flex items-center"
                >
                  Connect with us
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Criteria column */}
          <div className="lg:col-span-7 xl:col-span-7">
            <motion.ul
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-1 lg:gap-3.5"
              variants={animate ? criteriaContainer : undefined}
              initial={animate ? "hidden" : false}
              whileInView={animate ? "show" : undefined}
              viewport={VIEWPORT}
            >
              {LAROSA_COLLECTION_CRITERIA.map((criterion, idx) => (
                <CriterionCard
                  key={criterion.label}
                  criterion={criterion}
                  index={idx}
                  animate={animate}
                />
              ))}
            </motion.ul>

            {/* Mobile / tablet closing + CTA duplicate for flow after list on smaller screens */}
            <motion.div
              initial={animate ? { opacity: 0, y: 20 } : false}
              whileInView={animate ? { opacity: 1, y: 0 } : undefined}
              viewport={VIEWPORT}
              transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
              className="mt-10 space-y-6 lg:hidden"
            >
              <p className="text-sm text-muted-foreground font-light leading-relaxed border-t border-border/50 pt-6 sm:text-base">
                {LAROSA_COLLECTION_CLOSING}
              </p>
              <div className="rounded-[1.75rem] border border-border/60 bg-card/60 p-6 backdrop-blur-sm">
                <p className="text-sm font-medium text-foreground">
                  {LAROSA_COLLECTION_CTA_PROMPT}
                </p>
                <Button
                  asChild
                  className="mt-4 h-12 w-full rounded-full font-serif text-xs tracking-[0.18em]"
                >
                  <Link href={`/contact?subject=${CONTACT_SUBJECT_PROPERTY}`}>
                    Connect with us
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
