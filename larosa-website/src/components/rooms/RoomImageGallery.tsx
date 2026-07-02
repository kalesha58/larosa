"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

type RoomImageGalleryProps = {
  images: string[];
  title: string;
  /** Skip leading images in the grid (e.g. 1 to omit the hero). */
  gridStartIndex?: number;
  className?: string;
};

export function RoomImageGallery({
  images,
  title,
  gridStartIndex = 1,
  className,
}: RoomImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const galleryImages = images.slice(gridStartIndex);
  const isOpen = activeIndex !== null;

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + images.length) % images.length);
    },
    [images.length]
  );

  const goPrev = useCallback(() => {
    if (activeIndex === null) return;
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  const goNext = useCallback(() => {
    if (activeIndex === null) return;
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, goPrev, goNext]);

  if (galleryImages.length === 0) return null;

  return (
    <>
      <div className={cn("grid grid-cols-2 gap-3 md:grid-cols-3", className)}>
        {galleryImages.map((img, i) => {
          const imageIndex = i + gridStartIndex;
          return (
            <button
              key={`${img}-${imageIndex}`}
              type="button"
              onClick={() => setActiveIndex(imageIndex)}
              className="group relative aspect-video overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label={`View ${title} photo ${imageIndex + 1}`}
            >
              <Image
                src={img}
                alt={`${title} ${imageIndex + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 300px"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {isOpen && activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={`${title} gallery preview`}
            onClick={() => setActiveIndex(null)}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/80 backdrop-blur-md transition-colors hover:border-white/40 hover:bg-black/60 hover:text-white"
              aria-label="Close gallery"
            >
              <X className="h-5 w-5" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white/80 backdrop-blur-md transition-colors hover:border-white hover:bg-white/10 hover:text-white md:left-6 md:h-12 md:w-12"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white/80 backdrop-blur-md transition-colors hover:border-white hover:bg-white/10 hover:text-white md:right-6 md:h-12 md:w-12"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </>
            )}

            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="relative h-full w-full max-h-[85vh] max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[activeIndex]}
                alt={`${title} ${activeIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>

            <p className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.35em] text-white/70">
              {activeIndex + 1} / {images.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
