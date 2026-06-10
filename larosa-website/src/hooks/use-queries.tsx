"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { cloneInitialRooms, type Room } from "@/lib/room-catalog";
import type { AdminCalendarBooking } from "@/lib/booking-calendar-events";

export type { AdminCalendarBooking } from "@/lib/booking-calendar-events";

export type { Room } from "@/lib/room-catalog";

export interface AdminStats {
  totalRevenue: number;
  occupancyRate: number;
  confirmedBookings: number;
  cancelledBookings: number;
}

export interface RevenueMonth {
  month: string;
  revenue: number;
}

export interface RoomUpsertInput {
  title: string;
  category: "room" | "villa";
  description: string;
  type: string;
  price: number;
  capacity: number;
  totalRooms: number;
  featured?: boolean;
  status?: "active" | "hidden";
  images: string[];
  amenities: string[];
}

export interface Booking {
  id: string;
  roomId: string;
  room: {
    id: string;
    title: string;
    type: string;
  };
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalPrice: number;
  pricePerNight?: number;
  status: "confirmed" | "cancelled" | "pending";
  specialRequests?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt?: string;
}


export interface AvailabilityRange {
  checkIn: string;
  checkOut: string;
}

// ── Room queries — REAL API ────────────────────────────────────────────────
export interface RoomListFilters {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
}


