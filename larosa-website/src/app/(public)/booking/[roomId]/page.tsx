"use client";

import { useState, use, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { DateRange } from "react-day-picker";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon, Users, User, Mail, Phone,
  MessageSquare, CreditCard, CheckCircle, ArrowRight, ArrowLeft, Shield, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import {
  useGetRoom,
  useGetRoomAvailability,
  useCreateBooking,
  useGetBookingQuote,
} from "@/hooks/use-queries";
import { useAuth } from "@/hooks/use-auth";
import { useRazorpayScript } from "@/hooks/use-razorpay-script";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatPropertyDateLabel } from "@/lib/property-dates";
import {
  buildBlockedNightSet,
  isDateBlocked,
  isPastDate,
  pickerRangeToBookingIso,
  pickerRangeToPropertyYmd,
  rangeOverlapsBlocked,
} from "@/lib/booking-availability";

const guestSchema = z.object({
  guestName: z.string().min(2, "Full name is required"),
  guestEmail: z.string().email("Valid email is required"),
  guestPhone: z.string().optional(),
  specialRequests: z.string().optional(),
});
type GuestForm = z.infer<typeof guestSchema>;

export default function BookingPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId: roomIdStr } = use(params);
  const roomId = parseInt(roomIdStr, 10);
  const router = useRouter();
  const { user } = useAuth();
  const razorpayLoaded = useRazorpayScript();

  const { data: room, isLoading: roomLoading } = useGetRoom(roomId);
  const { data: bookedRanges = [], isLoading: availabilityLoading } =
    useGetRoomAvailability(roomId, {
      query: { staleTime: 60_000, refetchOnWindowFocus: true },
    });
  const createBooking = useCreateBooking();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState("2");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paying, setPaying] = useState(false);

  const form = useForm<GuestForm>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      guestName: user?.name ?? "",
      guestEmail: user?.email ?? "",
      guestPhone: "",
      specialRequests: "",
    },
  });

  const blockedSet = useMemo(
    () => buildBlockedNightSet(bookedRanges),
    [bookedRanges]
  );

  const propertyYmd = dateRange ? pickerRangeToPropertyYmd(dateRange) : null;
  const nights =
    propertyYmd != null
      ? Math.max(
          1,
          differenceInCalendarDays(
            parseISO(propertyYmd.checkOut),
            parseISO(propertyYmd.checkIn)
          )
        )
      : 0;

  const selectionOverlapsBlocked =
    dateRange?.from != null &&
    dateRange?.to != null &&
    rangeOverlapsBlocked(dateRange.from, dateRange.to, blockedSet);

  const bookingIso =
    dateRange?.from && dateRange?.to && !selectionOverlapsBlocked
      ? pickerRangeToBookingIso(dateRange)
      : null;

  const { data: quote, isFetching: quoteLoading } = useGetBookingQuote(
    roomId,
    bookingIso?.checkIn ?? null,
    bookingIso?.checkOut ?? null,
    { enabled: !!bookingIso }
  );

  const handleDateSelect = useCallback(
    (range: DateRange | undefined) => {
      if (!range?.from) {
        setDateRange(range);
        return;
      }
      if (
        range.from &&
        range.to &&
        rangeOverlapsBlocked(range.from, range.to, blockedSet)
      ) {
        toast.error(
          "Those dates include nights that are already booked. Please choose another range."
        );
        setDateRange(undefined);
        return;
      }
      setDateRange(range);
    },
    [blockedSet]
  );
  const subtotal = quote?.subtotal ?? 0;
  const taxes = quote?.taxes ?? 0;
  const total = quote?.total ?? 0;

  const handleDateContinue = () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Please select check-in and check-out dates");
      return;
    }
    if (selectionOverlapsBlocked) {
      toast.error("Selected dates overlap with existing bookings.");
      return;
    }
    setStep(2);
  };

  const handleGuestSubmit = async (data: GuestForm) => {
    if (!dateRange?.from || !dateRange?.to || !room) return;
    const iso = pickerRangeToBookingIso(dateRange);
    if (!iso) return;
    try {
      const result = await createBooking.mutateAsync({
        data: {
          roomId: room.id,
          checkIn: iso.checkIn,
          checkOut: iso.checkOut,
          guests: parseInt(guests, 10),
          guestName: data.guestName,
          guestEmail: data.guestEmail,
          guestPhone: data.guestPhone,
          specialRequests: data.specialRequests,
        },
      });
      setBookingId(result.bookingId);
      setTotalPrice(result.totalPrice);
      setStep(3);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create booking";
      const code = (err as Error & { code?: string }).code;
      if (code === "DATES_UNAVAILABLE") {
        toast.error("These dates are already booked. Please select different dates.");
        setStep(1);
      } else {
        toast.error(msg);
      }
    }
  };

  const handlePayment = async () => {
    if (!bookingId || !room || !razorpayLoaded) return;
    setPaying(true);
    try {
      const iso =
        dateRange?.from && dateRange?.to
          ? pickerRangeToBookingIso(dateRange)
          : null;
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: room.id,
          checkIn: iso?.checkIn,
          checkOut: iso?.checkOut,
        }),
      });
      const orderData = await orderRes.json() as {
        orderId?: string; amount?: number; currency?: string; keyId?: string;
        error?: string; code?: string;
      };

      if (!orderRes.ok) {
        if (orderData.code === "DATES_UNAVAILABLE") {
          toast.error("These dates were just booked by someone else. Please select new dates.");
          setStep(1);
          return;
        }
        throw new Error(orderData.error ?? "Could not create payment order");
      }

      const guestData = form.getValues();

      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency ?? "INR",
        order_id: orderData.orderId,
        name: "La Rosa",
        description: `${room.title} — ${nights} night${nights !== 1 ? "s" : ""}`,
        prefill: {
          name: guestData.guestName,
          email: guestData.guestEmail,
          contact: guestData.guestPhone ?? "",
        },
        theme: { color: "#c9a96e" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId,
            }),
          });
          const verifyData = await verifyRes.json() as { verified?: boolean; bookingId?: string };
          if (verifyData.verified) {
            router.push(`/booking/confirmation/${verifyData.bookingId ?? bookingId}`);
          } else {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
      });
      rzp.open();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  if (roomLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-sm uppercase tracking-widest">Villa not found</p>
        <Button onClick={() => router.push("/villas")} variant="outline">Back to Villas</Button>
      </div>
    );
  }

  const stepLabels = ["Dates", "Details", "Payment"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/[0.04] via-background to-background py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 md:mb-12 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60 mb-3">
            Reserve your villa
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-2">{room.title}</h1>
          <p className="text-muted-foreground text-sm">
            ₹{room.price.toLocaleString("en-IN")} per night · {room.type}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-0 mb-12">
          {stepLabels.map((label, i) => {
            const s = i + 1;
            const active = step === s;
            const done = step > s;
            return (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                    done ? "bg-primary text-primary-foreground" : active ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-muted text-muted-foreground"
                  )}>
                    {done ? <CheckCircle className="h-4 w-4" /> : s}
                  </div>
                  <span className={cn("text-[9px] uppercase tracking-widest font-bold mt-1.5", active || done ? "text-primary" : "text-muted-foreground")}>{label}</span>
                </div>
                {i < 2 && <div className={cn("w-20 md:w-32 h-px mx-2 mt-[-12px] transition-all", done ? "bg-primary" : "bg-border")} />}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">

              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div className="bg-card/95 border border-border/80 rounded-2xl p-6 md:p-10 shadow-lg ring-1 ring-border/40">
                    <h2 className="font-serif text-2xl md:text-3xl mb-2">Select your dates</h2>
                    <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">
                      Unavailable nights are shaded (Airbnb & website bookings)
                    </p>
                    <p className="text-[10px] text-muted-foreground/80 mb-6">
                      Checkout day is available for the next guest — same as our admin calendar.
                    </p>

                    <div className="flex flex-wrap gap-4 mb-6 text-[10px] font-bold uppercase tracking-widest">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-3 w-3 rounded-sm bg-rose-500/15 border border-rose-500/25" />
                        Unavailable
                      </span>
                      {dateRange?.from && dateRange?.to ? (
                        <span className="inline-flex items-center gap-2 text-primary">
                          <span className="h-3 w-3 rounded-sm bg-primary/20 border border-primary/40" />
                          Your stay
                        </span>
                      ) : null}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 mb-8">
                      <div className="flex-1 flex justify-center overflow-x-auto relative min-h-[320px]">
                        {availabilityLoading ? (
                          <div className="flex items-center justify-center w-full py-16">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                        ) : (
                          <Calendar
                            mode="range"
                            selected={dateRange}
                            onSelect={handleDateSelect}
                            numberOfMonths={2}
                            disabled={(d) =>
                              isPastDate(d) || isDateBlocked(d, blockedSet)
                            }
                            modifiers={{
                              booked: (d) => isDateBlocked(d, blockedSet),
                            }}
                            modifiersClassNames={{
                              booked:
                                "bg-rose-500/12 text-muted-foreground/90 line-through decoration-rose-500/40 cursor-not-allowed aria-disabled:opacity-100",
                            }}
                            className={cn(
                              "border border-border/80 rounded-xl p-4 md:p-5 bg-background/80 shadow-inner",
                              "[--cell-size:2.75rem] md:[--cell-size:3rem]",
                              "[&_.rdp-month]:min-w-[18rem]"
                            )}
                          />
                        )}
                      </div>
                      <div className="lg:w-52 shrink-0 space-y-6">
                        <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                            Availability
                          </p>
                          <p className="text-sm text-foreground leading-relaxed">
                            {blockedSet.size > 0
                              ? `${blockedSet.size} night${blockedSet.size === 1 ? "" : "s"} already blocked on this villa.`
                              : "All upcoming nights are open — pick your stay."}
                          </p>
                        </div>
                        <div>
                          <label
                            htmlFor="booking-guests"
                            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block"
                          >
                            Number of guests
                          </label>
                          <Select value={guests} onValueChange={setGuests}>
                            <SelectTrigger
                              className="h-11 rounded-xl border-border w-full"
                              id="booking-guests"
                            >
                              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: room.capacity }, (_, i) => i + 1).map(
                                (n) => (
                                  <SelectItem key={n} value={n.toString()}>
                                    {n} {n === 1 ? "Guest" : "Guests"}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Button
                      id="booking-continue-dates"
                      onClick={handleDateContinue}
                      disabled={
                        !dateRange?.from ||
                        !dateRange?.to ||
                        selectionOverlapsBlocked
                      }
                      className="w-full h-12 rounded-xl font-serif tracking-widest text-sm shadow-md shadow-primary/15 transition-shadow hover:shadow-lg hover:shadow-primary/20"
                    >
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div className="bg-card/95 border border-border/80 rounded-2xl p-6 md:p-10 shadow-lg ring-1 ring-border/40">
                    <h2 className="font-serif text-2xl mb-2">Guest Details</h2>
                    <p className="text-muted-foreground text-xs uppercase tracking-widest mb-8">Your information for this reservation</p>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleGuestSubmit)} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <FormField control={form.control} name="guestName" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Full Name *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input id="booking-name" className="h-11 rounded-xl border-border pl-10" autoComplete="name" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="guestEmail" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Email *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input id="booking-email" type="email" className="h-11 rounded-xl border-border pl-10" autoComplete="email" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                        <FormField control={form.control} name="guestPhone" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Phone Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="booking-phone" type="tel" className="h-11 rounded-xl border-border pl-10" autoComplete="tel" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="specialRequests" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Special Requests</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Textarea id="booking-requests" className="rounded-xl border-border pl-10 min-h-[90px] resize-none" placeholder="Any preferences or requests..." {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <div className="flex gap-3 pt-2">
                          <Button type="button" variant="outline" onClick={() => setStep(1)} className="h-11 rounded-xl border-border">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                          </Button>
                          <Button id="booking-confirm-details" type="submit" disabled={createBooking.isPending} className="flex-1 h-11 rounded-xl font-serif tracking-widest text-sm">
                            {createBooking.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <>Confirm Details <ArrowRight className="ml-2 h-4 w-4" /></>}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div className="bg-card/95 border border-border/80 rounded-2xl p-6 md:p-10 shadow-lg ring-1 ring-border/40">
                    <h2 className="font-serif text-2xl mb-2">Secure Payment</h2>
                    <p className="text-muted-foreground text-xs uppercase tracking-widest mb-8">Your reservation is held — complete payment to confirm</p>
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-xl">
                        <Shield className="h-5 w-5 text-primary shrink-0" />
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-primary">SSL Secured</p>
                          <p className="text-[11px] text-muted-foreground">Payments processed by Razorpay — 256-bit encryption</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                        <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Pending Booking Created</p>
                          <p className="text-[11px] text-muted-foreground">Ref: {bookingId?.slice(0, 16)}...</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={() => setStep(2)} className="h-12 rounded-xl border-border">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      <Button id="booking-pay-now" onClick={handlePayment} disabled={paying || !razorpayLoaded} className="flex-1 h-12 rounded-xl font-serif tracking-widest">
                        {paying ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : <><CreditCard className="mr-2 h-4 w-4" /> Pay ₹{totalPrice.toLocaleString("en-IN")}</>}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card/95 border border-border/80 rounded-2xl p-6 shadow-lg ring-1 ring-border/60 sticky top-24">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">Summary</p>
              <div className="aspect-video rounded-xl overflow-hidden mb-5 bg-muted relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {room.images[0] && (
                  <img
                    src={room.images[0]}
                    alt={room.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>
              <h3 className="font-serif text-lg mb-1">{room.title}</h3>
              <Badge variant="outline" className="text-[9px] uppercase tracking-widest rounded-lg mb-5">{room.type}</Badge>

              {propertyYmd ? (
                <div className="space-y-0 text-sm divide-y divide-border/50">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><CalendarIcon className="h-3 w-3" />Check-in</span>
                    <span className="font-medium text-xs">
                      {formatPropertyDateLabel(propertyYmd.checkIn)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><CalendarIcon className="h-3 w-3" />Check-out</span>
                    <span className="font-medium text-xs">
                      {formatPropertyDateLabel(propertyYmd.checkOut)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Nights</span>
                    <span className="font-medium text-xs">{nights}</span>
                  </div>
                  {quoteLoading ? (
                    <p className="text-xs text-muted-foreground py-4 text-center">
                      Calculating price…
                    </p>
                  ) : (
                    <>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Subtotal</span>
                        <span className="text-xs">₹{subtotal.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">GST (12%)</span>
                        <span className="text-xs">₹{taxes.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between items-center pt-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest">Total</span>
                        <span className="font-serif text-xl text-primary">₹{total.toLocaleString("en-IN")}</span>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">Select dates to see pricing</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
