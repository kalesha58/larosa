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
import { XCircle, Calendar, User, Mail, CreditCard, Search, Filter, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function AdminBookings() {
  const { data: bookings, isLoading } = useGetAllBookings();
  const cancelBooking = useCancelBooking();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleCancel = async (id: number) => {
    if (!confirm("Are you certain you want to void this reservation? This action is permanent.")) return;
    try {
      await cancelBooking.mutateAsync({ id });
      toast({ title: "Reservation Voided", description: "The booking has been successfully cancelled." });
      queryClient.invalidateQueries({ queryKey: getGetAllBookingsQueryKey() });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60 mb-2">Reservation Logs</p>
          <h1 className="font-serif text-4xl text-foreground">Global Bookings</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input className="rounded-none border-border h-10 w-64 pl-9 text-xs uppercase tracking-widest bg-secondary/5" placeholder="Search Guest Name..." />
          </div>
          <Button variant="outline" className="rounded-none h-10 px-4 uppercase tracking-widest text-[10px] font-bold border-border">
            <Filter className="mr-2 h-3 w-3" /> Filter
          </Button>
          <Button variant="outline" className="rounded-none h-10 px-4 uppercase tracking-widest text-[10px] font-bold border-border">
            <Download className="mr-2 h-3 w-3" /> Export
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 pointer-events-none" />
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
            ) : bookings?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em]">No Reservation Records Detected</p>
                </TableCell>
              </TableRow>
            ) : bookings?.map((booking: Booking) => (
              <TableRow key={booking.id} className="border-border hover:bg-secondary/10 transition-colors group">
                <TableCell className="py-6 font-mono text-[10px] text-muted-foreground font-bold pl-8">
                  #{booking.id.toString().padStart(5, '0')}
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
                      <Calendar className="h-3 w-3" /> 
                      {format(new Date(booking.checkIn), "MMM dd, yyyy")}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/80 pl-5">
                      to {format(new Date(booking.checkOut), "MMM dd, yyyy")}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={booking.status === 'confirmed' ? 'default' : 'secondary'} 
                    className={`rounded-none text-[8px] uppercase tracking-[0.2em] font-bold px-2 py-0.5 border-none ${
                    booking.status === 'confirmed' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
                  }`}>
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm font-serif font-bold text-foreground">
                      ${booking.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right pr-8">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {booking.status === 'confirmed' && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive transition-colors hover:bg-destructive/10 rounded-none h-9 w-9" 
                        onClick={() => handleCancel(booking.id)} 
                        title="Cancel Booking"
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
  );
}