export function useGetRooms(filters?: RoomListFilters & { admin?: boolean }) {
  return useQuery({
    queryKey: ["rooms", "list", filters ?? {}],
    queryFn: async (): Promise<Room[]> => {
      const params = new URLSearchParams();
      if (filters?.type && filters.type !== "all") params.append("type", filters.type);
      if (filters?.admin) params.append("admin", "true");
      
      const res = await fetch(`/api/rooms?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch rooms");
      let list = await res.json() as Room[];

      // Client-side filtering for price and capacity if needed, though better in API
      if (typeof filters?.minPrice === "number") list = list.filter(r => r.price >= filters.minPrice!);
      if (typeof filters?.maxPrice === "number") list = list.filter(r => r.price <= filters.maxPrice!);
      if (typeof filters?.capacity === "number") list = list.filter(r => r.capacity >= filters.capacity!);
      
      return list;
    },
  });
}

export function useGetFeaturedRooms() {
  const { data: rooms } = useGetRooms();
  return useQuery({
    queryKey: ["rooms", "featured"],
    queryFn: async () => rooms?.filter((r) => r.featured) || [],
    enabled: !!rooms,
  });
}

type RoomQueryOptions = {
  query?: Partial<UseQueryOptions<Room | undefined>>;
};

type BookingQueryOptions = {
  query?: Partial<UseQueryOptions<Booking | undefined>>;
};

type AvailabilityQueryOptions = {
  query?: Partial<UseQueryOptions<AvailabilityRange[]>>;
};

export function useGetRoom(id: string, options?: RoomQueryOptions) {
  return useQuery({
    queryKey: ["rooms", id],
    queryFn: async (): Promise<Room | undefined> => {
      const res = await fetch(`/api/rooms/${id}`);
      if (res.status === 404) return undefined;
      if (!res.ok) throw new Error("Failed to fetch room");
      return res.json();
    },
    enabled: !!id,
    ...options?.query,
  });
}

// ── Room mutations (still in-memory until rooms are DB-backed) ───────────────

export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: RoomUpsertInput }) => {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create room");
      return res.json() as Promise<Room>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<RoomUpsertInput>;
    }) => {
      const res = await fetch(`/api/rooms/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update room");
      return res.json() as Promise<Room>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await fetch(`/api/rooms/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete room");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

// ── Booking queries — REAL API ───────────────────────────────────────────────

export function getGetAllBookingsQueryKey() {
  return ["bookings", "all"] as const;
}

export function useGetAllBookings() {
  return useQuery({
    queryKey: getGetAllBookingsQueryKey(),
    queryFn: async (): Promise<Booking[]> => {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json() as Promise<Booking[]>;
    },
  });
}

export function useGetBooking(id: string, options?: BookingQueryOptions) {
  return useQuery({
    queryKey: ["bookings", id],
    queryFn: async (): Promise<Booking | undefined> => {
      if (!id) return undefined;
      const res = await fetch(`/api/bookings/${id}`);
      if (res.status === 404) return undefined;
      if (!res.ok) throw new Error("Failed to fetch booking");
      return res.json() as Promise<Booking>;
    },
    enabled: !!id,
    ...options?.query,
  });
}

export function useGetUserBookings() {
  return useQuery({
    queryKey: ["bookings", "user"],
    queryFn: async (): Promise<Booking[]> => {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json() as Promise<Booking[]>;
    },
  });
}

export function getGetUserBookingsQueryKey() {
  return ["bookings", "user"] as const;
}

export function useGetRoomAvailability(
  roomId: string, // Changed to string
  options?: AvailabilityQueryOptions
) {
  return useQuery({
    queryKey: ["rooms", roomId, "availability"],
    queryFn: async (): Promise<AvailabilityRange[]> => {
      const res = await fetch(`/api/bookings/availability?roomId=${roomId}`);
      if (!res.ok) return [];
      return res.json() as Promise<AvailabilityRange[]>;
    },
    enabled: !!roomId,
    ...options?.query,
  });
}

export interface CreateBookingInput {
  roomId: string; // Changed to string
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  specialRequests?: string;
}

export interface CreateBookingResult {
  bookingId: string;
  totalPrice: number;
  nights: number;
  subtotal: number;
  taxes: number;
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: CreateBookingInput }): Promise<CreateBookingResult> => {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof (payload as { error: unknown }).error === "string"
            ? (payload as { error: string }).error
            : "Failed to create booking";
        const code =
          typeof payload === "object" &&
          payload !== null &&
          "code" in payload
            ? (payload as { code: string }).code
            : undefined;
        const err = new Error(msg);
        if (code) (err as Error & { code: string }).code = code;
        throw err;
      }
      return payload as CreateBookingResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (!res.ok) {
        const payload: unknown = await res.json().catch(() => ({}));
        const msg =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof (payload as { error: unknown }).error === "string"
            ? (payload as { error: string }).error
            : "Failed to cancel booking";
        throw new Error(msg);
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

// ── Admin pricing calendar ───────────────────────────────────────────────────

export interface AdminPricingDay {
  date: string;
  effectivePrice: number;
  hasCustomPrice: boolean;
  blocked: boolean;
  reserved: boolean;
}

export interface AdminRoomPricingData {
  roomId: number;
  roomTitle: string;
  basePrice: number;
  days: AdminPricingDay[];
  overrides: { date: string; price?: number; blocked: boolean }[];
  bookings: {
    id: string;
    checkIn: string;
    checkOut: string;
    source: "website" | "airbnb";
    guestName: string;
    status: string;
    displayTitle: string;
    airbnbKind?: string;
  }[];
}

export function useGetAdminRoomPricing(
  roomId: number,
  range: { from: string; to: string } | null
) {
  return useQuery({
    queryKey: ["admin", "pricing", roomId, range?.from, range?.to],
    queryFn: async (): Promise<AdminRoomPricingData> => {
      const params = new URLSearchParams({
        from: range!.from,
        to: range!.to,
      });
      const res = await fetch(
        `/api/admin/rooms/${roomId}/pricing?${params.toString()}`
      );
      if (!res.ok) throw new Error("Failed to fetch pricing calendar");
      return res.json() as Promise<AdminRoomPricingData>;
    },
    enabled: !!range && !isNaN(roomId) && roomId > 0,
  });
}

export function useUpdateAdminRoomDay(roomId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      date: string;
      price?: number | null;
      blocked?: boolean;
    }) => {
      const res = await fetch(`/api/admin/rooms/${roomId}/pricing/day`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        const msg =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof (payload as { error: unknown }).error === "string"
            ? (payload as { error: string }).error
            : "Failed to update day";
        throw new Error(msg);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pricing", roomId] });
    },
  });
}

// ── Admin queries — REAL API ─────────────────────────────────────────────────

export function useGetAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async (): Promise<AdminStats> => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json() as Promise<AdminStats>;
    },
  });
}

export function useGetRevenueData() {
  return useQuery({
    queryKey: ["admin", "revenue"],
    queryFn: async (): Promise<RevenueMonth[]> => {
      const res = await fetch("/api/admin/revenue");
      if (!res.ok) throw new Error("Failed to fetch revenue");
      return res.json() as Promise<RevenueMonth[]>;
    },
  });
}

// ── Admin calendar events ────────────────────────────────────────────────────

export function useGetAdminRoomCalendar(
  roomId: number,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["admin", "calendar", roomId],
    queryFn: async (): Promise<AdminCalendarBooking[]> => {
      const res = await fetch(`/api/admin/rooms/${roomId}/calendar`);
      if (!res.ok) throw new Error("Failed to fetch calendar");
      return res.json() as Promise<AdminCalendarBooking[]>;
    },
    enabled: options?.enabled !== false && !isNaN(roomId) && roomId > 0,
  });
}

// ── Sync logs ────────────────────────────────────────────────────────────────

export interface SyncLog {
  id: string;
  roomId: number;
  source: string;
  success: boolean;
  startedAt: string;
  finishedAt: string;
  eventsImported: number;
  eventsRemoved: number;
  errorMessage: string;
  createdAt: string;
}

export function useGetSyncLogs(roomId?: number) {
  return useQuery({
    queryKey: ["admin", "sync-logs", roomId ?? null],
    queryFn: async (): Promise<SyncLog[]> => {
      const params = roomId != null ? `?roomId=${roomId}` : "";
      const res = await fetch(`/api/admin/sync-logs${params}`);
      if (!res.ok) throw new Error("Failed to load sync logs");
      return res.json() as Promise<SyncLog[]>;
    },
  });
}

// ── Room sync (manual Airbnb iCal import) ───────────────────────────────────

export function useSyncRoom(roomId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<{
      success: boolean;
      imported: number;
      removed: number;
      error?: string;
    }> => {
      const res = await fetch(`/api/rooms/${roomId}/sync`, {
        method: "POST",
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        const msg =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof (payload as { error: unknown }).error === "string"
            ? (payload as { error: string }).error
            : "Sync failed";
        throw new Error(msg);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "calendar", roomId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "sync-logs"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}
