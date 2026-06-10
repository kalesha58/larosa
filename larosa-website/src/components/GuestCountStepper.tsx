"use client";

import { useState } from "react";
import { Minus, Plus, Users, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  MIN_GUESTS,
  MAX_ONLINE_GUESTS,
  buildManagerWhatsAppUrl,
  clampGuestCount,
} from "@/lib/guest-limits";

export interface GuestCountStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  id?: string;
  /** Hero booking bar: flat corners, h-12 */
  variant?: "hero" | "default";
  className?: string;
}

function LargeGroupHelpContent({ max }: { max: number }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-foreground leading-relaxed">
        {max < MAX_ONLINE_GUESTS
          ? `This accommodation fits up to ${max} guests. For larger groups, contact our manager on WhatsApp.`
          : `For groups larger than ${MAX_ONLINE_GUESTS}, contact our manager on WhatsApp.`}
      </p>
      <Button type="button" variant="default" size="sm" className="w-full" asChild>
        <a
          href={buildManagerWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Message on WhatsApp
        </a>
      </Button>
    </div>
  );
}

export function GuestCountStepper({
  value,
  onChange,
  min = MIN_GUESTS,
  max = MAX_ONLINE_GUESTS,
  id,
  variant = "default",
  className,
}: GuestCountStepperProps) {
  const [helpOpen, setHelpOpen] = useState(false);
  const atMin = value <= min;
  const atMax = value >= max;
  const isHero = variant === "hero";

  const decrement = () => {
    setHelpOpen(false);
    onChange(clampGuestCount(value - 1, min, max));
  };

  const increment = () => {
    if (atMax) {
      setHelpOpen(true);
      return;
    }
    setHelpOpen(false);
    onChange(clampGuestCount(value + 1, min, max));
  };

  const guestLabel = value === 1 ? "Guest" : "Guests";

  return (
    <Popover open={helpOpen} onOpenChange={setHelpOpen}>
      <div className={cn("relative shrink-0", className)}>
        <PopoverAnchor asChild>
          <div
            className={cn(
              "flex items-center border bg-background/50",
              isHero
                ? "h-12 rounded-none border-border w-full md:w-[220px]"
                : "h-11 rounded-xl border-border/60 w-full"
            )}
            id={id}
          >
            <div className="flex flex-1 items-center gap-2 px-3 min-w-0">
              <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-sm tabular-nums truncate">
                {value} {guestLabel}
              </span>
            </div>
            <div className="flex shrink-0 border-l border-border/60">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-none hover:bg-muted/80",
                  isHero ? "h-12 w-10" : "h-11 w-10"
                )}
                onClick={decrement}
                disabled={atMin}
                aria-label="Decrease guests"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-none border-l border-border/60 hover:bg-muted/80",
                  isHero ? "h-12 w-10" : "h-11 w-10"
                )}
                onClick={increment}
                aria-label={
                  atMax ? "Contact manager for larger groups" : "Increase guests"
                }
                aria-expanded={atMax ? helpOpen : undefined}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </PopoverAnchor>

        <PopoverContent
          className={cn(
            "w-[min(100vw-2rem,20rem)] p-4 shadow-lg",
            isHero && "rounded-sm"
          )}
          side={isHero ? "top" : "bottom"}
          align="end"
          sideOffset={isHero ? 10 : 6}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Large group
          </p>
          <LargeGroupHelpContent max={max} />
        </PopoverContent>
      </div>
    </Popover>
  );
}
