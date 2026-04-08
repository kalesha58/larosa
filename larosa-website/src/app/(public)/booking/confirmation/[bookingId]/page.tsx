"use client";

import { use } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { CheckCircle } from "lucide-react";
import { useGetBooking } from "@/hooks/use-queries";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookingConfirmationPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = use(params);

  const { data: booking, isLoading } = useGetBooking(Number(bookingId), {
    query: { enabled: !!bookingId }
  });

  if (isLoading || !booking) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <Skeleton className="w-full h-[500px] rounded-none" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 md:px-0">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-card border border-border shadow-2xl overflow-hidden">
          
          <div className="p-12 text-center border-b border-border bg-background/50">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-serif text-4xl text-foreground mb-4">Reservation Confirmed</h1>
            <p className="text-muted-foreground text-lg italic">
              Your sanctuary awaits, {booking.guestName.split(' ')[0]}.
            </p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mt-4 font-bold border border-border/50 inline-block px-4 py-1">
              Confirmation # {booking.id.toString().padStart(6, '0')}
            </p>
          </div>

          <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-serif text-xl text-primary mb-6 border-b border-border/30 pb-2">Stay Details</h3>
              <div className="space-y-6 text-sm tracking-wide">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Room</p>
                  <p className="text-foreground text-lg font-serif">{booking.room.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Check-in</p>
                    <p className="text-foreground font-medium">{format(new Date(booking.checkIn), "MMM d, yyyy")}</p>
                    <p className="text-[10px] text-muted-foreground uppercase mt-1">After 3:00 PM</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Check-out</p>
                    <p className="text-foreground font-medium">{format(new Date(booking.checkOut), "MMM d, yyyy")}</p>
                    <p className="text-[10px] text-muted-foreground uppercase mt-1">Before 11:00 AM</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Guests</p>
                  <p className="text-foreground">{booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-xl text-primary mb-6 border-b border-border/30 pb-2">Payment Summary</h3>
              <div className="space-y-4 text-sm bg-background/30 p-8 border border-border/30">
                <div className="flex justify-between pb-4 border-b border-border/50">
                  <span className="text-muted-foreground uppercase tracking-widest text-xs">Total Charged</span>
                  <span className="font-serif text-2xl text-foreground font-bold">${booking.totalPrice}</span>
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed italic">
                  <p>A confirmation email has been sent to {booking.guestEmail}. Please present your ID at check-in.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 border-t border-border bg-background/50 flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="rounded-none font-serif tracking-widest h-12 px-8 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground" asChild>
              <Link href="/">RETURN HOME</Link>
            </Button>
            <Button className="rounded-none font-serif tracking-widest h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
              <Link href="/dashboard">VIEW MY BOOKINGS</Link>
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
