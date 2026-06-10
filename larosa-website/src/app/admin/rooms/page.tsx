"use client";

import { useState } from "react";
import {
  useGetRooms,
  useCreateRoom,
  useUpdateRoom,
  useDeleteRoom,
  type Room,
} from "@/hooks/use-queries";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Edit, Plus, Trash2, Bed, Users, Layers, Star, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RoomImageUpload } from "@/components/admin/RoomImageUpload";

const roomSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  category: z.enum(["room", "villa"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.string(),
  price: z.coerce.number().min(1, "Price must be at least 1"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  totalRooms: z.coerce.number().min(1, "Total inventory must be at least 1"),
  featured: z.boolean(),
  status: z.enum(["active", "hidden"]),
  images: z.array(z.string()).min(1, "At least one image is required"),
  amenities: z.string().min(1, "Amenities are required"),
  airbnbCalendarUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type RoomFormValues = {
  title: string;
  category: "room" | "villa";
  description: string;
  type: string;
  price: number;
  capacity: number;
  totalRooms: number;
  featured: boolean;
  status: "active" | "hidden";
  images: string[];
  amenities: string;
  airbnbCalendarUrl?: string;
};

export default function AdminRooms() {
  const { data: rooms, isLoading } = useGetRooms({ admin: true });
  const createRoom = useCreateRoom();
  const updateRoom = useUpdateRoom();
  const deleteRoom = useDeleteRoom();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCalendarUrl, setEditingCalendarUrl] = useState<string>("");

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema) as Resolver<RoomFormValues>,
    defaultValues: {
      title: "",
      category: "room",
      description: "",
      type: "Standard",
      price: 100,
      capacity: 2,
      totalRooms: 5,
      featured: false,
      status: "active",
      images: [],
      amenities: "",
      airbnbCalendarUrl: "",
    }
  });

  const handleEdit = (room: Room) => {
    setEditingId(room.id);
    setEditingCalendarUrl(room.calendarExportUrl ?? "");
    form.reset({
      title: room.title,
      category: room.category ?? "room",
      description: room.description,
      type: room.type,
      price: room.price,
      capacity: room.capacity,
      totalRooms: room.totalRooms,
      featured: room.featured ?? false,
      status: room.status ?? "active",
      images: room.images,
      amenities: room.amenities.join(", "),
      airbnbCalendarUrl: room.airbnbCalendarUrl || "",
    });
    setOpen(true);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setEditingId(null);
      setEditingCalendarUrl("");
      form.reset();
    }
    setOpen(newOpen);
  };

  const onSubmit = async (values: RoomFormValues) => {
    const data = {
      ...values,
      amenities: values.amenities.split(",").map(s => s.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        await updateRoom.mutateAsync({ id: editingId, data });
        toast({ title: "Inventory Updated", description: `${values.title} has been successfully modified.` });
      } else {
        await createRoom.mutateAsync({ data });
        toast({ title: "New Asset Registered", description: `${values.title} added to listing.` });
      }
      setOpen(false);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Operation Failed", description: error.message });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you certain you want to decommission this room? This action cannot be reversed.")) return;
    try {
      await deleteRoom.mutateAsync({ id });
      toast({ title: "Asset Decommissioned", description: "The room listing has been removed from the catalog." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60 mb-2">Inventory Management</p>
          <h1 className="font-serif text-4xl text-foreground">Room Catalog</h1>
        </div>
        
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 uppercase tracking-widest text-xs font-bold shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" /> Register New Room
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border rounded-2xl shadow-2xl p-0">
            <DialogHeader className="p-8 pb-4 border-b border-border/50">
              <DialogTitle className="font-serif text-3xl">{editingId ? "Modify Asset" : "New Inventory Item"}</DialogTitle>
              <DialogDescription className="text-xs uppercase tracking-widest mt-1">Fill in the details for the luxury room listing</DialogDescription>
            </DialogHeader>
            <div className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField control={form.control} name="title" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Property Title</FormLabel>
                        <FormControl><Input className="rounded-xl border-border h-11 focus:ring-1 ring-primary" placeholder="e.g. Imperial Suite" {...field} /></FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="category" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Property Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger className="rounded-xl border-border h-11"><SelectValue placeholder="Select category" /></SelectTrigger></FormControl>
                          <SelectContent className="rounded-xl border-border">
                            <SelectItem value="room">Hotel Room</SelectItem>
                            <SelectItem value="villa">Private Villa</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="type" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger className="rounded-xl border-border h-11"><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                          <SelectContent className="rounded-xl border-border">
                            <SelectItem value="Standard">Standard</SelectItem>
                            <SelectItem value="Deluxe">Deluxe</SelectItem>
                            <SelectItem value="Suite">Suite</SelectItem>
                            <SelectItem value="Presidential">Presidential</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="price" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-primary">Base Price / Night</FormLabel>
                        <FormControl><Input type="number" className="rounded-xl border-border h-11" {...field} /></FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="capacity" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Max Guests</FormLabel>
                        <FormControl><Input type="number" className="rounded-xl border-border h-11" {...field} /></FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="totalRooms" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Physical Inventory</FormLabel>
                        <FormControl><Input type="number" className="rounded-xl border-border h-11" {...field} /></FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="featured" render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between border border-border p-5 bg-secondary/10 rounded-xl">
                        <div className="space-y-0.5">
                          <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Featured Status</FormLabel>
                          <FormDescription className="text-[9px] uppercase tracking-wider">Showcase on homepage</FormDescription>
                        </div>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="status" render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between border border-border p-5 bg-secondary/10 rounded-xl">
                        <div className="space-y-0.5">
                          <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Visibility Status</FormLabel>
                          <FormDescription className="text-[9px] uppercase tracking-wider">Hide or Show from public</FormDescription>
                        </div>
                        <FormControl>
                          <Switch 
                            checked={field.value === "active"} 
                            onCheckedChange={(checked) => field.onChange(checked ? "active" : "hidden")} 
                          />
                        </FormControl>
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Asset Narration</FormLabel>
                      <FormControl><Textarea className="rounded-xl border-border resize-none h-24" placeholder="Describe the luxury experience..." {...field} /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField control={form.control} name="images" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Image Portfolio</FormLabel>
                        <FormControl>
                          <RoomImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            roomId={editingId ?? undefined}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="amenities" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Luxury Features</FormLabel>
                        <FormControl><Textarea className="rounded-xl border-border h-24 font-mono text-[10px]" placeholder="WiFi, AC, Minibar..." {...field} /></FormControl>
                        <FormDescription className="text-[9px] uppercase tracking-wider">Comma separated list</FormDescription>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )} />
                  </div>

                  {/* Calendar Sync Section */}
                  <div className="p-6 border border-primary/20 bg-primary/5 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary">Channel Manager (iCal Sync)</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="airbnbCalendarUrl" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Airbnb Import URL</FormLabel>
                          <FormControl><Input className="rounded-xl border-border h-11 bg-background" placeholder="https://www.airbnb.com/calendar/ical/..." {...field} value={field.value || ""} /></FormControl>
                          <FormDescription className="text-[9px] uppercase tracking-wider">Paste the Airbnb iCal export link here</FormDescription>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )} />

                      {editingId && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest">Larosa Export URL</label>
                          <div className="flex gap-2">
                            <Input 
                              readOnly 
                              value={editingCalendarUrl || `${typeof window !== "undefined" ? window.location.origin : ""}/api/rooms/${editingId}/calendar.ics`} 
                              className="rounded-xl border-border h-11 bg-background font-mono text-[9px] truncate"
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              className="h-11 rounded-xl px-4 text-[10px] font-bold uppercase"
                              onClick={() => {
                                const url = editingCalendarUrl || `${window.location.origin}/api/rooms/${editingId}/calendar.ics`;
                                navigator.clipboard.writeText(url);
                                toast({ title: "URL Copied", description: "Paste this into Airbnb's 'Import Calendar' setting." });
                              }}
                            >
                              Copy
                            </Button>
                          </div>
                          <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Provide this link to Airbnb to block dates</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <Button variant="outline" type="button" onClick={() => handleOpenChange(false)} className="flex-1 rounded-xl uppercase tracking-widest text-[10px] h-12 font-bold">Cancel</Button>
                    <Button type="submit" className="flex-[2] rounded-xl bg-primary hover:bg-primary/90 h-12 uppercase tracking-widest text-[10px] font-bold shadow-lg shadow-primary/20">
                      {editingId ? "Complete Update" : "Register Room"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border shadow-2xl relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-grid-white/5 pointer-events-none" />
        <Table>
          <TableHeader className="bg-secondary/20">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[300px] text-[10px] font-bold uppercase tracking-widest h-14">Property Identity</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Specification</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-primary">Financials</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Availability</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Status</TableHead>
              <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground animate-pulse">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-4 w-4 border-2 border-primary border-t-transparent animate-spin rounded-full" />
                    <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Syncing Repository</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : rooms?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em]">No Room Data Detected</p>
                </TableCell>
              </TableRow>
            ) : rooms?.map((room: Room) => (
              <TableRow key={room.id} className="border-border hover:bg-secondary/10 transition-colors group">
                <TableCell className="py-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-secondary/30 border border-border flex items-center justify-center text-primary relative rounded-xl">
                      {room.featured && (
                        <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground p-1 shadow-md rounded-full">
                          <Star className="h-2 w-2 fill-current" />
                        </div>
                      )}
                      <Bed size={20} className="group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <p className="font-serif text-lg leading-tight mb-1">{room.title}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{room.type}</p>
                        <Badge variant="outline" className="text-[8px] uppercase tracking-widest h-4 px-1 bg-primary/5 text-primary/70 border-primary/20">
                          {room.category ?? "room"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users size={12} />
                      <span className="text-[10px] font-semibold tracking-wider font-mono">CAPACITY: {room.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Layers size={12} />
                      <span className="text-[10px] font-semibold tracking-wider font-mono">SQ FT: {room.sizeSqFt || 450}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-primary">
                      <span className="text-sm font-bold font-serif">₹{room.price}</span>
                    </div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground">per night</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-lg border-primary/20 bg-primary/5 text-primary text-[9px] uppercase tracking-widest font-bold px-2 py-0.5">
                    {room.totalRooms} Units available
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={room.status === "active" ? "default" : "secondary"} 
                    className={cn(
                      "rounded-lg text-[9px] uppercase tracking-widest font-bold px-2 py-0.5",
                      room.status === "active" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                    )}
                  >
                    {room.status === "active" ? "Public" : "Hidden"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-8">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEdit(room)}
                      className="h-9 w-9 text-muted-foreground hover:text-primary transition-colors hover:bg-primary/10 rounded-xl"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 text-muted-foreground hover:text-destructive transition-colors hover:bg-destructive/10 rounded-xl" 
                      onClick={() => handleDelete(room.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
