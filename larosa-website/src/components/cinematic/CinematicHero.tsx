"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookingWidget } from "@/components/BookingWidget";
import { useCursorParallax } from "@/hooks/useCursorParallax";
import { useScrollSequence } from "@/hooks/useScrollSequence";
import { cn } from "@/lib/utils";

type CinematicHeroProps = {
  onInteractiveChange?: (interactive: boolean) => void;
};

export function CinematicHero({ onInteractiveChange }: CinematicHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentOverlayRef = useRef<HTMLDivElement>(null);

  const { getOffset } = useCursorParallax();
  const {
    isInteractive,
    isFullyLoaded,
    loadProgress,
    firstFrameUrl,
  } = useScrollSequence({
    sectionRef,
    canvasRef,
    contentOverlayRef,
    getParallaxOffset: getOffset,
  });

  useEffect(() => {
    onInteractiveChange?.(isInteractive);
  }, [isInteractive, onInteractiveChange]);

  useEffect(() => {
    if (isInteractive) return;

    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    window.scrollTo(0, 0);

    return () => {
      html.style.overflow = previousOverflow;
    };
  }, [isInteractive]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[200vh] w-full"
      aria-label="Cinematic hero"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <Image
          src={firstFrameUrl}
          alt=""
          fill
          priority
          fetchPriority="high"
          className={cn(
            "object-cover transition-opacity duration-700 ease-out",
            isInteractive ? "opacity-0" : "opacity-100"
          )}
          sizes="100vw"
          aria-hidden
        />

        <canvas
          ref={canvasRef}
          className={cn(
            "absolute inset-0 z-[1] h-full w-full transition-opacity duration-700 ease-out",
            isInteractive ? "opacity-100" : "opacity-0"
          )}
          aria-hidden
        />

        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-black/50 via-black/20 to-black/60" />

        {!isInteractive && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px]">
            <div className="mb-4 h-px w-32 overflow-hidden bg-white/20">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${Math.max(loadProgress, 8)}%` }}
              />
            </div>
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/60">
              Preparing experience
              {!isFullyLoaded && loadProgress < 100 ? ` · ${loadProgress}%` : ""}
            </p>
          </div>
        )}

        <div
          ref={contentOverlayRef}
          className={cn(
            "relative z-10 flex h-full flex-col items-center justify-center px-4 sm:px-6 lg:px-10 transition-opacity duration-500",
            isInteractive ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="w-full max-w-[1320px]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={
                isInteractive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
              }
              transition={{ duration: 1, delay: 0.2 }}
            >
              <p className="mb-3 text-left text-[10px] font-medium uppercase tracking-[0.3em] text-white/80 sm:text-xs">
                Welcome to the extraordinary
              </p>
              <h1 className="mb-4 max-w-2xl text-left font-serif text-3xl leading-[1.2] text-white sm:text-4xl md:text-5xl lg:text-6xl">
                A Sanctuary of <br />
                <span className="italic text-white/90">Quiet Opulence</span>
              </h1>
              <p className="mb-8 max-w-xl text-left text-sm font-light leading-relaxed text-white/70 sm:text-base md:text-lg">
                Experience an unhurried, elevated stay where every detail is
                meticulously crafted for your absolute comfort.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={
                isInteractive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
              }
              transition={{ duration: 1, delay: 0.6 }}
              className="hidden w-full md:-mb-24 md:block"
            >
              <BookingWidget className="mx-0 max-w-3xl" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
