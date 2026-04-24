"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingBookingCTA() {
  const { scrollY } = useScroll();
  
  // Only show after scrolling past 600px (roughly the hero)
  const opacity = useTransform(scrollY, [500, 700], [0, 1]);
  const y = useTransform(scrollY, [500, 700], [20, 0]);
  const pointerEvents = useTransform(scrollY, (value) => value > 600 ? "auto" : "none");

  return (
    <motion.div
      style={{ 
        opacity, 
        y,
        pointerEvents: pointerEvents as any
      }}
      className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 px-4 w-full max-w-fit"
    >
      <div className="group relative overflow-hidden rounded-full border border-primary/30 bg-background/80 p-1 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all hover:border-primary/50 hover:shadow-primary/20 dark:bg-card/80">
        <div className="flex items-center gap-1 sm:gap-2 pr-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:h-11 sm:w-11">
            <Calendar size={18} />
          </div>
          
          <div className="flex flex-col px-2 text-left sm:px-3">
             <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary/70">Reserve Your Sanctuary</span>
             <span className="font-serif text-[13px] text-foreground sm:text-sm">Check Availability</span>
          </div>

          <Button 
            asChild
            className="rounded-full bg-primary px-6 font-serif text-[11px] tracking-[0.15em] hover:bg-primary/90 sm:px-8 sm:text-xs"
          >
            <Link href="/rooms">BOOK NOW</Link>
          </Button>
        </div>
        
        {/* Animated border/glow effect */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
      </div>
    </motion.div>
  );
}
