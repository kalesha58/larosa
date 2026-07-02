"use client";

import { useState, useMemo } from "react";
import {
  useGetAllBookings,
  useCancelBooking,
  getGetAllBookingsQueryKey,
  type Booking,
} from "@/hooks/use-queries";
import { useQueryClient } from "@tanstack/react-query";
import { format, isWithinInterval, startOfDay, endOfDay, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { XCircle, Calendar as CalendarIcon, User, Mail, CreditCard, Search, Filter, Download, Home, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { statusStyles } from "@/lib/admin-status-styles";

export default function AdminBookings() {
  const { data: bookings, isLoading } = useGetAllBookings();
  const cancelBooking = useCancelBooking();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelRefundError, setCancelRefundError] = useState<string | null>(null);

  const isPaidConfirmed = (booking: Booking) =>
    booking.status === "confirmed" && Boolean(booking.razorpayPaymentId?.trim());

  const handleCancelConfirm = async (skipRefund = false) => {
    if (!cancelTarget) return;
    try {
      const result = await cancelBooking.mutateAsync({
        id: cancelTarget.id,
        skipRefund,
      });
      setCancelTarget(null);
      setCancelRefundError(null);
      toast({
        title: "Reservation cancelled",
        description: result.refunded
          ? `Full refund issued${result.refundId ? ` (${result.refundId})` : ""}. Cancellation emails sent.`
          : result.refundPending
            ? "Booking cancelled. Process the refund manually from your Razorpay dashboard."
            : "Booking cancelled. Cancellation emails sent.",
      });
      queryClient.invalidateQueries({ queryKey: getGetAllBookingsQueryKey() });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to cancel booking";
      if (!skipRefund && cancelTarget && isPaidConfirmed(cancelTarget)) {
        setCancelRefundError(msg);
      }
      toast({ variant: "destructive", title: "Cancellation failed", description: msg });
    }
  };

  // Group bookings by room for the selected date
  const dailyOccupancy = useMemo(() => {
    if (!bookings || !selectedDate) return {};
    
    const day = startOfDay(selectedDate);
    const dayEnd = endOfDay(selectedDate);

    const activeBookings = bookings.filter((b) => {
      if (b.status === "cancelled") return false;
      const start = parseISO(b.checkIn);
      const end = parseISO(b.checkOut);
      // Booking is active if it overlaps with the selected day
      return (start <= dayEnd && end >= day);
    });

    // Group by room title
    const grouped: Record<string, Booking[]> = {};
    activeBookings.forEach((b) => {
      if (!grouped[b.room.title]) grouped[b.room.title] = [];
      grouped[b.room.title].push(b);
    });
    return grouped;
  }, [bookings, selectedDate]);

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    if (!searchQuery) return bookings;
    return bookings.filter(b => 
      b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.guestEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.room.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [bookings, searchQuery]);

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60 mb-2">Reservation Management</p>
          <h1 className="font-serif text-4xl text-foreground">Occupancy Control</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input 
              className="rounded-xl border-border h-10 w-64 pl-9 text-[11px] font-medium tracking-wider bg-secondary/5 focus-visible:ring-primary/20" 
              placeholder="GUEST NAME OR EMAIL..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="rounded-xl h-10 px-4 uppercase tracking-widest text-[9px] font-bold border-border hover:bg-primary/5">
            <Download className="mr-2 h-3 w-3" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Calendar & Daily Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendar Picker */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">Select Date</p>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-xl border border-border/50 bg-secondary/5"
            />
            <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Info className="h-3 w-3 text-primary" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-primary">Status Legend</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Selecting a date shows all active check-ins, stay-overs, and scheduled check-outs for that 24h window.
              </p>
            </div>
          </div>
        </div>

        {/* Daily Room Overview */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl flex items-center gap-3">
              <Home className="h-5 w-5 text-primary" />
              {selectedDate ? format(selectedDate, "MMMM dd, yyyy") : "Daily Overview"}
            </h2>
            <Badge variant="outline" className="rounded-full px-3 py-1 text-[9px] font-bold tracking-widest uppercase bg-secondary/20">
              {Object.keys(dailyOccupancy).length} Units Active
            </Badge>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedDate?.toISOString() || "empty"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            >
              {Object.keys(dailyOccupancy).length === 0 ? (
                <div className="col-span-full py-12 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-muted-foreground">
                  <CalendarIcon className="h-8 w-8 mb-3 opacity-20" />
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em]">No Occupancy for this Date</p>
                </div>
              ) : (
                Object.entries(dailyOccupancy).map(([roomTitle, activeBookings]) => (
                  <div key={roomTitle} className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:border-primary/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-xs font-bold uppercase tracking-widest text-primary">{roomTitle}</div>
                      <Badge className={cn(statusStyles.success.bg, statusStyles.success.text, "text-[8px] border-none px-2 rounded-md")}>
                        {activeBookings.length} {activeBookings.length === 1 ? 'Booking' : 'Bookings'}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {activeBookings.map(b => (
                        <div key={b.id} className="text-xs flex items-center justify-between py-2 border-t border-border/40">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-secondary/50 flex items-center justify-center text-[10px] font-bold">{b.guestName.charAt(0)}</div>
                            <span className="font-semibold">{b.guestName}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-mono">#{b.id.slice(0, 4)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Global Logs Table */}
      <div className="space-y-6 pt-10">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <h2 className="font-serif text-2xl tracking-tight">Comprehensive Logs</h2>
        </div>
        
        <div className="bg-card border border-border shadow-2xl relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-admin-grid pointer-events-none" />
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-[120px] text-[10px] font-bold uppercase tracking-widest h-14">ID</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest">Guest Details</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest">Property Units</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest">Schedule</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest">Status</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest">Financials</TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center text-muted-foreground animate-pulse">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-4 w-4 border-2 border-primary border-t-transparent animate-spin rounded-full" />
                      <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Querying Central Logs</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em]">No Reservation Records Detected</p>
                  </TableCell>
                </TableRow>
              ) : filteredBookings.map((booking: Booking) => (
                <TableRow key={booking.id} className="border-border hover:bg-secondary/10 transition-colors group">
                  <TableCell className="py-6 font-mono text-[10px] text-muted-foreground font-bold pl-8">
                    #{booking.id.slice(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 bg-primary/5 flex items-center justify-center text-primary font-serif border border-primary/10">
                        {booking.guestName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold tracking-tight">{booking.guestName}</div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Mail className="h-2.5 w-2.5" /> {booking.guestEmail}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-semibold uppercase tracking-wider">{booking.room.title}</div>
                    <div className="text-[9px] text-muted-foreground font-bold tracking-widest">{booking.room.type}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <CalendarIcon className="h-3 w-3" /> 
                        {format(parseISO(booking.checkIn), "MMM dd, yyyy")}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/80 pl-5">
                        to {format(parseISO(booking.checkOut), "MMM dd, yyyy")}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={booking.status === 'confirmed' ? 'default' : 'secondary'} 
                      className={cn(
                        "rounded-lg text-[8px] uppercase tracking-[0.2em] font-bold px-2 py-0.5 border-none",
                        booking.status === 'confirmed' ? cn(statusStyles.success.bg, statusStyles.success.text) : 'bg-destructive/10 text-destructive'
                      )}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-serif font-bold text-foreground">
                        ₹{booking.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {(booking.status === "confirmed" || booking.status === "pending") && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive transition-colors hover:bg-destructive/10 rounded-xl h-9 w-9"
                          onClick={() => setCancelTarget(booking)}
                          title="Cancel booking"
                          disabled={cancelBooking.isPending}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog
        open={cancelTarget != null}
        onOpenChange={(open) => {
          if (!open) {
            setCancelTarget(null);
            setCancelRefundError(null);
          }
        }}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif">Cancel reservation?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                {cancelTarget ? (
                  <>
                    <p>
                      <strong>{cancelTarget.guestName}</strong> · {cancelTarget.room.title}
                    </p>
                    <p>
                      {format(parseISO(cancelTarget.checkIn), "MMM d, yyyy")} →{" "}
                      {format(parseISO(cancelTarget.checkOut), "MMM d, yyyy")}
                    </p>
                    {isPaidConfirmed(cancelTarget) ? (
                      <p className="text-foreground font-medium">
                        A full Razorpay refund of ₹{cancelTarget.totalPrice.toLocaleString("en-IN")} will be issued automatically.
                      </p>
                    ) : (
                      <p>No payment to refund — this pending hold will be released.</p>
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
                    <p>Guest and admin will receive cancellation emails.</p>
                  </>
                ) : null}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
            <AlertDialogCancel className="rounded-xl">Keep booking</AlertDialogCancel>
            {cancelTarget && isPaidConfirmed(cancelTarget) ? (
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10"
                disabled={cancelBooking.isPending}
                onClick={() => void handleCancelConfirm(true)}
              >
                {cancelBooking.isPending ? "Cancelling…" : "Cancel without refund"}
              </Button>
            ) : null}
            <AlertDialogAction
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={cancelBooking.isPending}
              onClick={(e) => {
                e.preventDefault();
                void handleCancelConfirm(false);
              }}
            >
              {cancelBooking.isPending
                ? "Cancelling…"
                : cancelTarget && isPaidConfirmed(cancelTarget)
                  ? "Cancel & refund"
                  : "Cancel booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
