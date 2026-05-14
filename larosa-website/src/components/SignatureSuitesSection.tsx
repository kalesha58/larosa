"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarDays, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Room } from "@/hooks/use-queries";
import { cn } from "@/lib/utils";

interface SignatureSuitesSectionProps {
  isLoading: boolean;
  rooms: Room[] | undefined;
}

export function SignatureSuitesSection({
  isLoading,
  rooms,
}: SignatureSuitesSectionProps) {
  const count = rooms?.length ?? 0;
  const gridClass =
    count > 2
      ? "grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3"
      : "mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-2";

  return (
    <section
      className="relative overflow-hidden border-y border-border/40 bg-[hsl(var(--section-warm))]/80 py-20 sm:py-28"
      aria-labelledby="signature-suites-heading"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[120%] w-[140%] -translate-x-1/2 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(var(--primary)/0.08),transparent_55%)]" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-border/80 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/60 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.35em] text-primary backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 opacity-80" aria-hidden />
              The collection
            </span>
            <h2
              id="signature-suites-heading"
              className="font-serif text-4xl leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]"
            >
              Signature{" "}
              <span className="italic text-primary/85">Suites</span>
            </h2>
            <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-muted-foreground sm:text-lg">
              A curated collection of our most exceptional spaces, where every
              detail is an expression of refined luxury and absolute tranquility.
            </p>
          </motion.div>
        </div>

        <div className={gridClass}>
          {isLoading ? (
            <>
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="flex aspect-[4/5] flex-col overflow-hidden rounded-[2rem] border border-border/50 bg-muted/30 shadow-inner"
                >
                  <div className="min-h-0 flex-1 animate-pulse bg-muted/50" />
                  <div className="shrink-0 space-y-3 p-5">
                    <div className="h-12 animate-pulse rounded-full bg-muted/60" />
                  </div>
                </div>
              ))}
            </>
          ) : (
            rooms?.map((room, idx) => (
              <SuiteShowcaseCard key={room.id} room={room} index={idx} />
            ))
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-14 text-center sm:mt-20"
        >
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 rounded-full border-border/60 bg-background/50 px-10 font-serif text-[11px] tracking-[0.28em] backdrop-blur-sm transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground sm:h-14 sm:px-14"
          >
            <Link href="/rooms">Discover all accommodations</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

function SuiteShowcaseCard({
  room,
  index,
}: {
  room: Room;
  index: number;
}) {
  const imageSrc = room.images[0] ?? "/room-deluxe.png";

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.75,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "group relative aspect-[4/5] overflow-hidden rounded-[2rem]",
        "border border-white/15 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.55)] ring-1 ring-black/5",
        "transition-[transform,box-shadow] duration-500 ease-out will-change-transform",
        "hover:-translate-y-1 hover:shadow-[0_32px_90px_-28px_rgba(0,0,0,0.6)]"
      )}
    >
      <Image
        src={imageSrc}
        alt={room.title}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover transition-[transform,filter] duration-[1.4s] ease-out group-hover:scale-[1.06] group-hover:saturate-[1.05]"
      />

      {/* Readability: vignette + bottom scrim */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_30%,transparent_20%,rgba(0,0,0,0.5)_100%)] opacity-80 transition-opacity duration-500 group-hover:opacity-95"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10"
        aria-hidden
      />

      {/* Room detail — stops above the action bar so Book / availability stay distinct */}
      <Link
        href={`/rooms/${room.id}`}
        className="absolute inset-x-0 top-0 z-[2] bottom-[13.5rem] outline-none ring-offset-2 ring-offset-transparent focus-visible:ring-2 focus-visible:ring-white/60 sm:bottom-[8rem]"
        aria-label={`View ${room.title} details`}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-[11rem] z-[3] px-7 pb-2 pt-16 sm:bottom-[6rem] sm:px-9 lg:bottom-[5.75rem]">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0 space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/75">
              {room.type}
            </p>
            <h3
              className="font-serif text-2xl leading-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] sm:text-3xl lg:text-[2rem]"
            >
              {room.title}
            </h3>
          </div>
          <div className="shrink-0 text-right">
            <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.3em] text-white/55">
              From
            </p>
            <p className="font-serif text-xl tabular-nums text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.75)] sm:text-2xl">
              ₹{room.price.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Consistent floating action bar — every suite */}
      <div className="absolute inset-x-4 bottom-4 z-[5] sm:inset-x-5 sm:bottom-5">
        <div
          className={cn(
            "flex flex-col gap-3 rounded-2xl border border-white/20 bg-background/92 p-3 shadow-[0_12px_48px_-8px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:rounded-full sm:py-2.5 sm:pl-4 sm:pr-2 dark:border-white/10 dark:bg-zinc-950/90"
          )}
        >
          <Link
            href={`/rooms/${room.id}`}
            className="pointer-events-auto flex min-w-0 items-start gap-3 rounded-xl px-1 py-1 transition-colors hover:bg-muted/50 sm:items-center sm:rounded-full sm:py-0 sm:pl-1 sm:pr-3"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
              <CalendarDays className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </span>
            <span className="min-w-0 text-left">
              <span className="block text-[9px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Reserve your sanctuary
              </span>
              <span className="font-serif text-sm text-foreground sm:text-[15px]">
                Check availability
              </span>
            </span>
          </Link>
          <Button
            asChild
            size="sm"
            className="h-11 shrink-0 rounded-full px-7 font-sans text-[10px] font-semibold uppercase tracking-[0.22em] shadow-lg sm:h-10"
          >
            <Link href={`/booking/${room.id}`} className="pointer-events-auto">
              Book now
            </Link>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
