"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight, X } from "lucide-react";
import { useGetCampaigns } from "@/hooks/use-queries";
import { cn } from "@/lib/utils";
import {
  clearStripHeight,
  setStripHeight,
  stripAccentClasses,
} from "@/lib/campaign-display";

function MarqueeTrack({
  headline,
  message,
  ctaLabel,
}: {
  headline: string;
  message?: string;
  ctaLabel?: string;
}) {
  const segment = (
    <span className="inline-flex shrink-0 items-center gap-6 px-8">
      <span className="font-bold uppercase tracking-[0.2em]">{headline}</span>
      {message ? (
        <>
          <span className="text-brand-gold" aria-hidden>
            ✦
          </span>
          <span className="font-normal normal-case tracking-normal opacity-90">
            {message}
          </span>
        </>
      ) : null}
      {ctaLabel ? (
        <>
          <span className="text-brand-gold" aria-hidden>
            ✦
          </span>
          <span className="inline-flex items-center gap-1 font-bold uppercase tracking-widest">
            {ctaLabel}
            <ChevronRight className="h-3 w-3" />
          </span>
        </>
      ) : null}
    </span>
  );

  return (
    <div className="flex w-max animate-campaign-marquee">
      {segment}
      {segment}
      {segment}
    </div>
  );
}

export function CampaignStrip() {
  const { data: campaigns, isLoading } = useGetCampaigns();
  const stripRef = useRef<HTMLDivElement>(null);
  const [dismissedForSession, setDismissedForSession] = useState(false);

  const activeStrip = campaigns?.find((c) => c.type === "strip");

  const isVisible = activeStrip && !dismissedForSession;

  useEffect(() => {
    if (!isVisible) {
      clearStripHeight();
      return;
    }

    const el = stripRef.current;
    if (!el) {
      clearStripHeight();
      return;
    }

    const update = () => setStripHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      ro.disconnect();
      clearStripHeight();
    };
  }, [isVisible, activeStrip?.id]);

  if (isLoading || !isVisible || !activeStrip) return null;

  const handleDismiss = () => {
    if (activeStrip.dismissible) {
      setDismissedForSession(true);
    }
  };

  return (
    <div
      ref={stripRef}
      role="region"
      aria-label="Site announcement"
      className={cn(
        "fixed top-[var(--navbar-height)] z-[55] w-full overflow-hidden shadow-md transition-[top] duration-300",
        stripAccentClasses(activeStrip.accent)
      )}
    >
      <div className="relative flex h-9 items-center sm:h-10">
        <div className="min-w-0 flex-1 overflow-hidden">
          {activeStrip.ctaUrl ? (
            <Link
              href={activeStrip.ctaUrl}
              className="block text-inherit hover:opacity-90"
            >
              <MarqueeTrack
                headline={activeStrip.headline}
                message={activeStrip.message}
                ctaLabel={activeStrip.ctaLabel}
              />
            </Link>
          ) : (
            <MarqueeTrack
              headline={activeStrip.headline}
              message={activeStrip.message}
              ctaLabel={activeStrip.ctaLabel}
            />
          )}
        </div>
        {activeStrip.dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss announcement"
            className="relative z-10 flex h-full shrink-0 items-center border-l border-white/15 px-3 opacity-80 transition-opacity hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
