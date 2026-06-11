"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import {
  SEQUENCE_1,
  getAllSequence1Urls,
  sequence1FrameUrl,
} from "@/lib/scroll-sequence-config";
import type { ParallaxOffset } from "@/hooks/useCursorParallax";

const PRELOAD_BATCH_SIZE = 12;
const MIN_FRAMES_FOR_READY = 10;
const ZOOM_MAX = 0.06;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
  scale: number,
  offset: ParallaxOffset
) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = width / height;

  let drawWidth: number;
  let drawHeight: number;

  if (imgRatio > canvasRatio) {
    drawHeight = height * scale;
    drawWidth = drawHeight * imgRatio;
  } else {
    drawWidth = width * scale;
    drawHeight = drawWidth / imgRatio;
  }

  const x = (width - drawWidth) / 2 + offset.x;
  const y = (height - drawHeight) / 2 + offset.y;
  ctx.drawImage(img, x, y, drawWidth, drawHeight);
}

function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function getNearestLoadedImage(
  images: (HTMLImageElement | null)[],
  index: number
): HTMLImageElement | null {
  if (images[index]) return images[index];

  for (let offset = 1; offset < images.length; offset++) {
    const before = index - offset;
    const after = index + offset;
    if (before >= 0 && images[before]) return images[before];
    if (after < images.length && images[after]) return images[after];
  }

  return null;
}

async function preloadBatched(urls: string[]): Promise<(HTMLImageElement | null)[]> {
  const images: (HTMLImageElement | null)[] = new Array(urls.length).fill(null);

  for (let i = 0; i < urls.length; i += PRELOAD_BATCH_SIZE) {
    const batch = urls.slice(i, i + PRELOAD_BATCH_SIZE);
    const loaded = await Promise.all(
      batch.map((url, batchIndex) => loadImage(url).then((img) => {
        images[i + batchIndex] = img;
        return img;
      }))
    );
    void loaded;
  }

  return images;
}

type UseScrollSequenceOptions = {
  sectionRef: RefObject<HTMLElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  contentOverlayRef?: RefObject<HTMLElement | null>;
  getParallaxOffset?: () => ParallaxOffset;
  enabled?: boolean;
};

export function useScrollSequence({
  sectionRef,
  canvasRef,
  contentOverlayRef,
  getParallaxOffset,
  enabled = true,
}: UseScrollSequenceOptions) {
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const frameIndexRef = useRef(0);
  const progressRef = useRef(0);
  const hasPaintedRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const mobileRef = useRef(false);

  const [isReady, setIsReady] = useState(false);
  const [hasPainted, setHasPainted] = useState(false);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    mobileRef.current = window.matchMedia("(max-width: 768px)").matches;

    if (!enabled) return;

    let cancelled = false;
    const urls = getAllSequence1Urls();
    const criticalIndices = new Set([
      ...Array.from({ length: MIN_FRAMES_FOR_READY }, (_, i) => i),
      SEQUENCE_1.frameCount - 1,
    ]);

    const loadCriticalFirst = async () => {
      imagesRef.current = new Array(urls.length).fill(null);

      const firstFrame = await loadImage(urls[0]);
      if (cancelled) return;
      if (firstFrame) {
        imagesRef.current[0] = firstFrame;
      }

      const remainingCritical = Array.from(criticalIndices).filter((i) => i !== 0);
      const criticalImages = await Promise.all(
        remainingCritical.map((index) => loadImage(urls[index]))
      );
      if (cancelled) return;

      remainingCritical.forEach((index, i) => {
        imagesRef.current[index] = criticalImages[i];
      });

      setIsReady(true);
      setLoadProgress(
        Math.round((criticalIndices.size / urls.length) * 100)
      );
    };

    const loadAll = async () => {
      await loadCriticalFirst();
      if (cancelled) return;

      const allImages = await preloadBatched(urls);
      if (cancelled) return;

      imagesRef.current = allImages;
      setIsFullyLoaded(true);
      setLoadProgress(100);
    };

    void loadAll();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !isReady) return;

    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    const getScrollProgress = () => {
      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return 0;
      return clamp((window.scrollY - sectionTop) / scrollable, 0, 1);
    };

    const mapProgressToFrameIndex = (progress: number) => {
      const maxIndex = SEQUENCE_1.frameCount - 1;
      if (mobileRef.current) {
        const stepped = Math.floor(progress * (maxIndex / 2));
        return clamp(stepped * 2, 0, maxIndex);
      }
      return clamp(Math.floor(progress * maxIndex), 0, maxIndex);
    };

    const drawFrame = (index: number, progress: number) => {
      const images = imagesRef.current;
      const img = getNearestLoadedImage(images, index);
      if (!img) return;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const parallax = getParallaxOffset?.() ?? { x: 0, y: 0 };
      const scale = 1 + progress * ZOOM_MAX;

      ctx.clearRect(0, 0, width, height);
      drawCoverImage(ctx, img, width, height, scale, parallax);

      if (!hasPaintedRef.current) {
        hasPaintedRef.current = true;
        setHasPainted(true);
      }
    };

    const updateOverlays = (progress: number) => {
      const contentEl = contentOverlayRef?.current;
      if (contentEl) {
        const contentOpacity =
          progress > 0.92 ? clamp(1 - (progress - 0.92) / 0.08, 0, 1) : 1;
        contentEl.style.opacity = String(contentOpacity);
      }
    };

    let rafId = 0;
    let lastDrawnProgress = -1;

    const tick = () => {
      const progress = reducedMotionRef.current ? 0 : getScrollProgress();
      progressRef.current = progress;

      const frameIndex = reducedMotionRef.current
        ? 0
        : mapProgressToFrameIndex(progress);

      const shouldRedraw =
        frameIndex !== frameIndexRef.current ||
        Math.abs(progress - lastDrawnProgress) > 0.002;

      if (shouldRedraw) {
        frameIndexRef.current = frameIndex;
        lastDrawnProgress = progress;
        drawFrame(frameIndex, progress);
      }

      updateOverlays(progress);
      rafId = requestAnimationFrame(tick);
    };

    drawFrame(0, 0);
    updateOverlays(0);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [
    enabled,
    isReady,
    sectionRef,
    canvasRef,
    contentOverlayRef,
    getParallaxOffset,
  ]);

  return {
    isReady,
    hasPainted,
    isInteractive: isReady && hasPainted,
    isFullyLoaded,
    loadProgress,
    progressRef,
    firstFrameUrl: sequence1FrameUrl(0),
  };
}
