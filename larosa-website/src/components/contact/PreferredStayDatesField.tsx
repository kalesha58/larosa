"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function stayRangeToPayload(range: DateRange | undefined): {
  checkIn?: string;
  checkOut?: string;
} {
  if (!range?.from || !range?.to) return {};
  return {
    checkIn: format(range.from, "yyyy-MM-dd"),
    checkOut: format(range.to, "yyyy-MM-dd"),
  };
}

type PreferredStayDatesFieldProps = {
  value: DateRange | undefined;
  onChange: (next: DateRange | undefined) => void;
  labelClassName: string;
  triggerClassName: string;
  description?: string;
  /** e.g. "home-preferred-stay" for aria */
  fieldId: string;
  numberOfMonths?: 1 | 2;
};

export function PreferredStayDatesField({
  value,
  onChange,
  labelClassName,
  triggerClassName,
  description,
  fieldId,
  numberOfMonths = 1,
}: PreferredStayDatesFieldProps) {
  const label = "Preferred stay dates";
  const startOfToday = new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <div className="space-y-2">
      <div>
        <label id={`${fieldId}-label`} className={labelClassName}>
          {label}
        </label>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            {description}
          </p>
        ) : null}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            id={fieldId}
            aria-labelledby={`${fieldId}-label`}
            className={cn(
              "h-12 w-full justify-start text-left font-normal text-foreground sm:h-11",
              !value?.from && "text-muted-foreground",
              triggerClassName
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-70" aria-hidden />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL d, y")} – {format(value.to, "LLL d, y")}
                </>
              ) : (
                format(value.from, "LLL d, y")
              )
            ) : (
              <span>Select check-in & check-out</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={numberOfMonths}
            disabled={(d) => d < startOfToday}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
