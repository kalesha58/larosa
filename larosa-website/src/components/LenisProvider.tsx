"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";

type LenisProviderProps = {
  children: ReactNode;
  scrollEnabled?: boolean;
};

export function LenisProvider({
  children,
  scrollEnabled = true,
}: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    if (!scrollEnabled) {
      lenis.stop();
    }

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    if (scrollEnabled) {
      lenis.start();
    } else {
      lenis.stop();
      window.scrollTo(0, 0);
    }
  }, [scrollEnabled]);

  return <>{children}</>;
}
