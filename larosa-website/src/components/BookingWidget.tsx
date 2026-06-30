"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GuestCountStepper } from "@/components/GuestCountStepper";
import { MAX_ONLINE_GUESTS } from "@/lib/guest-limits";

export function BookingWidget({ className }: { className?: string }) {
  const router = useRouter();
  const [date, setDate] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    if (!isPopoverOpen) return;
    
    const handleScroll = () => {
      setIsPopoverOpen(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isPopoverOpen]);

  const handleCheck = () => {
    if (!date?.from || !date?.to) return;

    const params = new URLSearchParams();
    params.append("checkIn", date.from.toISOString());
    params.append("checkOut", date.to.toISOString());
    params.append("guests", String(guests));

    router.push(`/rooms?${params.toString()}`);
  };

  return (
    <div
      className={cn(
        "bg-card/90 backdrop-blur-xl border border-border p-4 shadow-2xl w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-4",
        className
      )}
    >
      <div className="flex-1 w-full flex flex-col md:flex-row gap-4">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal bg-background/50 border-border h-12 rounded-none",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Check-in - Check-out</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </PopoverContent>
        </Popover>

        <GuestCountStepper
          id="hero-guests"
          variant="hero"
          value={guests}
          onChange={setGuests}
          max={MAX_ONLINE_GUESTS}
        />
      </div>

      <Button
        onClick={handleCheck}
        disabled={!date?.from || !date?.to || guests > MAX_ONLINE_GUESTS}
        className="w-full md:w-auto h-12 px-8 rounded-none font-serif tracking-widest text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
      >
        CHECK AVAILABILITY
      </Button>
    </div>
  );
}
