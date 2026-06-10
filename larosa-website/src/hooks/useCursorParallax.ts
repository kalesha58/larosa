"use client";

import { useCallback, useEffect, useRef } from "react";

export type ParallaxOffset = { x: number; y: number };

const MAX_OFFSET_PX = 10;

export function useCursorParallax() {
  const offsetRef = useRef<ParallaxOffset>({ x: 0, y: 0 });
  const enabledRef = useRef(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (reducedMotion || coarsePointer) {
      enabledRef.current = false;
      return;
    }

    const handleMove = (e: MouseEvent) => {
      if (!enabledRef.current) return;
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      offsetRef.current = {
        x: nx * MAX_OFFSET_PX,
        y: ny * MAX_OFFSET_PX,
      };
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const getOffset = useCallback((): ParallaxOffset => {
    if (!enabledRef.current) return { x: 0, y: 0 };
    return offsetRef.current;
  }, []);

  return { getOffset };
}
