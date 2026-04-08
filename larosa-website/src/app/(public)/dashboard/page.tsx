"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { useGetUserBookings, useCancelBooking, getGetUserBookingsQueryKey } from "@/hooks/use-queries";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useGetUserBookings();
  const cancelBooking = useCancelBooking();

  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
    }
  }, [user, router]);

  const handleCancelStatus = async (id: number) => {
    try {
      await cancelBooking.mutateAsync({ id });
      toast({
        title: "Booking Cancelled",
        description: "Your reservation has been successfully cancelled.",
      });
      queryClient.invalidateQueries({ queryKey: getGetUserBookingsQueryKey() });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Cancellation Failed",
        description: error.message || "Unable to cancel booking.",
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 md:px-0">
      <div className="container mx-auto px-4 max-w-5xl">
        
        <div className="mb-16 flex justify-between items-end border-b border-border pb-8">
          <div>
            <h1 className="font-serif text-5xl text-foreground mb-4">Welcome, {user?.name || "Guest"}</h1>
            <p className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Your private sanctuary account</p>
          </div>
          <Button variant="ghost" onClick={() => logout()} className="text-destructive font-serif tracking-widest text-xs uppercase hover:bg-destructive/10">
             <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>

        <h2 className="font-serif text-2xl text-foreground mb-8">My Stays</h2>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2].map(i => (
              <Skeleton key={i} className="w-full h-48 rounded-none" />
            ))}
          </div>
        ) : !bookings || bookings.length === 0 ? (
          <div className="text-center py-24 bg-card border border-border">
            <h3 className="font-serif text-3xl text-foreground mb-4 opacity-70">No current reservations</h3>
            <p className="text-muted-foreground mb-10 italic">A journey of a thousand miles begins with a single room.</p>
            <Button className="rounded-none font-serif tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground px-12 h-14" asChild>
              <Link href="/rooms">EXPLORE THE OPTIONS</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-card border border-border flex flex-col md:flex-row overflow-hidden shadow-xl hover:border-primary/30 transition-all">
                <div className="w-full md:w-72 h-48 md:h-auto relative">
                  <Image 
                    src={booking.room.images[0] || "/placeholder.jpg"} 
                    alt={booking.room.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-4 py-1 text-[10px] font-bold uppercase tracking-widest border border-white/20 backdrop-blur-md bg-black/40 text-white`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 p-8 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-primary mb-2 font-bold">
                        {booking.room.type} • CONFIRMED #{booking.id.toString().padStart(6, '0')}
                      </p>
                      <h3 className="font-serif text-3xl text-foreground">{booking.room.title}</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 border-y border-border/30 py-6">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-bold">Check In</p>
                      <p className="text-sm font-medium">{format(new Date(booking.checkIn), "MMM d, yyyy")}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-bold">Check Out</p>
                      <p className="text-sm font-medium">{format(new Date(booking.checkOut), "MMM d, yyyy")}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-bold">Guests</p>
                      <p className="text-sm font-medium">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-bold">Total</p>
                      <p className="text-lg font-serif text-primary font-bold tracking-tight">${booking.totalPrice}</p>
                    </div>
                  </div>

                  {booking.status === 'confirmed' && new Date(booking.checkIn) > new Date() && (
                    <div className="flex justify-end pt-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" className="rounded-none border-border border text-muted-foreground hover:bg-destructive hover:text-white hover:border-destructive text-xs tracking-widest p-5 uppercase font-serif">
                            Cancel Reservation
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-card border-border rounded-none shadow-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-serif text-2xl">Relinquish Stay?</AlertDialogTitle>
                            <AlertDialogDescription className="text-muted-foreground italic">
                              Are you sure you want to cancel your stay in the {booking.room.title}? This sanctuary will be made available to other guests.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="mt-6">
                            <AlertDialogCancel className="rounded-none h-12 border-border tracking-widest uppercase font-serif px-8">KEEP BOOKING</AlertDialogCancel>
                            <AlertDialogAction 
                              className="rounded-none h-12 bg-destructive text-destructive-foreground hover:bg-destructive/90 tracking-widest uppercase font-serif px-8"
                              onClick={() => handleCancelStatus(booking.id)}
                            >
                              YES, CANCEL
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
