"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { cloneInitialRooms, type Room } from "@/lib/room-catalog";

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
  description: string;
  type: string;
  price: number;
  capacity: number;
  totalRooms: number;
  featured?: boolean;
  images: string[];
  amenities: string[];
}

export interface Booking {
  id: string;
  roomId: number;
  room: {
    id: number;
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

// ── Room queries (still static from catalog) ────────────────────────────────

let MOCK_ROOMS: Room[] = cloneInitialRooms();

export interface RoomListFilters {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
}

function filterRooms(filters?: RoomListFilters): Room[] {
  let list = [...MOCK_ROOMS];
  if (!filters) return list;
  if (filters.type && filters.type !== "all") {
    list = list.filter((r) => r.type === filters.type);
  }
  if (typeof filters.minPrice === "number") {
    list = list.filter((r) => r.price >= filters.minPrice!);
  }
  if (typeof filters.maxPrice === "number") {
    list = list.filter((r) => r.price <= filters.maxPrice!);
  }
  if (typeof filters.capacity === "number") {
    list = list.filter((r) => r.capacity >= filters.capacity!);
  }
  return list;
}

export function getGetRoomsQueryKey(_filters?: RoomListFilters) {
  return ["rooms", "list"] as const;
}

export function useGetRooms(filters?: RoomListFilters) {
  return useQuery({
    queryKey: ["rooms", "list", filters ?? {}],
    queryFn: async () => filterRooms(filters),
  });
}

export function useGetFeaturedRooms() {
  return useQuery({
    queryKey: ["rooms", "featured"],
    queryFn: async () => MOCK_ROOMS.filter((r) => r.featured),
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

export function useGetRoom(id: number, options?: RoomQueryOptions) {
  return useQuery({
    queryKey: ["rooms", id],
    queryFn: async () => MOCK_ROOMS.find((r) => r.id === id),
    enabled: Number.isFinite(id) && id > 0,
    ...options?.query,
  });
}

// ── Room mutations (still in-memory until rooms are DB-backed) ───────────────

export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: RoomUpsertInput }) => {
      const nextId = Math.max(0, ...MOCK_ROOMS.map((r) => r.id)) + 1;
      const room: Room = {
        id: nextId,
        title: data.title,
        description: data.description,
        type: data.type,
        price: data.price,
        images: data.images.length > 0 ? data.images : ["/room-deluxe.png"],
        amenities: data.amenities,
        capacity: data.capacity,
        sizeSqFt: 600,
        totalRooms: data.totalRooms,
        featured: data.featured ?? false,
      };
      MOCK_ROOMS = [...MOCK_ROOMS, room];
      return room;
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
      id: number;
      data: RoomUpsertInput;
    }) => {
      const existing = MOCK_ROOMS.find((r) => r.id === id);
      if (!existing) throw new Error("Room not found");
      const updated: Room = {
        ...existing,
        title: data.title,
        description: data.description,
        type: data.type,
        price: data.price,
        capacity: data.capacity,
        totalRooms: data.totalRooms,
        featured: data.featured ?? false,
        images: data.images.length > 0 ? data.images : existing.images,
        amenities: data.amenities,
      };
      MOCK_ROOMS = MOCK_ROOMS.map((r) => (r.id === id ? updated : r));
      return updated;
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
    mutationFn: async ({ id }: { id: number }) => {
      const existed = MOCK_ROOMS.some((r) => r.id === id);
      if (!existed) throw new Error("Room not found");
      MOCK_ROOMS = MOCK_ROOMS.filter((r) => r.id !== id);
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
  roomId: number,
  options?: AvailabilityQueryOptions
) {
  return useQuery({
    queryKey: ["rooms", roomId, "availability"],
    queryFn: async (): Promise<AvailabilityRange[]> => {
      const res = await fetch(`/api/bookings/availability?roomId=${roomId}`);
      if (!res.ok) return [];
      return res.json() as Promise<AvailabilityRange[]>;
    },
    enabled: Number.isFinite(roomId) && roomId > 0,
    ...options?.query,
  });
}

export interface CreateBookingInput {
  roomId: number;
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
