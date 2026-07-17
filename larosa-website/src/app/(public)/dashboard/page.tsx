"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, LogOut, Users, IndianRupee, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useGetUserBookings, type Booking } from "@/hooks/use-queries";
import { GuestCancelBookingDialog } from "@/components/GuestCancelBookingDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function statusStyles(status: Booking["status"]) {
  switch (status) {
    case "confirmed":
      return "bg-emerald-500/90 text-white";
    case "cancelled":
      return "bg-red-500/85 text-white";
    default:
      return "bg-amber-500/90 text-white";
  }
}

function StayCard({ booking, index }: { booking: Booking; index: number }) {
  const cover = booking.room.images?.[0];
  const canCancel =
    booking.status === "confirmed" && new Date(booking.checkIn) > new Date();

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_12px_40px_-24px_rgba(0,0,0,0.35)]"
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative h-52 w-full shrink-0 overflow-hidden md:h-auto md:min-h-[220px] md:w-72 lg:w-80">
          {cover ? (
            <Image
              src={cover}
              alt={booking.room.title}
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              priority={index === 0}
            />
          ) : (
            <div className="flex h-full min-h-[208px] items-center justify-center bg-muted">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
                {booking.room.type}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/20" />
          <span
            className={cn(
              "absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] shadow-sm backdrop-blur-sm",
              statusStyles(booking.status)
            )}
          >
            {booking.status}
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-6 p-6 sm:p-8">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
              {booking.room.type} · #{booking.id.slice(0, 8).toUpperCase()}
            </p>
            <h3 className="font-serif text-3xl tracking-tight text-foreground sm:text-[2rem]">
              {booking.room.title}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-5 border-y border-border/50 py-5 sm:grid-cols-4">
            <div className="space-y-1">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <CalendarDays className="h-3 w-3" /> Check in
              </p>
              <p className="text-sm font-medium">
                {format(new Date(booking.checkIn), "MMM d, yyyy")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <CalendarDays className="h-3 w-3" /> Check out
              </p>
              <p className="text-sm font-medium">
                {format(new Date(booking.checkOut), "MMM d, yyyy")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <Users className="h-3 w-3" /> Guests
              </p>
              <p className="text-sm font-medium">
                {booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <IndianRupee className="h-3 w-3" /> Total
              </p>
              <p className="font-serif text-lg font-semibold tracking-tight text-primary">
                ₹{booking.totalPrice.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-9 rounded-full px-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              <Link href={`/rooms/${booking.roomId}`}>
                View property
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
            {canCancel ? <GuestCancelBookingDialog booking={booking} /> : null}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const { data: bookings, isLoading } = useGetUserBookings();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return loading ? (
      <div className="min-h-screen bg-background px-4 pb-20 pt-32">
        <div className="container mx-auto max-w-5xl space-y-6 px-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    ) : null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background pb-24 pt-28 md:pt-32">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,_rgba(201,169,110,0.12),_transparent_60%)]"
        aria-hidden
      />

      <div className="container relative mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 flex flex-col justify-between gap-6 border-b border-border/60 pb-8 sm:mb-14 sm:flex-row sm:items-end"
        >
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              Guest dashboard
            </p>
            <h1 className="mb-3 font-serif text-4xl text-foreground sm:text-5xl">
              Welcome, {user.name || "Guest"}
            </h1>
            <p className="max-w-md text-sm text-muted-foreground">
              Your stays at LaRosa — managed in one place.
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => void logout()}
            className="self-start rounded-full font-serif text-xs uppercase tracking-widest text-destructive hover:bg-destructive/10 sm:self-auto"
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-8 flex items-end justify-between gap-4"
        >
          <h2 className="font-serif text-2xl text-foreground sm:text-3xl">My Stays</h2>
          {bookings && bookings.length > 0 ? (
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {bookings.length} reservation{bookings.length === 1 ? "" : "s"}
            </p>
          ) : null}
        </motion.div>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-52 w-full rounded-2xl" />
            ))}
          </div>
        ) : !bookings || bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-border/70 bg-card/80 px-6 py-20 text-center shadow-sm backdrop-blur-sm"
          >
            <h3 className="mb-3 font-serif text-3xl text-foreground/80">
              No current reservations
            </h3>
            <p className="mb-10 text-muted-foreground">
              Your next escape at LaRosa starts with a single booking.
            </p>
            <Button
              className="h-12 rounded-full px-10 font-serif text-xs uppercase tracking-[0.2em]"
              asChild
            >
              <Link href="/rooms">Explore properties</Link>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-6"
            variants={listVariants}
            initial="hidden"
            animate="show"
          >
            {bookings.map((booking, index) => (
              <StayCard key={booking.id} booking={booking} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
