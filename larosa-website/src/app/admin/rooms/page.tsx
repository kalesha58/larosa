"use client";

import { useState } from "react";
import {
  useGetRooms,
  useCreateRoom,
  useUpdateRoom,
  useDeleteRoom,
  useSyncRoom,
  getGetRoomsQueryKey,
  type Room,
} from "@/hooks/use-queries";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Edit,
  Plus,
  Trash2,
  Bed,
  Users,
  Layers,
  Star,
  RefreshCw,
  Copy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const roomSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.string(),
  price: z.coerce.number().min(1, "Price must be at least 1"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  totalRooms: z.coerce.number().min(1, "Total inventory must be at least 1"),
  featured: z.boolean(),
  images: z.string().min(1, "Images are required"),
  amenities: z.string().min(1, "Amenities are required"),
  airbnbIcalUrl: z.string().optional(),
  syncEnabled: z.boolean(),
  regenerateExportToken: z.boolean(),
});

type RoomFormValues = {
  title: string;
  description: string;
  type: string;
  price: number;
  capacity: number;
  totalRooms: number;
  featured: boolean;
  images: string;
  amenities: string;
  airbnbIcalUrl: string;
  syncEnabled: boolean;
  regenerateExportToken: boolean;
};

function RoomSyncButton({ roomId }: { roomId: number }) {
  const sync = useSyncRoom(roomId);
  const { toast } = useToast();
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-8 rounded-lg text-[9px] uppercase tracking-widest font-bold gap-1"
      disabled={sync.isPending}
      onClick={async () => {
        try {
          const r = await sync.mutateAsync();
          toast({
            title: r.success ? "Airbnb sync complete" : "Sync finished",
            description: r.error
              ? r.error
              : `Imported ${r.imported}, removed ${r.removed}`,
          });
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "Sync failed";
          toast({ variant: "destructive", title: "Sync failed", description: msg });
        }
      }}
    >
      <RefreshCw className={`h-3 w-3 ${sync.isPending ? "animate-spin" : ""}`} />
      Sync
    </Button>
  );
}

function CopyExportUrlButton({ room }: { room: Room }) {
  const { toast } = useToast();
  if (!room.calendarExportUrl) return null;
  const full =
    typeof window !== "undefined"
      ? `${window.location.origin}${room.calendarExportUrl}`
      : room.calendarExportUrl;
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-8 px-2 text-[9px] uppercase tracking-widest"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(full);
          toast({ title: "Copied", description: "Website iCal URL copied for Airbnb import." });
        } catch {
          toast({ variant: "destructive", title: "Copy failed" });
        }
      }}
    >
      <Copy className="h-3 w-3 mr-1" />
      iCal URL
    </Button>
  );
}

