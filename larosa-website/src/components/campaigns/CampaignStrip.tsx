"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight, X } from "lucide-react";
import { useGetCampaigns } from "@/hooks/use-queries";
import { cn } from "@/lib/utils";
import {
  clearStripHeight,
  dismissCampaign,
  dismissStorageKey,
  isCampaignDismissed,
  setStripHeight,
  stripAccentClasses,
} from "@/lib/campaign-display";

export function CampaignStrip() {
  const { data: campaigns } = useGetCampaigns();
  const stripRef = useRef<HTMLDivElement>(null);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = new Set<string>();
    campaigns?.forEach((c) => {
      if (c.type === "strip" && isCampaignDismissed(c.id)) {
        stored.add(c.id);
      }
    });
    setDismissedIds(stored);
  }, [campaigns]);

  const activeStrip = campaigns?.find((c) => c.type === "strip" && !dismissedIds.has(c.id));

  useEffect(() => {
    if (!activeStrip) {
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
  }, [activeStrip, dismissedIds]);

  if (!mounted || !activeStrip) return null;

  const handleDismiss = () => {
    if (activeStrip.dismissible) {
      dismissCampaign(activeStrip.id);
      setDismissedIds((prev) => new Set(prev).add(activeStrip.id));
    }
  };

  return (
    <div
      ref={stripRef}
      role="region"
      aria-label="Site announcement"
      className={cn(
        "fixed top-0 z-[70] w-full",
        stripAccentClasses(activeStrip.accent)
      )}
    >
      <div className="container mx-auto flex max-w-[1400px] items-center justify-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <p className="min-w-0 flex-1 text-center text-[10px] font-bold uppercase tracking-[0.2em] sm:text-[11px] sm:tracking-[0.25em]">
          <span>{activeStrip.headline}</span>
          {activeStrip.message && (
            <span className="hidden font-normal normal-case tracking-normal text-white/80 sm:ml-2 sm:inline">
              — {activeStrip.message}
            </span>
          )}
        </p>
        {activeStrip.ctaUrl && activeStrip.ctaLabel && (
          <Link
            href={activeStrip.ctaUrl}
            className="hidden shrink-0 items-center gap-1 text-[10px] font-bold uppercase tracking-widest underline-offset-4 hover:underline sm:flex"
          >
            {activeStrip.ctaLabel}
            <ChevronRight className="h-3 w-3" />
          </Link>
        )}
        {activeStrip.dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss announcement"
            className="shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// Re-export for tests / hydration check
export { dismissStorageKey };
