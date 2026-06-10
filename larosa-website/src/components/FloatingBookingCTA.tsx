"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

function getHeroScrollRange() {
  if (typeof window === "undefined") {
    return { start: 700, end: 900, pointer: 750 };
  }
  const start = window.innerHeight * 1.4;
  const end = window.innerHeight * 1.65;
  return { start, end, pointer: start + 50 };
}

export function FloatingBookingCTA() {
  const { scrollY } = useScroll();
  const [range, setRange] = useState(getHeroScrollRange);

  useEffect(() => {
    const sync = () => setRange(getHeroScrollRange());
    sync();
    window.addEventListener("resize", sync, { passive: true });
    return () => window.removeEventListener("resize", sync);
  }, []);

  const opacity = useTransform(
    scrollY,
    [range.start, range.end],
    [0, 1]
  );
  const y = useTransform(scrollY, [range.start, range.end], [20, 0]);
  const pointerEvents = useTransform(scrollY, (value) =>
    value > range.pointer ? "auto" : "none"
  );

  return (
    <motion.div
      style={{
        opacity,
        y,
        pointerEvents: pointerEvents as unknown as "auto" | "none",
      }}
      className="fixed bottom-8 left-1/2 z-50 w-full max-w-fit -translate-x-1/2 px-4"
    >
      <div className="group relative overflow-hidden rounded-full border border-primary/30 bg-background/80 p-1 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all hover:border-primary/50 hover:shadow-primary/20 dark:bg-card/80">
        <div className="flex items-center gap-1 pr-1 sm:gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:h-11 sm:w-11">
            <Calendar size={18} />
          </div>

          <div className="flex flex-col px-2 text-left sm:px-3">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary/70">
              Reserve Your Sanctuary
            </span>
            <span className="font-serif text-[13px] text-foreground sm:text-sm">
              Check Availability
            </span>
          </div>

          <Button
            asChild
            className="rounded-full bg-primary px-6 font-serif text-[11px] tracking-[0.15em] hover:bg-primary/90 sm:px-8 sm:text-xs"
          >
            <Link href="/rooms">BOOK NOW</Link>
          </Button>
        </div>

        <div className="absolute inset-0 -z-10 translate-x-[-100%] bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 transition-transform duration-1000 ease-in-out group-hover:translate-x-[100%]" />
      </div>
    </motion.div>
  );
}
