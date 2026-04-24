"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Users } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock the availability hook for now
const useCheckAvailability = () => {
  return async () => ({ available: true });
};

export function BookingWidget({ className }: { className?: string }) {
  const router = useRouter();
  const [date, setDate] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState<string>("2");

  // const checkAvailability = useCheckAvailability();

  const handleCheck = () => {
    if (!date?.from || !date?.to) return;
    
    const params = new URLSearchParams();
    params.append("checkIn", date.from.toISOString());
    params.append("checkOut", date.to.toISOString());
    params.append("guests", guests);
    
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
        <Popover>
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

        <Select value={guests} onValueChange={setGuests}>
          <SelectTrigger className="w-full md:w-[200px] h-12 rounded-none bg-background/50 border-border">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Guests" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num} {num === 1 ? "Guest" : "Guests"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button 
        onClick={handleCheck}
        disabled={!date?.from || !date?.to}
        className="w-full md:w-auto h-12 px-8 rounded-none font-serif tracking-widest text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
      >
        CHECK AVAILABILITY
      </Button>
    </div>
  );
}
