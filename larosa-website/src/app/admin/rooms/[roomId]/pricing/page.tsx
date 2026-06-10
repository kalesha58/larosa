"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateClickArg } from "@fullcalendar/interaction";
import type { DatesSetArg, DayCellContentArg } from "@fullcalendar/core";
import "@/styles/admin-fullcalendar.css";
import {
  useGetAdminRoomPricing,
  useGetRooms,
  useUpdateAdminRoomDay,
  type AdminPricingDay,
} from "@/hooks/use-queries";
import { bookingsToFullCalendarEvents } from "@/lib/booking-calendar-events";
import type { AdminCalendarBooking } from "@/lib/booking-calendar-events";
import { formatCompactInr, formatInr } from "@/lib/format-price";
import { formatPropertyDate, formatPropertyDateLabel } from "@/lib/property-dates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminRoomPricingPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId: roomIdStr } = use(params);
  const roomId = parseInt(roomIdStr, 10);
  const { toast } = useToast();

  const { data: rooms } = useGetRooms();
  const roomMeta = rooms?.find((r) => Number(r.id) === roomId);

  const [visibleRange, setVisibleRange] = useState<{
    from: string;
    to: string;
  } | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [panelPrice, setPanelPrice] = useState("");
  const [panelAvailable, setPanelAvailable] = useState(true);

  const { data, isLoading, isFetching } = useGetAdminRoomPricing(
    roomId,
    visibleRange
  );
  const updateDay = useUpdateAdminRoomDay(roomId);

  const dayMap = useMemo(() => {
    const map = new Map<string, AdminPricingDay>();
    for (const d of data?.days ?? []) {
      map.set(d.date, d);
    }
    return map;
  }, [data?.days]);

  const selectedDay = selectedDate ? dayMap.get(selectedDate) : undefined;

  useEffect(() => {
    if (!selectedDate || !data) return;
    const day = dayMap.get(selectedDate);
    if (!day) {
      setPanelAvailable(true);
      setPanelPrice(String(data.basePrice));
      return;
    }
    setPanelAvailable(!day.blocked);
    setPanelPrice(String(day.effectivePrice));
  }, [selectedDate, selectedDay, data, dayMap]);

  const handleDatesSet = useCallback((arg: DatesSetArg) => {
    setVisibleRange({
      from: formatPropertyDate(arg.start),
      to: formatPropertyDate(arg.end),
    });
  }, []);

  const events = useMemo(
    () => bookingsToFullCalendarEvents((data?.bookings ?? []) as AdminCalendarBooking[]),
    [data?.bookings]
  );

  const handleDateClick = useCallback((info: DateClickArg) => {
    setSelectedDate(formatPropertyDate(info.date));
  }, []);

  const dayCellClassNames = useCallback(
    (arg: { date: Date }) => {
      const ymd = formatPropertyDate(arg.date);
      const day = dayMap.get(ymd);
      const classes: string[] = [];
      if (selectedDate === ymd) classes.push("fc-day-selected");
      if (day?.reserved) classes.push("fc-day-reserved");
      if (day?.blocked) classes.push("fc-day-blocked");
      return classes;
    },
    [dayMap, selectedDate]
  );

  const dayCellContent = useCallback(
    (arg: DayCellContentArg) => {
      const ymd = formatPropertyDate(arg.date);
      const day = dayMap.get(ymd);
      const price = day?.effectivePrice ?? data?.basePrice ?? 0;
      return (
        <div className="fc-day-pricing-cell">
          <span className="text-[0.65rem] text-muted-foreground">{arg.dayNumberText}</span>
          <span
            className={cn(
              "fc-day-pricing-price",
              day?.hasCustomPrice && "fc-day-pricing-price--custom",
              day?.blocked && "fc-day-pricing-price--blocked"
            )}
          >
            {formatCompactInr(price)}
          </span>
          {day?.reserved ? (
            <span className="fc-day-pricing-badge">Reserved</span>
          ) : day?.blocked ? (
            <span className="fc-day-pricing-badge">Blocked</span>
          ) : day?.hasCustomPrice ? (
            <span className="fc-day-pricing-badge text-primary">Custom</span>
          ) : null}
        </div>
      );
    },
    [dayMap, data?.basePrice]
  );

  const saveDay = async (
    mode: "availability" | "price",
    opts?: { blocked?: boolean; resetToBase?: boolean }
  ) => {
    if (!selectedDate || !data) return;
    const day = dayMap.get(selectedDate);
    if (day?.reserved) {
      toast({
        title: "Reserved",
        description: "This night is booked and cannot be changed here.",
        variant: "destructive",
      });
      return;
    }

    const body: { date: string; price?: number | null; blocked?: boolean } = {
      date: selectedDate,
    };

    if (mode === "availability") {
      body.blocked = opts?.blocked ?? !panelAvailable;
    } else {
      body.blocked = !panelAvailable;
      if (opts?.resetToBase) {
        body.price = null;
      } else {
        const parsed = parseInt(panelPrice, 10);
        if (isNaN(parsed) || parsed < 1) {
          toast({
            title: "Invalid price",
            description: "Enter a valid nightly price (minimum ₹1).",
            variant: "destructive",
          });
          return;
        }
        body.price = parsed === data.basePrice ? null : parsed;
      }
    }

    try {
      await updateDay.mutateAsync(body);
      toast({ title: "Changes saved" });
    } catch (e) {
      toast({
        title: "Could not save",
        description: e instanceof Error ? e.message : "Try again",
        variant: "destructive",
      });
    }
  };

  const panelEditable =
    !selectedDay?.reserved && panelAvailable;
  const usingBasePrice =
    selectedDay != null &&
    !selectedDay.hasCustomPrice &&
    parseInt(panelPrice, 10) === data?.basePrice;

  if (isNaN(roomId) || roomId <= 0) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Invalid villa id.</p>
        <Link href="/admin/rooms" className="text-primary underline text-sm mt-4 inline-block">
          Back to villas
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/50 shrink-0">
        <div>
          <Link
            href="/admin/rooms"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary mb-3"
          >
            <ArrowLeft className="h-3 w-3" />
            Villa catalog
          </Link>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60 mb-2">
            Pricing
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-foreground">
            {data?.roomTitle ?? roomMeta?.title ?? `Villa ${roomId}`}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Default:{" "}
            <span className="font-semibold text-foreground">
              {formatInr(data?.basePrice ?? roomMeta?.price ?? 0)}
            </span>{" "}
            / night — edit base rate in{" "}
            <Link href="/admin/rooms" className="text-primary underline">
              villa settings
            </Link>
            .
          </p>
        </div>
        {(isLoading || isFetching) && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            Updating…
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col lg:flex-row gap-6 mt-6 min-h-0">
        <div className="flex-1 min-w-0 admin-fullcalendar admin-pricing-calendar rounded-2xl border border-border bg-card/30 p-4">
          {isLoading && !data ? (
            <Skeleton className="h-[520px] w-full rounded-xl" />
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "",
              }}
              height="auto"
              fixedWeekCount={false}
              events={events}
              eventDisplay="block"
              dateClick={handleDateClick}
              datesSet={handleDatesSet}
              dayCellClassNames={dayCellClassNames}
              dayCellContent={dayCellContent}
            />
          )}
        </div>

        <aside className="w-full lg:w-[min(100%,320px)] shrink-0 lg:sticky lg:top-6 self-start rounded-2xl border border-border bg-card p-6 space-y-6">
          {!selectedDate ? (
            <p className="text-sm text-muted-foreground">
              Select a day on the calendar to set price or availability.
            </p>
          ) : (
            <>
              <div>
                <h2 className="font-serif text-xl">
                  {formatPropertyDateLabel(selectedDate)}
                </h2>
                {selectedDay?.reserved ? (
                  <p className="text-xs text-destructive mt-1 font-medium">
                    Reserved — pricing and availability are locked.
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="available" className="text-sm font-medium">
                  Available
                </Label>
                <Switch
                  id="available"
                  checked={panelAvailable}
                  disabled={selectedDay?.reserved ?? false}
                  onCheckedChange={(checked) => {
                    setPanelAvailable(checked);
                    void saveDay("availability", { blocked: !checked });
                  }}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="night-price" className="text-sm font-medium">
                  Price per night
                </Label>
                {!panelAvailable ? (
                  <p className="text-xs text-muted-foreground">
                    Turn on Available to set a custom price for this day.
                  </p>
                ) : usingBasePrice ? (
                  <p className="text-xs text-muted-foreground">
                    Using villa base rate. Enter a different amount below to
                    override this day.
                  </p>
                ) : selectedDay?.hasCustomPrice ? (
                  <p className="text-xs text-primary font-medium">
                    Custom price for this day
                  </p>
                ) : null}
                <Input
                  id="night-price"
                  type="number"
                  min={1}
                  disabled={!panelEditable}
                  value={panelPrice}
                  onChange={(e) => setPanelPrice(e.target.value)}
                  className="text-lg font-serif h-12"
                />
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!panelEditable || usingBasePrice}
                    className={cn(
                      "text-xs justify-start",
                      usingBasePrice && "border-primary bg-primary/5"
                    )}
                    onClick={() => {
                      setPanelPrice(String(data?.basePrice ?? 0));
                      void saveDay("price", { resetToBase: true });
                    }}
                  >
                    Use base price ({formatInr(data?.basePrice ?? 0)})
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={!panelEditable || updateDay.isPending}
                    onClick={() => void saveDay("price")}
                  >
                    {updateDay.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save price"
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
