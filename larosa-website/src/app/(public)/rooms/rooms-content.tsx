"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useGetRooms } from "@/hooks/use-queries";
import { RoomCard } from "@/components/RoomCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const HERO_SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1920&q=80",
    label: "Presidential Suite",
    caption: "Unparalleled luxury for the most discerning guest",
  },
  {
    src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&q=80",
    label: "Grand Suite",
    caption: "Sweeping views and timeless elegance",
  },
  {
    src: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1920&q=80",
    label: "Deluxe Room",
    caption: "Refined comfort, thoughtfully designed",
  },
  {
    src: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1920&q=80",
    label: "Garden Suite",
    caption: "A private retreat amid lush greenery",
  },
  {
    src: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1920&q=80",
    label: "Pool Villa",
    caption: "Your own corner of paradise",
  },
];

function RoomsInner() {
  const searchParams = useSearchParams();
  const [type, setType] = useState<string>(
    () => searchParams.get("type") || "all"
  );
  const [priceRange, setPriceRange] = useState<number[]>(() => [
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 3000,
  ]);
  const [capacity, setCapacity] = useState<string>(
    () => searchParams.get("guests") || "any"
  );

  const [heroIndex, setHeroIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function goTo(i: number) {
    setHeroIndex((i + HERO_SLIDES.length) % HERO_SLIDES.length);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setHeroIndex((idx) => (idx + 1) % HERO_SLIDES.length),
      4500
    );
  }

  const { data: rooms, isLoading } = useGetRooms({
    type: type !== "all" ? type : undefined,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    capacity: capacity !== "any" ? Number(capacity) : undefined,
  });

  return (
    <div className="min-h-screen bg-background">
      <section className="relative h-[75vh] min-h-[480px] overflow-hidden">
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
              src={HERO_SLIDES[heroIndex].src}
              alt={HERO_SLIDES[heroIndex].label}
              fill
              priority={heroIndex === 0}
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-background/55 dark:bg-background/65" />
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
              <p className="text-primary uppercase tracking-[0.3em] text-xs mb-4">
                {HERO_SLIDES[heroIndex].label}
              </p>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground mb-4 leading-tight">
                Our Accommodations
              </h1>
              <p className="text-foreground/70 text-lg md:text-xl max-w-xl mx-auto font-light">
                {HERO_SLIDES[heroIndex].caption}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={() => goTo(heroIndex - 1)}
          className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 border border-foreground/30 flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary transition-colors bg-background/20 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={() => goTo(heroIndex + 1)}
          className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 border border-foreground/30 flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary transition-colors bg-background/20 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`transition-all duration-500 rounded-full ${
                i === heroIndex
                  ? "w-8 h-1 bg-primary"
                  : "w-2 h-1 bg-foreground/35"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="absolute bottom-8 right-8 z-20 text-xs text-foreground/50 font-serif tracking-widest">
          {String(heroIndex + 1).padStart(2, "0")} /{" "}
          {String(HERO_SLIDES.length).padStart(2, "0")}
        </div>
      </section>

      <div className="relative border-t border-border/50 bg-gradient-to-b from-muted/20 via-background to-background">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden />
        <div className="container mx-auto max-w-[1400px] px-4 pb-20 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pt-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12">
            {/* Filters — rich sticky panel */}
            <aside className="lg:col-span-4 xl:col-span-3">
              <div
                className={cn(
                  "lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:overflow-x-hidden lg:pr-1 xl:top-28",
                  "rounded-2xl border border-border/50 bg-card/60 p-6 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.12)] backdrop-blur-md sm:p-8",
                  "dark:border-border/40 dark:bg-card/40 dark:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.45)]"
                )}
              >
                <div className="mb-6 flex items-start gap-3 sm:mb-8">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/5">
                    <SlidersHorizontal
                      className="h-5 w-5 text-primary"
                      aria-hidden
                    />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg leading-tight text-foreground sm:text-xl">
                      Refine your stay
                    </h2>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      Tailor results by category, budget, and party size.
                    </p>
                  </div>
                </div>

                <div className="space-y-6 sm:space-y-7">
                  <div className="space-y-3">
                    <Label
                      htmlFor="rooms-filter-type"
                      className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-xs"
                    >
                      Room type
                    </Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger
                        id="rooms-filter-type"
                        className="h-12 rounded-xl border-border/60 bg-background/60 text-left text-sm shadow-sm transition-colors hover:border-primary/35 focus:ring-primary/20"
                      >
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="all">All types</SelectItem>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Deluxe">Deluxe</SelectItem>
                        <SelectItem value="Suite">Suite</SelectItem>
                        <SelectItem value="Presidential">Presidential</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-border/60" />

                  <div className="space-y-4">
                    <div className="flex items-end justify-between gap-2">
                      <Label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
                        Price / night
                      </Label>
                      <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 font-serif text-xs tabular-nums text-primary sm:text-sm">
                        ${priceRange[0]} – ${priceRange[1]}
                      </span>
                    </div>
                    <div className="rounded-xl border border-border/40 bg-muted/25 p-4 sm:p-5">
                      <Slider
                        defaultValue={[0, 3000]}
                        max={3000}
                        step={50}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="py-1"
                      />
                      <div className="mt-3 flex justify-between text-[10px] tabular-nums text-muted-foreground sm:text-xs">
                        <span>$0</span>
                        <span>$3,000+</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-border/60" />

                  <div className="space-y-3">
                    <Label
                      htmlFor="rooms-filter-guests"
                      className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-xs"
                    >
                      Guests
                    </Label>
                    <Select value={capacity} onValueChange={setCapacity}>
                      <SelectTrigger
                        id="rooms-filter-guests"
                        className="h-12 rounded-xl border-border/60 bg-background/60 text-left text-sm shadow-sm transition-colors hover:border-primary/35 focus:ring-primary/20"
                      >
                        <SelectValue placeholder="Any capacity" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="any">Any capacity</SelectItem>
                        <SelectItem value="1">1 guest</SelectItem>
                        <SelectItem value="2">2 guests</SelectItem>
                        <SelectItem value="3">3 guests</SelectItem>
                        <SelectItem value="4">4 guests</SelectItem>
                        <SelectItem value="5">5+ guests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full rounded-xl border-border/60 font-serif text-[11px] tracking-[0.18em] transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
                    onClick={() => {
                      setType("all");
                      setPriceRange([0, 3000]);
                      setCapacity("any");
                    }}
                  >
                    <RotateCcw className="mr-2 h-3.5 w-3.5" aria-hidden />
                    Reset filters
                  </Button>
                </div>
              </div>
            </aside>

            {/* Results */}
            <div className="min-w-0 space-y-6 lg:col-span-8 xl:col-span-9">
              <div
                className={cn(
                  "flex flex-col gap-4 rounded-2xl border border-border/45 bg-card/40 p-4 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:p-5",
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
                          ? `${rooms.length} ${rooms.length === 1 ? "suite" : "suites"} available`
                          : "No matches"}
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

              <div
                className={cn(
                  "rounded-2xl border border-border/40 bg-muted/10 p-4 sm:p-6 lg:rounded-3xl lg:p-8 xl:p-10",
                  "dark:bg-muted/5"
                )}
              >
                {isLoading ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
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
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 xl:gap-10">
                    {rooms.map((room, idx) => (
                      <RoomCard key={room.id} room={room} index={idx} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/30 px-6 py-16 text-center sm:py-24">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-muted/40">
                      <LayoutGrid
                        className="h-7 w-7 text-muted-foreground"
                        aria-hidden
                      />
                    </div>
                    <h3 className="font-serif text-xl text-foreground sm:text-2xl">
                      No rooms match these filters
                    </h3>
                    <p className="mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
                      Try widening your price range or clearing filters to see
                      more of La Rosa.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-8 rounded-xl border-primary/35 font-serif text-xs tracking-[0.18em] hover:bg-primary/10"
                      onClick={() => {
                        setType("all");
                        setPriceRange([0, 3000]);
                        setCapacity("any");
                      }}
                    >
                      <RotateCcw className="mr-2 h-3.5 w-3.5" aria-hidden />
                      Reset filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
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