export default function AdminRooms() {
  const { data: rooms, isLoading } = useGetRooms();
  const createRoom = useCreateRoom();
  const updateRoom = useUpdateRoom();
  const deleteRoom = useDeleteRoom();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema) as Resolver<RoomFormValues>,
    defaultValues: {
      title: "",
      description: "",
      type: "Standard",
      price: 100,
      capacity: 2,
      totalRooms: 5,
      featured: false,
      images: "",
      amenities: "",
      airbnbIcalUrl: "",
      syncEnabled: true,
      regenerateExportToken: false,
    },
  });

  const handleEdit = (room: Room) => {
    setEditingId(room.id);
    form.reset({
      title: room.title,
      description: room.description,
      type: room.type,
      price: room.price,
      capacity: room.capacity,
      totalRooms: room.totalRooms,
      featured: room.featured ?? false,
      images: room.images.join(", "),
      amenities: room.amenities.join(", "),
      airbnbIcalUrl: room.airbnbIcalUrl ?? "",
      syncEnabled: room.syncEnabled ?? true,
      regenerateExportToken: false,
    });
    setOpen(true);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setEditingId(null);
      form.reset();
    }
    setOpen(newOpen);
  };

  const onSubmit = async (values: RoomFormValues) => {
    const data = {
      title: values.title,
      description: values.description,
      type: values.type,
      price: values.price,
      capacity: values.capacity,
      totalRooms: values.totalRooms,
      featured: values.featured,
      images: values.images.split(",").map((s) => s.trim()).filter(Boolean),
      amenities: values.amenities.split(",").map((s) => s.trim()).filter(Boolean),
      airbnbIcalUrl: values.airbnbIcalUrl.trim() || undefined,
      syncEnabled: values.syncEnabled,
      regenerateExportToken: values.regenerateExportToken,
    };

    try {
      if (editingId) {
        await updateRoom.mutateAsync({ id: editingId, data });
        toast({
          title: "Inventory Updated",
          description: `${values.title} has been successfully modified.`,
        });
      } else {
        await createRoom.mutateAsync({ data });
        toast({
          title: "New Asset Registered",
          description: `${values.title} added to listing.`,
        });
      }
      queryClient.invalidateQueries({ queryKey: getGetRoomsQueryKey() });
      setOpen(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast({ variant: "destructive", title: "Operation Failed", description: message });
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "Are you certain you want to decommission this room? This action cannot be reversed."
      )
    )
      return;
    try {
      await deleteRoom.mutateAsync({ id });
      toast({
        title: "Asset Decommissioned",
        description: "The room listing has been removed from the catalog.",
      });
      queryClient.invalidateQueries({ queryKey: getGetRoomsQueryKey() });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast({ variant: "destructive", title: "Error", description: message });
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60 mb-2">
            Inventory Management
          </p>
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
              <DialogTitle className="font-serif text-3xl">
                {editingId ? "Modify Asset" : "New Inventory Item"}
              </DialogTitle>
              <DialogDescription className="text-xs uppercase tracking-widest mt-1">
                Fill in the details for the luxury room listing
              </DialogDescription>
            </DialogHeader>
            <div className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold uppercase tracking-widest">
                            Room Title
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="rounded-xl border-border h-11 focus:ring-1 ring-primary"
                              placeholder="e.g. Imperial Suite"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold uppercase tracking-widest">
                            Category
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-border h-11">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl border-border">
                              <SelectItem value="Standard">Standard</SelectItem>
                              <SelectItem value="Deluxe">Deluxe</SelectItem>
                              <SelectItem value="Suite">Suite</SelectItem>
                              <SelectItem value="Presidential">Presidential</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-primary">
                            Base Price / Night
                          </FormLabel>
                          <FormControl>
                            <Input type="number" className="rounded-xl border-border h-11" {...field} />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold uppercase tracking-widest">
                            Max Guests
                          </FormLabel>
                          <FormControl>
                            <Input type="number" className="rounded-xl border-border h-11" {...field} />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="totalRooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold uppercase tracking-widest">
                            Physical Inventory
                          </FormLabel>
                          <FormControl>
                            <Input type="number" className="rounded-xl border-border h-11" {...field} />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between border border-border p-5 bg-secondary/10 rounded-xl">
                          <div className="space-y-0.5">
                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest">
                              Featured Status
                            </FormLabel>
                            <FormDescription className="text-[9px] uppercase tracking-wider">
                              Showcase on homepage
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest">
                          Asset Narration
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            className="rounded-xl border-border resize-none h-24"
                            placeholder="Describe the luxury experience..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold uppercase tracking-widest">
                            Image Portfolio (URLs)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className="rounded-xl border-border resize-none h-24 font-mono text-[10px]"
                              placeholder="url1, url2..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-[9px] uppercase tracking-wider">
                            Comma separated URLs
                          </FormDescription>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="amenities"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold uppercase tracking-widest">
                            Luxury Features
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className="rounded-xl border-border h-24 font-mono text-[10px]"
                              placeholder="WiFi, AC, Minibar..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-[9px] uppercase tracking-wider">
                            Comma separated list
                          </FormDescription>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="border border-border rounded-xl p-6 space-y-6 bg-secondary/5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/80">
                      Airbnb calendar sync
                    </p>
                    <FormField
                      control={form.control}
                      name="airbnbIcalUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold uppercase tracking-widest">
                            Airbnb export URL (private .ics)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className="rounded-xl border-border font-mono text-[10px] min-h-[72px]"
                              placeholder="https://www.airbnb.com/calendar/ical/…"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-[9px]">
                            Paste the private calendar link from Airbnb. It is stored server-side only.
                          </FormDescription>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="syncEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between border border-border p-4 rounded-xl bg-card">
                          <div>
                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest">
                              Enable automatic import
                            </FormLabel>
                            <FormDescription className="text-[9px]">
                              Vercel runs a daily import when enabled (use Sync for immediate updates).
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {editingId ? (
                      <FormField
                        control={form.control}
                        name="regenerateExportToken"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between border border-border p-4 rounded-xl bg-card">
                            <div>
                              <FormLabel className="text-[10px] font-bold uppercase tracking-widest">
                                Regenerate website iCal secret
                              </FormLabel>
                              <FormDescription className="text-[9px]">
                                Invalidates the old export URL; update Airbnb after saving.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ) : null}
                  </div>

                  <div className="pt-4 flex gap-4">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleOpenChange(false)}
                      className="flex-1 rounded-xl uppercase tracking-widest text-[10px] h-12 font-bold"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-[2] rounded-xl bg-primary hover:bg-primary/90 h-12 uppercase tracking-widest text-[10px] font-bold shadow-lg shadow-primary/20"
                    >
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
          <FormHeaderRow />
          <TableBody>
            {isLoading ? (
              <TableRow key="loading">
                <TableCell colSpan={6} className="h-48 text-center text-muted-foreground animate-pulse">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-4 w-4 border-2 border-primary border-t-transparent animate-spin rounded-full" />
                    <span className="text-[10px] uppercase font-bold tracking-[0.3em]">
                      Syncing Repository
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : rooms?.length === 0 ? (
              <TableRow key="empty">
                <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em]">No Room Data Detected</p>
                </TableCell>
              </TableRow>
            ) : (
              rooms?.map((room: Room, index: number) => (
                <TableRow key={room.id || index} className="border-border hover:bg-secondary/10 transition-colors group">
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
                        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                          {room.type}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users size={12} />
                        <span className="text-[10px] font-semibold tracking-wider font-mono">
                          CAPACITY: {room.capacity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Layers size={12} />
                        <span className="text-[10px] font-semibold tracking-wider font-mono">
                          SQ FT: {room.sizeSqFt || 450}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 text-primary">
                        <span className="text-sm font-bold font-serif">₹{room.price}</span>
                      </div>
                      <span className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground">
                        per night
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="rounded-lg border-primary/20 bg-primary/5 text-primary text-[9px] uppercase tracking-widest font-bold px-2 py-0.5"
                    >
                      {room.totalRooms} Units
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <Badge variant="secondary" className="w-fit text-[8px] uppercase tracking-widest">
                        {room.syncStatus ?? "idle"}
                      </Badge>
                      <span className="text-[9px] text-muted-foreground">
                        {room.lastSyncedAt
                          ? format(new Date(room.lastSyncedAt), "MMM d, HH:mm")
                          : "Never synced"}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        <RoomSyncButton roomId={room.id} />
                        <CopyExportUrlButton room={room} />
                      </div>
                    </div>
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function FormHeaderRow() {
  return (
    <TableHeader className="bg-secondary/20">
      <TableRow className="border-border hover:bg-transparent">
        <TableHead className="w-[240px] text-[10px] font-bold uppercase tracking-widest h-14">
          Room Identity
        </TableHead>
        <TableHead className="text-[10px] font-bold uppercase tracking-widest">Specification</TableHead>
        <TableHead className="text-[10px] font-bold uppercase tracking-widest text-primary">Financials</TableHead>
        <TableHead className="text-[10px] font-bold uppercase tracking-widest">Inventory</TableHead>
        <TableHead className="text-[10px] font-bold uppercase tracking-widest min-w-[140px]">
          Calendar sync
        </TableHead>
        <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest pr-8">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
