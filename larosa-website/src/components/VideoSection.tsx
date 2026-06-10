"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const VIDEO_SRC = "/larosa.mp4";

const headerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const headerItem = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    if (isPlaying) {
      hideControlsTimer.current = setTimeout(() => setShowControls(false), 3200);
    }
  }, [isPlaying]);

  const togglePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      await video.play();
      setIsPlaying(true);
      resetHideTimer();
    } else {
      video.pause();
      setIsPlaying(false);
      setShowControls(true);
    }
  }, [resetHideTimer]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const frame = frameRef.current;
    if (!frame) return;
    if (!document.fullscreenElement) {
      await frame.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const video = videoRef.current;
      const bar = e.currentTarget;
      if (!video || !duration) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      video.currentTime = ratio * duration;
      setProgress(ratio * 100);
      setCurrentTime(video.currentTime);
    },
    [duration]
  );

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };
    const onLoadedMetadata = () => {
      setDuration(video.duration);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setShowControls(true);
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    };
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          void video.play().then(() => {
            setIsPlaying(true);
            resetHideTimer();
          });
        } else if (!video.paused) {
          video.pause();
          setIsPlaying(false);
          setShowControls(true);
        }
      },
      { threshold: 0.35, rootMargin: "-40px 0px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [shouldReduceMotion, resetHideTimer]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative overflow-hidden py-20 sm:py-28 lg:py-32"
      aria-labelledby="video-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--section-warm)/0.35)_50%,hsl(var(--background))_100%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute left-1/2 top-0 h-[50%] w-[80%] -translate-x-1/2 rounded-full bg-primary/[0.04] blur-[100px]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-16 lg:items-end">
          <motion.div
            className="lg:col-span-4 xl:col-span-4"
            variants={shouldReduceMotion ? undefined : headerContainer}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "show"}
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.span
              variants={shouldReduceMotion ? undefined : headerItem}
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.35em] text-primary"
            >
              <span className="h-px w-8 bg-primary/40" aria-hidden />
              A Visual Journey
            </motion.span>
            <motion.h2
              id="video-heading"
              variants={shouldReduceMotion ? undefined : headerItem}
              className="mt-5 font-serif text-4xl leading-[1.08] text-foreground sm:text-5xl xl:text-6xl"
            >
              Immerse in{" "}
              <span className="italic text-primary/90">Tranquility</span>
            </motion.h2>
            <motion.p
              variants={shouldReduceMotion ? undefined : headerItem}
              className="mt-5 max-w-md text-base font-light leading-relaxed text-muted-foreground sm:text-lg"
            >
              Experience the architecture and serene atmosphere of LaRosa Villas
              before you arrive — a sanctuary designed to harmonize with nature.
            </motion.p>
            <motion.p
              variants={shouldReduceMotion ? undefined : headerItem}
              className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground"
            >
              {isPlaying
                ? "Now playing"
                : shouldReduceMotion
                  ? "Tap play to begin"
                  : "Scroll to play"} · Sound available
            </motion.p>
          </motion.div>

          <motion.div
            className="lg:col-span-8 xl:col-span-8"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1, ease: EASE }}
          >
            <div
              ref={frameRef}
              className={cn(
                "group relative overflow-hidden rounded-2xl sm:rounded-[1.75rem]",
                "bg-zinc-950 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.45)]",
                "ring-1 ring-border/60",
                isFullscreen && "rounded-none ring-0"
              )}
              onMouseMove={resetHideTimer}
              onMouseLeave={() => isPlaying && setShowControls(true)}
            >
              {/* Cinematic letterbox frame */}
              <div className="relative aspect-[16/10] w-full sm:aspect-video">
                <video
                  ref={videoRef}
                  src={VIDEO_SRC}
                  muted
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-cover"
                  onClick={togglePlay}
                  aria-label="LaRosa Villas property film"
                />

                {/* Vignette + top fade */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/25"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10"
                  aria-hidden
                />

                {/* Center play — when paused */}
                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    void togglePlay();
                  }}
                  className={cn(
                    "absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center",
                    "h-16 w-16 rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md",
                    "transition-all duration-300 hover:scale-105 hover:bg-white/20",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                    isPlaying && "pointer-events-none scale-90 opacity-0"
                  )}
                  aria-label="Play video"
                >
                  <Play className="ml-1 h-7 w-7 fill-white" strokeWidth={1.5} />
                </motion.button>

                {/* Control bar */}
                <div
                  className={cn(
                    "absolute inset-x-0 bottom-0 z-20 p-4 sm:p-5",
                    "bg-gradient-to-t from-black/85 via-black/50 to-transparent",
                    "transition-opacity duration-300",
                    isPlaying && !showControls && "opacity-0 pointer-events-none"
                  )}
                >
                  <div
                    role="slider"
                    aria-label="Video progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(progress)}
                    tabIndex={0}
                    className="group/progress mb-3 h-1 w-full cursor-pointer rounded-full bg-white/20"
                    onClick={handleSeek}
                    onKeyDown={(e) => {
                      const video = videoRef.current;
                      if (!video || !duration) return;
                      if (e.key === "ArrowRight") {
                        video.currentTime = Math.min(duration, video.currentTime + 5);
                      }
                      if (e.key === "ArrowLeft") {
                        video.currentTime = Math.max(0, video.currentTime - 5);
                      }
                    }}
                  >
                    <div
                      className="relative h-full rounded-full bg-primary transition-[width] duration-150"
                      style={{ width: `${progress}%` }}
                    >
                      <span className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary opacity-0 shadow-md transition-opacity group-hover/progress:opacity-100" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => void togglePlay()}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                        aria-label={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4" fill="currentColor" />
                        ) : (
                          <Play className="h-4 w-4 ml-0.5" fill="currentColor" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={toggleMute}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                        aria-label={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </button>
                      <span className="hidden text-[10px] font-medium tabular-nums tracking-wider text-white/70 sm:inline">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <p className="hidden font-serif text-xs italic tracking-wide text-white/80 sm:block">
                      LaRosa Villas
                    </p>

                    <button
                      type="button"
                      onClick={() => void toggleFullscreen()}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                      aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                    >
                      {isFullscreen ? (
                        <Minimize2 className="h-4 w-4" />
                      ) : (
                        <Maximize2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground lg:text-left">
              Cinematic property film · Best experienced with sound on
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
