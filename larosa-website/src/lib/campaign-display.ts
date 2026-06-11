import { cn } from "@/lib/utils";
import type { CampaignClient } from "@/lib/campaign-api";

export function stripAccentClasses(accent: CampaignClient["accent"]) {
  switch (accent) {
    case "gold":
      return "bg-brand-navy text-white border-b border-brand-gold/40";
    case "navy":
      return "bg-brand-navy text-white border-b border-white/10";
    case "neutral":
    default:
      return "bg-primary text-primary-foreground border-b border-border/30";
  }
}

export function showcaseAccentClasses(accent: CampaignClient["accent"]) {
  switch (accent) {
    case "gold":
      return "border-brand-gold/30 bg-gradient-to-br from-brand-gold/10 via-card/90 to-card/80 shadow-[0_24px_60px_-20px_rgba(201,169,110,0.25)]";
    case "navy":
      return "border-brand-navy/40 bg-gradient-to-br from-brand-navy via-brand-navy/95 to-background text-white";
    case "neutral":
    default:
      return "border-border/50 bg-card/80 backdrop-blur-xl";
  }
}

export function showcaseTextClasses(accent: CampaignClient["accent"]) {
  if (accent === "navy") {
    return {
      headline: "text-white",
      message: "text-white/75",
    };
  }
  return {
    headline: "text-foreground",
    message: "text-muted-foreground",
  };
}

export function setStripHeight(px: number) {
  document.documentElement.style.setProperty("--campaign-strip-height", `${px}px`);
}

export function clearStripHeight() {
  document.documentElement.style.setProperty("--campaign-strip-height", "0px");
}
