"use client";

import { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useGetRooms } from "@/hooks/use-queries";
import { buildHeroSlides } from "@/lib/villa-display";
import { RoomCard } from "@/components/RoomCard";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

function RoomsInner() {
  const { data: rooms, isLoading } = useGetRooms();
  const heroSlides = useMemo(
    () => (rooms ? buildHeroSlides(rooms) : []),
    [rooms]
  );

  const [heroIndex, setHeroIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setHeroIndex(0);
  }, [heroSlides.length]);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroSlides.length);
    }, 4500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [heroSlides.length]);

  function goTo(i: number) {
    if (heroSlides.length === 0) return;
    setHeroIndex((i + heroSlides.length) % heroSlides.length);
    if (timerRef.current) clearInterval(timerRef.current);
    if (heroSlides.length > 1) {
      timerRef.current = setInterval(
        () => setHeroIndex((idx) => (idx + 1) % heroSlides.length),
        4500
      );
    }
  }

  const currentSlide = heroSlides[heroIndex];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative h-[75vh] min-h-[480px] overflow-hidden">
        {currentSlide ? (
          <>
            <AnimatePresence mode="sync">
              <motion.div
                key={heroIndex}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.3, ease: "easeInOut" }}
              >
                <Image
                  src={currentSlide.src}
                  alt={currentSlide.label}
                  fill
                  priority={heroIndex === 0}
                  sizes="100vw"
                  className="object-cover saturate-[1.1]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/50" />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-4 pt-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.7 }}
                >
                  <p className="text-white/90 uppercase tracking-[0.3em] text-xs mb-4 font-medium">
                    {currentSlide.label}
                  </p>
                  <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-4 leading-tight drop-shadow-md">
                    Our Villas
                  </h1>
                  <p className="text-white/80 text-lg md:text-xl max-w-xl mx-auto font-light drop-shadow-sm">
                    {currentSlide.caption}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {heroSlides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goTo(heroIndex - 1)}
                  className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:text-white hover:border-white hover:bg-white/10 transition-all backdrop-blur-md"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(heroIndex + 1)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:text-white hover:border-white hover:bg-white/10 transition-all backdrop-blur-md"
                  aria-label="Next slide"
                >
                  <ChevronRight size={20} />
                </button>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                  {heroSlides.map((slide, i) => (
                    <button
                      key={`${slide.src}-${i}`}
                      type="button"
                      onClick={() => goTo(i)}
                      className={`transition-all duration-500 rounded-full ${
                        i === heroIndex
                          ? "w-8 h-1 bg-white"
                          : "w-2 h-1 bg-white/40"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                <div className="absolute bottom-8 right-8 z-20 text-xs text-white/70 font-serif tracking-widest drop-shadow-sm">
                  {String(heroIndex + 1).padStart(2, "0")} /{" "}
                  {String(heroSlides.length).padStart(2, "0")}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
      </section>

      <div className="relative border-t border-border/50 bg-gradient-to-b from-muted/20 via-background to-background">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden />
        <div className="container mx-auto max-w-[1400px] px-4 pb-20 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pt-16">

          {/* Results bar */}
          <div
            className={cn(
              "mb-6 flex flex-col gap-4 rounded-2xl border border-border/45 bg-card/40 p-4 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:p-5",
              "dark:bg-card/25"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/5">
                <LayoutGrid className="h-5 w-5 text-primary" aria-hidden />
              </div>
              <div>
                <p className="font-serif text-base text-foreground sm:text-lg">
                  {isLoading
                    ? "Searching…"
                    : rooms && rooms.length > 0
                      ? `${rooms.length} ${rooms.length === 1 ? "villa" : "villas"} available`
                      : "No villas found"}
                </p>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Curated spaces matching your preferences
                </p>
              </div>
            </div>
            {!isLoading && rooms && rooms.length > 0 && (
              <span className="inline-flex w-fit items-center rounded-full border border-border/50 bg-background/80 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Live results
              </span>
            )}
          </div>

          {/* Villa grid */}
          <div
            className={cn(
              "rounded-2xl border border-border/40 bg-muted/10 p-4 sm:p-6 lg:rounded-3xl lg:p-8 xl:p-10",
              "dark:bg-muted/5"
            )}
          >
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={`rooms-result-skeleton-${i}`}
                    className="overflow-hidden rounded-2xl border border-border/40 bg-card/40"
                  >
                    <div className="aspect-[4/3] animate-pulse bg-muted/60" />
                    <div className="space-y-3 p-6">
                      <div className="h-6 w-2/3 animate-pulse rounded-md bg-muted/70" />
                      <div className="h-4 w-full animate-pulse rounded-md bg-muted/50" />
                      <div className="h-4 w-4/5 animate-pulse rounded-md bg-muted/50" />
                    </div>
                  </div>
                ))}
              </div>
            ) : rooms && rooms.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8 xl:gap-10">
                {rooms.map((room, idx) => (
                  <RoomCard
                    key={`room-${room.id}-${idx}`}
                    room={room}
                    index={idx}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/30 px-6 py-16 text-center sm:py-24">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-muted/40">
                  <LayoutGrid className="h-7 w-7 text-muted-foreground" aria-hidden />
                </div>
                <h3 className="font-serif text-xl text-foreground sm:text-2xl">
                  No villas available
                </h3>
                <p className="mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
                  Please check back soon — new villas are being added.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function RoomsContent() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background pt-32">
          <div className="h-[50vh] bg-muted animate-pulse" />
        </div>
      }
    >
      <RoomsInner />
    </Suspense>
  );
}
