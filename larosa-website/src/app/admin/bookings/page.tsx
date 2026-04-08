"use client";

import {
  useGetAllBookings,
  useCancelBooking,
  getGetAllBookingsQueryKey,
  type Booking,
} from "@/hooks/use-queries";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
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
import { XCircle } from "lucide-react";

export default function AdminBookings() {
  const { data: bookings, isLoading } = useGetAllBookings();
  const cancelBooking = useCancelBooking();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleCancel = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await cancelBooking.mutateAsync({ id });
      toast({ title: "Booking Cancelled" });
      queryClient.invalidateQueries({ queryKey: getGetAllBookingsQueryKey() });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl text-foreground">All Reservations</h1>

      <div className="bg-card border border-border rounded-none shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>ID</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center">Loading...</TableCell></TableRow>
            ) : bookings?.map((booking: Booking) => (
              <TableRow key={booking.id} className="border-border">
                <TableCell className="font-medium text-muted-foreground">#{booking.id.toString().padStart(5, '0')}</TableCell>
                <TableCell>
                  <div className="font-medium">{booking.guestName}</div>
                  <div className="text-xs text-muted-foreground">{booking.guestEmail}</div>
                </TableCell>
                <TableCell>{booking.room.title}</TableCell>
                <TableCell className="text-xs">
                  {format(new Date(booking.checkIn), "MMM d, yyyy")} - <br/>
                  {format(new Date(booking.checkOut), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs uppercase tracking-wider font-medium ${
                    booking.status === 'confirmed' ? 'text-primary' : 
                    booking.status === 'cancelled' ? 'text-destructive' : 
                    'text-muted-foreground'
                  }`}>
                    {booking.status}
                  </span>
                </TableCell>
                <TableCell className="font-serif">${booking.totalPrice}</TableCell>
                <TableCell className="text-right">
                  {booking.status === 'confirmed' && new Date(booking.checkIn) > new Date() && (
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleCancel(booking.id)} title="Cancel Booking">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
