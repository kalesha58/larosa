"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Search,
  Filter,
  Check
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

const mockNotifications = [
  {
    id: 1,
    type: "booking",
    title: "New Reservation: Alexander Sterling",
    description: "New booking for Imperial Suite (Apr 20 - Apr 25)",
    time: new Date(),
    read: false,
    priority: "high"
  },
  {
    id: 2,
    type: "maintenance",
    title: "Maintenance Alert: HVAC System",
    description: "Routine filter change required for Room 204.",
    time: new Date(Date.now() - 3600000 * 2),
    read: false,
    priority: "medium"
  },
  {
    id: 3,
    type: "payment",
    title: "Payment Received: $1,250.00",
    description: "Full payment confirmed for Booking #10425.",
    time: new Date(Date.now() - 3600000 * 5),
    read: true,
    priority: "low"
  },
  {
    id: 4,
    type: "booking",
    title: "Reservation Modified: Isabella Vance",
    description: "Dates changed for Booking #10426.",
    time: new Date(Date.now() - 3600000 * 12),
    read: true,
    priority: "medium"
  },
  {
    id: 5,
    type: "system",
    title: "System Update Complete",
    description: "Larosa Terminal updated to v2.4.1. Check release notes.",
    time: new Date(Date.now() - 86400000),
    read: true,
    priority: "low"
  }
];

export default function AdminNotifications() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60 mb-2">Internal Alerts</p>
          <h1 className="font-serif text-4xl text-foreground">Notification Center</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl h-10 px-4 uppercase tracking-widest text-[10px] font-bold border-border">
            Mark all as read
          </Button>
          <Button className="rounded-xl bg-primary hover:bg-primary/90 h-10 px-6 uppercase tracking-widest text-[10px] font-bold">
            Alert Settings
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Search & Filter */}
        <div className="flex items-center gap-4 py-4 border-y border-border/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input className="rounded-xl border-border h-10 pl-10 text-xs uppercase tracking-widest bg-secondary/5" placeholder="Search alerts..." />
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="rounded-xl border-primary bg-primary/5 text-primary text-[10px] uppercase tracking-widest px-3 py-1 font-bold cursor-pointer">All</Badge>
            <Badge variant="outline" className="rounded-xl border-border text-muted-foreground text-[10px] uppercase tracking-widest px-3 py-1 font-bold cursor-pointer hover:border-primary/50">Unread</Badge>
            <Badge variant="outline" className="rounded-xl border-border text-muted-foreground text-[10px] uppercase tracking-widest px-3 py-1 font-bold cursor-pointer hover:border-primary/50">Bookings</Badge>
            <Badge variant="outline" className="rounded-xl border-border text-muted-foreground text-[10px] uppercase tracking-widest px-3 py-1 font-bold cursor-pointer hover:border-primary/50">System</Badge>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {mockNotifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-6 border border-border flex gap-6 relative group transition-all duration-300 hover:shadow-lg rounded-2xl ${notif.read ? 'bg-card/40 opacity-80' : 'bg-card shadow-md border-l-4 border-l-primary'}`}
            >
              <div className={`h-12 w-12 flex items-center justify-center shrink-0 rounded-xl ${
                notif.type === 'booking' ? 'bg-blue-500/10 text-blue-500' :
                notif.type === 'maintenance' ? 'bg-amber-500/10 text-amber-500' :
                notif.type === 'payment' ? 'bg-emerald-500/10 text-emerald-500' :
                'bg-slate-500/10 text-slate-500'
              }`}>
                {notif.type === 'booking' && <Calendar size={20} />}
                {notif.type === 'maintenance' && <AlertTriangle size={20} />}
                {notif.type === 'payment' && <CheckCircle2 size={20} />}
                {notif.type === 'system' && <MessageSquare size={20} />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg leading-tight">{notif.title}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{format(notif.time, "h:mm a · MMM dd")}</span>
                </div>
                <p className="text-sm text-muted-foreground max-w-2xl">{notif.description}</p>
                <div className="flex items-center gap-4 pt-2">
                   <div className="flex items-center gap-1.5 pt-1">
                      <div className={`h-1.5 w-1.5 rounded-full ${
                        notif.priority === 'high' ? 'bg-rose-500' :
                        notif.priority === 'medium' ? 'bg-amber-500' :
                        'bg-slate-400'
                      }`} />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{notif.priority} Priority</span>
                   </div>
                </div>
              </div>

              {!notif.read && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-start">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-xl hover:bg-primary/10 hover:text-primary">
                    <Check size={16} />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="py-12 flex justify-center">
            <Button variant="outline" className="rounded-xl uppercase tracking-widest text-[10px] font-bold h-12 px-12 border-border/50 text-muted-foreground hover:text-foreground">
              Load Archive
            </Button>
        </div>
      </div>
    </div>
  );
}
