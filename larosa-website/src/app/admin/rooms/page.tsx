"use client";

import Link from "next/link";
import {
  useGetRooms,
  useDeleteRoom,
  type Room,
} from "@/hooks/use-queries";
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
import { useToast } from "@/hooks/use-toast";
import { Edit, Plus, Trash2, Bed, Users, Layers, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { statusStyles } from "@/lib/admin-status-styles";

export default function AdminRooms() {
  const { data: rooms, isLoading } = useGetRooms({ admin: true });
  const deleteRoom = useDeleteRoom();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you certain you want to decommission this villa? This action cannot be reversed."
      )
    )
      return;
    try {
      await deleteRoom.mutateAsync({ id });
      toast({
        title: "Asset decommissioned",
        description: "The villa has been removed from the catalog.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Delete failed",
      });
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col justify-between gap-6 border-b border-border/50 pb-6 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60">
            Inventory Management
          </p>
          <h1 className="font-serif text-4xl text-foreground">Room Catalog</h1>
        </div>

        <Button
          asChild
          className="h-12 rounded-xl bg-primary px-8 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
        >
          <Link href="/admin/rooms/new">
            <Plus className="mr-2 h-4 w-4" /> Register New Villa
          </Link>
        </Button>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="pointer-events-none absolute inset-0 bg-admin-grid" />
        <Table>
          <TableHeader className="bg-secondary/20">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="h-14 w-[300px] text-[10px] font-bold uppercase tracking-widest">
                Property Identity
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                Specification
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-primary">
                Financials
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                Availability
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                Status
              </TableHead>
              <TableHead className="pr-8 text-right text-[10px] font-bold uppercase tracking-widest">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-48 animate-pulse text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                      Syncing repository
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : rooms?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-48 text-center text-muted-foreground"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
                    No villas yet
                  </p>
                  <Button asChild variant="link" className="mt-2">
                    <Link href="/admin/rooms/new">Register your first villa</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              rooms?.map((room: Room) => (
                <TableRow
                  key={room.id}
                  className="group border-border transition-colors hover:bg-secondary/10"
                >
                  <TableCell className="py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-secondary/30 text-primary">
                        {room.featured && (
                          <div className="absolute -right-1 -top-1 rounded-full bg-primary p-1 text-primary-foreground shadow-md">
                            <Star className="h-2 w-2 fill-current" />
                          </div>
                        )}
                        <Bed
                          size={20}
                          className="transition-transform group-hover:scale-110"
                        />
                      </div>
                      <div>
                        <p className="mb-1 font-serif text-lg leading-tight">
                          {room.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            {room.type}
                          </p>
                          <Badge
                            variant="outline"
                            className="h-4 border-primary/20 bg-primary/5 px-1 text-[8px] uppercase tracking-widest text-primary/70"
                          >
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
                        <span className="font-mono text-[10px] font-semibold tracking-wider">
                          CAPACITY: {room.capacity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Layers size={12} />
                        <span className="font-mono text-[10px] font-semibold tracking-wider">
                          SQ FT: {room.sizeSqFt || 450}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 text-primary">
                        <span className="font-serif text-sm font-bold">
                          ₹{room.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                        per night
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="rounded-lg border-primary/20 bg-primary/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary"
                    >
                      {room.totalRooms} Units available
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={room.status === "active" ? "default" : "secondary"}
                      className={cn(
                        "rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest",
                        room.status === "active"
                          ? cn(statusStyles.success.border, statusStyles.success.bg, statusStyles.success.text)
                          : cn(statusStyles.neutral.border, statusStyles.neutral.bg, statusStyles.neutral.text)
                      )}
                    >
                      {room.status === "active" ? "Public" : "Hidden"}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-8 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-9 w-9 rounded-xl text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        <Link href={`/admin/rooms/${room.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
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
