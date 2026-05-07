"use client";

import { use } from "react";
import { format } from "date-fns";
import { CheckCircle, Calendar, Users, CreditCard, Home, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetBooking } from "@/hooks/use-queries";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ConfirmationPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = use(params);
  const { data: booking, isLoading } = useGetBooking(bookingId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-lg w-full mx-auto px-4 space-y-6">
          <Skeleton className="h-16 w-16 rounded-full mx-auto" />
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <p className="text-muted-foreground text-sm uppercase tracking-widest">Booking not found</p>
        <Link href="/rooms">
          <Button variant="outline" className="rounded-xl">Browse Rooms</Button>
        </Link>
      </div>
    );
  }

  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-emerald-500" strokeWidth={1.5} />
            </div>
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-10"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-600 mb-3">Reservation Confirmed</p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-3">You&apos;re all set!</h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            A confirmation has been sent to <span className="text-foreground font-medium">{booking.guestEmail}</span>. We look forward to welcoming you.
          </p>
        </motion.div>

        {/* Booking Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden mb-8"
        >
          {/* Card Header */}
          <div className="bg-primary/5 border-b border-border px-8 py-6 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-1">Room Reserved</p>
              <h2 className="font-serif text-2xl text-foreground">{booking.room.title}</h2>
            </div>
            <Badge className="text-[9px] uppercase tracking-widest bg-emerald-500/10 text-emerald-600 border-none rounded-lg px-3 py-1">
              {booking.status}
            </Badge>
          </div>

          {/* Details Grid */}
          <div className="p-8 space-y-0 divide-y divide-border/50">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Check-in</span>
              </div>
              <span className="font-medium text-sm">{format(checkIn, "EEEE, MMMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Check-out</span>
              </div>
              <span className="font-medium text-sm">{format(checkOut, "EEEE, MMMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Guests</span>
              </div>
              <span className="font-medium text-sm">{booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}</span>
            </div>
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Contact</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm">{booking.guestName}</p>
                <p className="text-xs text-muted-foreground">{booking.guestEmail}</p>
                {booking.guestPhone && <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end"><Phone className="h-3 w-3" />{booking.guestPhone}</p>}
              </div>
            </div>
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Total Paid</span>
              </div>
              <span className="font-serif text-2xl text-primary">₹{booking.totalPrice.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="text-[10px] font-bold uppercase tracking-widest">Booking ID</span>
              </div>
              <span className="font-mono text-xs text-muted-foreground">{booking.id.slice(0, 20)}...</span>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full h-12 rounded-xl border-border gap-2">
              <Home className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
          <Link href="/rooms" className="flex-1">
            <Button className="w-full h-12 rounded-xl font-serif tracking-widest">
              Explore More Rooms
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
