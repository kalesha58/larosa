"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, differenceInDays } from "date-fns";
import { useGetRoom, useCreateBooking } from "@/hooks/use-queries";
import { useAuth } from "@/hooks/use-auth";
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
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { use } from "react";

const bookingSchema = z.object({
  guestName: z.string().min(2, "Name is required"),
  guestEmail: z.string().email("Valid email is required"),
  guestPhone: z.string().optional(),
  specialRequests: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function BookingPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Extract dates from URL (Search Params)
  // In Next.js client component we can use useSearchParams
  const checkInStr = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get("checkIn") : null;
  const checkOutStr = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get("checkOut") : null;
  const guests = typeof window !== 'undefined' ? Number(new URLSearchParams(window.location.search).get("guests")) || 2 : 2;
  
  const checkIn = checkInStr ? new Date(checkInStr) : new Date();
  const checkOut = checkOutStr ? new Date(checkOutStr) : new Date(Date.now() + 86400000);
  const nights = Math.max(1, differenceInDays(checkOut, checkIn));

  const { data: room, isLoading: isRoomLoading } = useGetRoom(Number(roomId), {
    query: { enabled: !!roomId }
  });

  const createBooking = useCreateBooking();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guestName: user?.name || "",
      guestEmail: user?.email || "",
      guestPhone: "",
      specialRequests: "",
    },
  });

  const onSubmit = async (data: BookingFormValues) => {
    try {
      const result = await createBooking.mutateAsync({
        data: {
          roomId: Number(roomId),
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          guests,
          ...data,
        }
      });
      
      toast({
        title: "Reservation Confirmed",
        description: "Your sanctuary awaits.",
      });
      
      router.push(`/booking/confirmation/${result.id}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Reservation Failed",
        description: error.message || "Please try again later.",
      });
    }
  };

  if (isRoomLoading || !room) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 md:px-0">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-12 border-b border-border pb-6">Complete Your Reservation</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Guest Details Form */}
          <div className="order-2 lg:order-1">
            <h2 className="font-serif text-2xl text-foreground mb-6">Guest Details</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="guestName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" className="h-12 rounded-none bg-background border-border focus-visible:ring-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="guestEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" className="h-12 rounded-none bg-background border-border focus-visible:ring-primary" {...field} />
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
                        <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 000-0000" className="h-12 rounded-none bg-background border-border focus-visible:ring-primary" {...field} />
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
                      <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Special Requests</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any special requests or preferences..." 
                          className="min-h-[120px] rounded-none bg-background border-border focus-visible:ring-primary resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={createBooking.isPending}
                  className="w-full h-14 mt-8 rounded-none font-serif tracking-widest text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {createBooking.isPending ? "PROCESSING..." : "CONFIRM RESERVATION"}
                </Button>
              </form>
            </Form>
          </div>

          {/* Booking Summary */}
          <div className="order-1 lg:order-2">
            <div className="bg-card border border-border p-6 md:p-8 sticky top-32 shadow-xl">
              <h2 className="font-serif text-2xl text-foreground mb-6">Reservation Summary</h2>
              
              <div className="flex gap-4 mb-8">
                <div className="relative w-24 h-24 flex-shrink-0">
                   <Image src={room.images[0] || "/placeholder.jpg"} alt={room.title} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary mb-1">{room.type}</p>
                  <h3 className="font-serif text-xl text-foreground">{room.title}</h3>
                </div>
              </div>

              <div className="space-y-4 mb-8 border-y border-border py-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Check-in</p>
                    <p className="text-foreground">{format(checkIn, "EEE, MMM d, yyyy")}</p>
                    <p className="text-sm text-muted-foreground">After 3:00 PM</p>
                  </div>
                  <div className="w-px h-12 bg-border mx-4" />
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Check-out</p>
                    <p className="text-foreground">{format(checkOut, "EEE, MMM d, yyyy")}</p>
                    <p className="text-sm text-muted-foreground">Before 11:00 AM</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Length of Stay</span>
                  <span className="text-foreground">{nights} {nights === 1 ? "Night" : "Nights"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guests</span>
                  <span className="text-foreground">{guests} {guests === 1 ? "Guest" : "Guests"}</span>
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t border-border/50">
                  <span className="text-muted-foreground">Room Rate (${room.price} x {nights})</span>
                  <span className="text-foreground">${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes & Fees</span>
                  <span className="text-foreground">${taxes}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-border flex justify-between items-end font-serif">
                <span className="text-xl text-muted-foreground">Total</span>
                <span className="text-3xl text-primary font-bold">${total}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
