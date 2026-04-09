"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, differenceInDays } from "date-fns";
import { useGetRoom, useCreateBooking } from "@/hooks/use-queries";
import { useAuth } from "@/hooks/use-auth";
import { useRazorpayScript } from "@/hooks/use-razorpay-script";
import { BookingAuthModal } from "@/components/booking/BookingAuthModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { PAYMENT_NOT_CONFIGURED_CODE } from "@/lib/payments-env";
import Image from "next/image";
import { AlertCircle } from "lucide-react";
import { use, useEffect, useState } from "react";

const bookingSchema = z.object({
  guestName: z.string().min(2, "Name is required"),
  guestEmail: z.string().email("Valid email is required"),
  guestPhone: z.string().optional(),
  specialRequests: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function BookingPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const razorpayReady = useRazorpayScript();
  const [paymentBusy, setPaymentBusy] = useState(false);
  const [paymentConfigured, setPaymentConfigured] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;
    fetch("/api/payments/status")
      .then((r) => r.json())
      .then((data: { configured?: boolean }) => {
        if (!cancelled) {
          setPaymentConfigured(Boolean(data.configured));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPaymentConfigured(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const checkInStr =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("checkIn")
      : null;
  const checkOutStr =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("checkOut")
      : null;
  const guests =
    typeof window !== "undefined"
      ? Number(new URLSearchParams(window.location.search).get("guests")) || 2
      : 2;

  const checkIn = checkInStr ? new Date(checkInStr) : new Date();
  const checkOut = checkOutStr
    ? new Date(checkOutStr)
    : new Date(Date.now() + 86400000);
  const nights = Math.max(1, differenceInDays(checkOut, checkIn));

  const { data: room, isLoading: isRoomLoading } = useGetRoom(Number(roomId), {
    query: { enabled: !!roomId },
  });

  const createBooking = useCreateBooking();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guestName: user?.name ?? "",
      guestEmail: user?.email ?? "",
      guestPhone: "",
      specialRequests: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        guestName: user.name,
        guestEmail: user.email,
        guestPhone: form.getValues("guestPhone"),
        specialRequests: form.getValues("specialRequests"),
      });
    }
  }, [user, form]);

  const needsAuth = !authLoading && !user;

  const onSubmit = async (data: BookingFormValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Sign in required",
        description: "Please sign in or register to pay and confirm.",
      });
      return;
    }

    if (!razorpayReady || typeof window === "undefined" || !window.Razorpay) {
      toast({
        variant: "destructive",
        title: "Payment is loading",
        description: "Wait a moment, then try again.",
      });
      return;
    }

    if (paymentConfigured === false) {
      toast({
        variant: "destructive",
        title: "Payment not configured",
        description:
          "Add NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local, then restart the dev server.",
      });
      return;
    }

    if (!room) return;

    setPaymentBusy(true);
    try {
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: Number(roomId),
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
        }),
      });

      const orderJson: unknown = await orderRes.json();
      if (!orderRes.ok) {
        const msg =
          typeof orderJson === "object" &&
          orderJson !== null &&
          "error" in orderJson &&
          typeof (orderJson as { error: unknown }).error === "string"
            ? (orderJson as { error: string }).error
            : "Could not start payment.";
        const code =
          typeof orderJson === "object" &&
          orderJson !== null &&
          "code" in orderJson &&
          (orderJson as { code: unknown }).code ===
            PAYMENT_NOT_CONFIGURED_CODE
            ? PAYMENT_NOT_CONFIGURED_CODE
            : undefined;
        toast({
          variant: "destructive",
          title:
            code === PAYMENT_NOT_CONFIGURED_CODE
              ? "Payment not configured"
              : "Payment",
          description: msg,
        });
        setPaymentBusy(false);
        return;
      }

      const order = orderJson as {
        orderId: string;
        amount: number;
        currency: string;
        keyId: string;
      };

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "Larosa",
        description: `Stay — ${room.title}`,
        prefill: {
          name: data.guestName,
          email: data.guestEmail,
        },
        theme: { color: "#1c1917" },
        modal: {
          ondismiss: () => {
            setPaymentBusy(false);
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyJson: unknown = await verifyRes.json();
            if (!verifyRes.ok) {
              const msg =
                typeof verifyJson === "object" &&
                verifyJson !== null &&
                "error" in verifyJson &&
                typeof (verifyJson as { error: unknown }).error === "string"
                  ? (verifyJson as { error: string }).error
                  : "Verification failed.";
              throw new Error(msg);
            }

            const result = await createBooking.mutateAsync({
              data: {
                roomId: Number(roomId),
                checkIn: checkIn.toISOString(),
                checkOut: checkOut.toISOString(),
                guests,
                ...data,
              },
            });

            toast({
              title: "Reservation confirmed",
              description: "Your sanctuary awaits.",
            });
            router.push(`/booking/confirmation/${result.id}`);
          } catch (err: unknown) {
            const msg =
              err instanceof Error ? err.message : "Something went wrong.";
            toast({
              variant: "destructive",
              title: "Could not complete booking",
              description: msg,
            });
          } finally {
            setPaymentBusy(false);
          }
        },
      });

      rzp.on("payment.failed", () => {
        setPaymentBusy(false);
        toast({
          variant: "destructive",
          title: "Payment failed",
          description: "Try again or use another method.",
        });
      });

      rzp.open();
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "Payment could not be started.";
      toast({
        variant: "destructive",
        title: "Payment",
        description: msg,
      });
      setPaymentBusy(false);
    }
  };

  if (isRoomLoading || !room) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20">
        <div className="container mx-auto max-w-5xl px-4">
          <Skeleton className="mb-8 h-12 w-64" />
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <Skeleton className="h-[600px] w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  const subtotal = room.price * nights;
  const taxes = Math.floor(subtotal * 0.15);
  const total = subtotal + taxes;

  const submitBlocked =
    !!needsAuth ||
    paymentBusy ||
    createBooking.isPending ||
    !razorpayReady ||
    paymentConfigured === false ||
    paymentConfigured === null;

  return (
    <>
      <BookingAuthModal open={needsAuth} />

      <div className="min-h-screen bg-background px-4 pb-20 pt-32 md:px-0">
        <div className="container mx-auto max-w-5xl px-4">
          <h1 className="mb-12 border-b border-border pb-6 font-serif text-4xl text-foreground md:text-5xl">
            Complete Your Reservation
          </h1>

          {paymentConfigured === false && (
            <Alert variant="destructive" className="mb-8 rounded-none border-destructive/40">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Razorpay is not configured</AlertTitle>
              <AlertDescription className="text-destructive/90">
                Add your keys to{" "}
                <code className="rounded bg-destructive/10 px-1 py-0.5 text-xs">
                  .env.local
                </code>
                :{" "}
                <code className="rounded bg-destructive/10 px-1 py-0.5 text-xs">
                  NEXT_PUBLIC_RAZORPAY_KEY_ID
                </code>{" "}
                (publishable) and{" "}
                <code className="rounded bg-destructive/10 px-1 py-0.5 text-xs">
                  RAZORPAY_KEY_SECRET
                </code>{" "}
                (server only). Restart{" "}
                <code className="rounded bg-destructive/10 px-1 py-0.5 text-xs">
                  npm run dev
                </code>{" "}
                after saving. Test keys:{" "}
                <a
                  href="https://dashboard.razorpay.com/app/keys"
                  className="font-medium underline underline-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Razorpay Dashboard → API Keys
                </a>
                .
              </AlertDescription>
            </Alert>
          )}

          <div
            className={
              needsAuth ? "pointer-events-none select-none opacity-40" : ""
            }
          >
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24">
              <div className="order-2 lg:order-1">
                <h2 className="mb-6 font-serif text-2xl text-foreground">
                  Guest Details
                </h2>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="guestName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your name"
                              className="h-12 rounded-none border-border bg-background focus-visible:ring-primary"
                              disabled={needsAuth}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="guestEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="you@example.com"
                                className="h-12 rounded-none border-border bg-background focus-visible:ring-primary"
                                disabled={needsAuth}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="guestPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="+1 (555) 000-0000"
                                className="h-12 rounded-none border-border bg-background focus-visible:ring-primary"
                                disabled={needsAuth}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="specialRequests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">
                            Special Requests
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any special requests or preferences..."
                              className="min-h-[120px] resize-none rounded-none border-border bg-background focus-visible:ring-primary"
                              disabled={needsAuth}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <p className="text-xs text-muted-foreground">
                      Secure checkout powered by Razorpay. You will complete
                      payment in a secure window after tapping the button below.
                    </p>

                    <Button
                      type="submit"
                      disabled={submitBlocked}
                      className="mt-8 h-14 w-full rounded-none font-serif text-lg tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {paymentConfigured === null
                        ? "CHECKING PAYMENT SETUP..."
                        : paymentConfigured === false
                          ? "PAYMENT NOT CONFIGURED"
                          : !razorpayReady
                            ? "LOADING CHECKOUT..."
                            : paymentBusy || createBooking.isPending
                              ? "PROCESSING..."
                              : "PAY & CONFIRM RESERVATION"}
                    </Button>
                  </form>
                </Form>
              </div>

              <div className="order-1 lg:order-2">
                <div className="sticky top-32 border border-border bg-card p-6 shadow-xl md:p-8">
                  <h2 className="mb-6 font-serif text-2xl text-foreground">
                    Reservation Summary
                  </h2>

                  <div className="mb-8 flex gap-4">
                    <div className="relative h-24 w-24 shrink-0">
                      <Image
                        src={room.images[0] || "/placeholder.jpg"}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="mb-1 text-xs uppercase tracking-widest text-primary">
                        {room.type}
                      </p>
                      <h3 className="font-serif text-xl text-foreground">
                        {room.title}
                      </h3>
                    </div>
                  </div>

                  <div className="mb-8 space-y-4 border-y border-border py-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">
                          Check-in
                        </p>
                        <p className="text-foreground">
                          {format(checkIn, "EEE, MMM d, yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          After 3:00 PM
                        </p>
                      </div>
                      <div className="mx-4 h-12 w-px bg-border" />
                      <div className="text-right">
                        <p className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">
                          Check-out
                        </p>
                        <p className="text-foreground">
                          {format(checkOut, "EEE, MMM d, yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Before 11:00 AM
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Length of Stay
                      </span>
                      <span className="text-foreground">
                        {nights} {nights === 1 ? "Night" : "Nights"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guests</span>
                      <span className="text-foreground">
                        {guests} {guests === 1 ? "Guest" : "Guests"}
                      </span>
                    </div>
                    <div className="mt-4 flex justify-between border-t border-border/50 pt-4">
                      <span className="text-muted-foreground">
                        Room Rate (${room.price} × {nights})
                      </span>
                      <span className="text-foreground">${subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Taxes & Fees
                      </span>
                      <span className="text-foreground">${taxes}</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between border-t border-border pt-6 font-serif">
                    <span className="text-xl text-muted-foreground">Total</span>
                    <span className="text-3xl font-bold text-primary">
                      ${total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
