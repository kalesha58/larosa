"use client";

import { useState } from "react";
import {
  useGetRooms,
  useCreateRoom,
  useUpdateRoom,
  useDeleteRoom,
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
import { Edit, Plus, Trash2 } from "lucide-react";
const roomSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  type: z.string(),
  price: z.coerce.number().min(1),
  capacity: z.coerce.number().min(1),
  totalRooms: z.coerce.number().min(1),
  featured: z.boolean(),
  images: z.string().min(1, "Images are required"),
  amenities: z.string().min(1, "Amenities are required"),
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
};

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
    }
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
      ...values,
      images: values.images.split(",").map(s => s.trim()),
      amenities: values.amenities.split(",").map(s => s.trim()),
    };

    try {
      if (editingId) {
        await updateRoom.mutateAsync({ id: editingId, data });
        toast({ title: "Room Updated" });
      } else {
        await createRoom.mutateAsync({ data });
        toast({ title: "Room Created" });
      }
      queryClient.invalidateQueries({ queryKey: getGetRoomsQueryKey() });
      setOpen(false);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteRoom.mutateAsync({ id });
      toast({ title: "Room Deleted" });
      queryClient.invalidateQueries({ queryKey: getGetRoomsQueryKey() });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="font-serif text-3xl text-foreground">Room Management</h1>
        
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="rounded-none bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" /> ADD ROOM
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border rounded-none">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">{editingId ? "Edit Room" : "Add New Room"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Title</FormLabel><FormControl><Input className="rounded-none border-border" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger className="rounded-none border-border"><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="Deluxe">Deluxe</SelectItem>
                          <SelectItem value="Suite">Suite</SelectItem>
                          <SelectItem value="Presidential">Presidential</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem><FormLabel>Price / Night</FormLabel><FormControl><Input type="number" className="rounded-none border-border" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="capacity" render={({ field }) => (
                    <FormItem><FormLabel>Capacity</FormLabel><FormControl><Input type="number" className="rounded-none border-border" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="totalRooms" render={({ field }) => (
                    <FormItem><FormLabel>Total Inventory</FormLabel><FormControl><Input type="number" className="rounded-none border-border" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="featured" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
                      <div className="space-y-0.5"><FormLabel>Featured</FormLabel></div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea className="rounded-none border-border resize-none" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="images" render={({ field }) => (
                  <FormItem><FormLabel>Images (comma separated URLs)</FormLabel><FormControl><Textarea className="rounded-none border-border resize-none" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="amenities" render={({ field }) => (
                  <FormItem><FormLabel>Amenities (comma separated)</FormLabel><FormControl><Input className="rounded-none border-border" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="w-full rounded-none bg-primary hover:bg-primary/90">{editingId ? "UPDATE" : "CREATE"}</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-none shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Inv.</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>
            ) : rooms?.map((room: Room) => (
              <TableRow key={room.id} className="border-border">
                <TableCell className="font-medium">{room.title}</TableCell>
                <TableCell>{room.type}</TableCell>
                <TableCell>${room.price}</TableCell>
                <TableCell>{room.totalRooms}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(room)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(room.id)}><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
