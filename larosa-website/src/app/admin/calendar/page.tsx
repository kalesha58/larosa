"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { EventClickArg } from "@fullcalendar/core";
import "@/styles/admin-fullcalendar.css";
import { useGetRooms, useGetAdminRoomCalendar, useCancelBooking } from "@/hooks/use-queries";
import {
  bookingsToFullCalendarEvents,
  CALENDAR_COLORS,
} from "@/lib/booking-calendar-events";
import {
  airbnbDisplayTitle,
  classifyAirbnbSummary,
  type AirbnbEventKind,
} from "@/lib/airbnb-event-label";
import { RoomSyncButton } from "@/components/admin/RoomSyncButton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, CalendarRange, XCircle } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  blockedNightsBetween,
  formatPropertyDateLabel,
  fullCalendarAllDayToYmd,
  parsePropertyYmd,
  propertyMonthYearLabel,
} from "@/lib/property-dates";
import type { Room } from "@/hooks/use-queries";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { cn } from "@/lib/utils";
import { statusStyles } from "@/lib/admin-status-styles";

function normalizeRoomId(room: Room): number | null {
  const n = Number(room.id);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export default function AdminCalendarPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const cancelBooking = useCancelBooking();
  const roomIdFromUrl = searchParams.get("roomId");
  const {
    data: rooms,
    isLoading: roomsLoading,
    isError: roomsError,
    refetch: refetchRooms,
  } = useGetRooms();

  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const roomOptions = useMemo(() => {
    if (!rooms?.length) return [];
    const seen = new Set<number>();
    const list: { id: number; title: string; room: Room }[] = [];
    for (const room of rooms) {
      const id = normalizeRoomId(room);
      if (id == null || seen.has(id)) continue;
      seen.add(id);
      list.push({ id, title: room.title, room });
    }
    return list.sort((a, b) => a.id - b.id);
  }, [rooms]);

  useEffect(() => {
    if (roomOptions.length === 0) return;

    setSelectedRoomId((current) => {
      if (current != null && roomOptions.some((r) => r.id === current)) {
        return current;
      }
      if (roomIdFromUrl) {
        const fromUrl = parseInt(roomIdFromUrl, 10);
        if (
          !isNaN(fromUrl) &&
          roomOptions.some((r) => r.id === fromUrl)
        ) {
          return fromUrl;
        }
      }
      return roomOptions[0].id;
    });
  }, [roomOptions, roomIdFromUrl]);

  const effectiveRoomId = useMemo(() => {
    if (selectedRoomId != null && selectedRoomId > 0) return selectedRoomId;
    if (roomIdFromUrl) {
      const fromUrl = parseInt(roomIdFromUrl, 10);
      if (
        !isNaN(fromUrl) &&
        roomOptions.some((r) => r.id === fromUrl)
      ) {
        return fromUrl;
      }
    }
    return roomOptions[0]?.id ?? 0;
  }, [selectedRoomId, roomIdFromUrl, roomOptions]);

  const { data: bookings = [], isLoading: calendarLoading } =
    useGetAdminRoomCalendar(effectiveRoomId, {
      enabled: effectiveRoomId > 0,
    });

  const events = useMemo(
    () => bookingsToFullCalendarEvents(bookings),
    [bookings]
  );

  const selectedRoom = roomOptions.find((r) => r.id === effectiveRoomId)?.room;

  const bookingCounts = useMemo(() => {
    let websiteConfirmed = 0;
    let websitePending = 0;
    let airbnbBooking = 0;
    let airbnbBlocked = 0;
    let airbnbOther = 0;
    for (const b of bookings) {
      if (b.source === "website") {
        if (b.status === "pending") websitePending++;
        else websiteConfirmed++;
        continue;
      }
      const kind = b.airbnbKind ?? classifyAirbnbSummary(b.guestName);
      switch (kind) {
        case "booking":
          airbnbBooking++;
          break;
        case "blocked":
          airbnbBlocked++;
          break;
        default:
          airbnbOther++;
          break;
      }
    }
    return {
      websiteConfirmed,
      websitePending,
      airbnbBooking,
      airbnbBlocked,
      airbnbOther,
    };
  }, [bookings]);

  const hasIcalUrl = Boolean(selectedRoom?.airbnbIcalUrl?.trim());

  const calendarRef = useRef<FullCalendar>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [cancelRefundError, setCancelRefundError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<{
    title: string;
    source: string;
    status: string;
    checkIn: string;
    checkOut: string;
    id: string;
    guestName?: string;
    airbnbKind?: AirbnbEventKind;
  } | null>(null);

  const handleEventClick = useCallback((info: EventClickArg) => {
    const props = info.event.extendedProps as {
      bookingId?: string;
      source?: string;
      status?: string;
      checkIn?: string;
      checkOut?: string;
      guestName?: string;
      displayTitle?: string;
      airbnbKind?: AirbnbEventKind;
    };

    const checkIn =
      parsePropertyYmd(props.checkIn) ??
      (info.event.start ? fullCalendarAllDayToYmd(info.event.start) : "");
    const checkOut =
      parsePropertyYmd(props.checkOut) ??
      (info.event.end ? fullCalendarAllDayToYmd(info.event.end) : checkIn);

    if (checkIn && calendarRef.current) {
      calendarRef.current.getApi().gotoDate(checkIn);
    }

    setSelectedEvent({
      id: props.bookingId ?? info.event.id,
      title: props.displayTitle ?? info.event.title,
      source: props.source ?? "website",
      status: props.status ?? "",
      checkIn,
      checkOut,
      guestName: props.guestName,
      airbnbKind: props.airbnbKind,
    });
    setDetailOpen(true);
  }, []);

  const handleCancelFromCalendar = async (skipRefund = false) => {
    if (!selectedEvent) return;
    try {
      const result = await cancelBooking.mutateAsync({
        id: selectedEvent.id,
        skipRefund,
      });
      setCancelConfirmOpen(false);
      setCancelRefundError(null);
      setDetailOpen(false);
      setSelectedEvent(null);
      toast({
        title: "Booking cancelled",
        description: result.refunded
          ? `Full refund issued${result.refundId ? ` (${result.refundId})` : ""}.`
          : result.refundPending
            ? "Process the refund manually from your Razorpay dashboard."
            : "Reservation cancelled.",
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to cancel booking";
      if (!skipRefund && selectedEvent.status === "confirmed") {
        setCancelRefundError(msg);
      }
      toast({ variant: "destructive", title: "Cancellation failed", description: msg });
    }
  };

  const isPaidConfirmedEvent =
    selectedEvent?.source === "website" && selectedEvent.status === "confirmed";

  const canCancelSelectedEvent =
    selectedEvent?.source === "website" &&
    selectedEvent.status !== "cancelled";

  if (roomsLoading) {
    return (
      <div className="space-y-10">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-[480px] w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60 mb-2">
            Availability
          </p>
          <h1 className="font-serif text-4xl text-foreground">Villa Calendar</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl">
            Bookable villas live in MongoDB (Admin → Villas), not the marketing /villas page.
            One Airbnb listing = one villa + one .ics URL. Checkout day is exclusive (not blocked).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {roomsError ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => void refetchRooms()}
            >
              Retry loading villas
            </Button>
          ) : roomOptions.length === 0 ? (
            <Link href="/admin/rooms" className="text-xs text-primary underline">
              Open Villas to seed catalog
            </Link>
          ) : (
            <Select
              value={String(effectiveRoomId)}
              onValueChange={(v) => setSelectedRoomId(parseInt(v, 10))}
            >
              <SelectTrigger className="w-[min(100%,280px)] rounded-xl h-10 text-xs">
                <SelectValue placeholder="Select villa" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {roomOptions.map((room) => (
                    <SelectItem
                      key={`room-${room.id}`}
                      value={String(room.id)}
                    >
                      {room.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          {effectiveRoomId > 0 ? (
            <RoomSyncButton roomId={effectiveRoomId} />
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: CALENDAR_COLORS.airbnbBooking }}
            />
            Airbnb booking
          </div>
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: CALENDAR_COLORS.airbnbBlocked }}
            />
            Blocked
          </div>
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: CALENDAR_COLORS.airbnbOther }}
            />
            Unavailable (Airbnb)
          </div>
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: CALENDAR_COLORS.website }}
            />
            Website confirmed
          </div>
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: CALENDAR_COLORS.websitePending }}
            />
            Website pending
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground normal-case tracking-normal font-normal max-w-2xl">
          Airbnb booking and blocked dates are not bookable on your site. Confirmed
          website bookings appear in blue; unpaid holds (30 min) appear in yellow.
        </p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {effectiveRoomId > 0 && !calendarLoading ? (
            <span className="font-mono text-[10px] uppercase tracking-widest">
              Loaded: {bookingCounts.airbnbBooking + bookingCounts.airbnbBlocked + bookingCounts.airbnbOther}{" "}
              Airbnb · {bookingCounts.websiteConfirmed} confirmed ·{" "}
              {bookingCounts.websitePending} pending
            </span>
          ) : null}
          {selectedRoom && !hasIcalUrl ? (
            <span className={cn(statusStyles.warning.text, "ml-auto max-w-md text-right opacity-90")}>
              Paste the Airbnb .ics URL on this villa in Admin → Villas, then Sync Airbnb.
            </span>
          ) : selectedRoom?.lastSyncedAt ? (
            <span className="ml-auto">
              Last Airbnb sync:{" "}
              {format(new Date(selectedRoom.lastSyncedAt), "MMM d, yyyy HH:mm")}
            </span>
          ) : null}
        </div>
      </div>

      <div className="bg-card border border-border shadow-2xl rounded-2xl overflow-hidden p-4 md:p-6 admin-fullcalendar">
        {calendarLoading ? (
          <div className="flex h-[480px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : effectiveRoomId <= 0 ? (
          <AdminEmptyState
            icon={CalendarRange}
            title={roomOptions.length === 0 ? "No villas yet" : "Select a villa"}
            description={
              roomOptions.length === 0
                ? "Set MONGODB_URI and open Admin → Villas, or run npm run db:seed. Garden Retreat & Ocean View seed automatically."
                : "Choose a villa from the dropdown above."
            }
            actionLabel={roomOptions.length === 0 ? "Go to Villas" : undefined}
            actionHref={roomOptions.length === 0 ? "/admin/rooms" : undefined}
            className="min-h-[480px]"
          />
        ) : (
          <div className="relative">
            {!calendarLoading && events.length === 0 ? (
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <div className="bg-card/90 border border-border rounded-xl px-6 py-4 max-w-md text-center shadow-sm">
                  <p className="text-sm font-medium text-foreground mb-1">
                    No events on this calendar
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {hasIcalUrl
                      ? "No events in the current date window. Click Sync Airbnb or check Admin → Sync logs. Website bookings show in blue after payment confirms."
                      : "Paste the Airbnb .ics URL for this villa in Admin → Villas, save, then Sync Airbnb."}
                  </p>
                </div>
              </div>
            ) : null}
            {calendarLoading ? (
              <div className="flex h-[480px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,dayGridWeek",
                }}
                height="auto"
                events={events}
                eventClick={handleEventClick}
                fixedWeekCount={false}
                showNonCurrentDates={false}
                displayEventEnd
                eventDisplay="block"
              />
            )}
          </div>
        )}
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {selectedEvent?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedEvent ? (
            <div className="space-y-4 text-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary/70">
                {propertyMonthYearLabel(selectedEvent.checkIn)}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={
                    selectedEvent.source === "airbnb"
                      ? cn(statusStyles.error.border, statusStyles.error.text)
                      : cn(statusStyles.info.border, statusStyles.info.text)
                  }
                >
                  {selectedEvent.source === "airbnb" && selectedEvent.airbnbKind
                    ? airbnbDisplayTitle(selectedEvent.airbnbKind)
                    : selectedEvent.source === "airbnb"
                      ? "Airbnb"
                      : "Website booking"}
                </Badge>
                <Badge variant="secondary">{selectedEvent.status}</Badge>
              </div>
              {selectedEvent.guestName &&
              selectedEvent.guestName !== selectedEvent.title ? (
                <p className="text-[10px] text-muted-foreground">
                  Airbnb feed: {selectedEvent.guestName}
                </p>
              ) : null}
              <div className="rounded-xl border border-border/60 bg-secondary/15 p-4 space-y-2">
                <div className="flex justify-between gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Check-in
                  </span>
                  <span className="font-medium text-foreground">
                    {formatPropertyDateLabel(selectedEvent.checkIn)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Check-out
                  </span>
                  <span className="font-medium text-foreground">
                    {formatPropertyDateLabel(selectedEvent.checkOut)}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                  {blockedNightsBetween(
                    selectedEvent.checkIn,
                    selectedEvent.checkOut
                  )}{" "}
                  night
                  {blockedNightsBetween(
                    selectedEvent.checkIn,
                    selectedEvent.checkOut
                  ) === 1
                    ? ""
                    : "s"}{" "}
                  blocked · checkout day is available for new guests
                </p>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground">
                ID: {selectedEvent.id.slice(0, 12)}…
              </p>
              {canCancelSelectedEvent ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10"
                  disabled={cancelBooking.isPending}
                  onClick={() => setCancelConfirmOpen(true)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel booking
                </Button>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={cancelConfirmOpen}
        onOpenChange={(open) => {
          setCancelConfirmOpen(open);
          if (!open) setCancelRefundError(null);
        }}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif">Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                {isPaidConfirmedEvent ? (
                  <p>A full Razorpay refund will be issued and cancellation emails will be sent.</p>
                ) : (
                  <p>This pending hold will be released and cancellation emails will be sent.</p>
                )}
                {cancelRefundError ? (
                  <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-destructive">
                    <strong>Refund failed:</strong> {cancelRefundError}
                    <span className="mt-1 block text-xs font-normal">
                      Add funds in your{" "}
                      <a
                        href="https://dashboard.razorpay.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        Razorpay dashboard
                      </a>
                      , then retry — or cancel without refund and process it manually.
                    </span>
                  </p>
                ) : null}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
            <AlertDialogCancel className="rounded-xl">Keep</AlertDialogCancel>
            {isPaidConfirmedEvent ? (
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10"
                disabled={cancelBooking.isPending}
                onClick={() => void handleCancelFromCalendar(true)}
              >
                {cancelBooking.isPending ? "Cancelling…" : "Cancel without refund"}
              </Button>
            ) : null}
            <AlertDialogAction
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={cancelBooking.isPending}
              onClick={(e) => {
                e.preventDefault();
                void handleCancelFromCalendar(false);
              }}
            >
              {cancelBooking.isPending
                ? "Cancelling…"
                : isPaidConfirmedEvent
                  ? "Cancel & refund"
                  : "Confirm cancel"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
