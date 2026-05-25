"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { Room } from "@/lib/room-catalog";

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
  sizeSqFt?: number;
  airbnbIcalUrl?: string;
  syncEnabled?: boolean;
  regenerateExportToken?: boolean;
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
  source?: "website" | "airbnb";
  specialRequests?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt?: string;
}

export interface AvailabilityRange {
  checkIn: string;
  checkOut: string;
  source?: "website" | "airbnb" | "manual";
}

export interface AdminPricingDay {
  date: string;
  effectivePrice: number;
  basePrice: number;
  hasCustomPrice: boolean;
  blocked: boolean;
  reserved: boolean;
}

export interface AdminRoomPricingResponse {
  roomId: number;
  roomTitle: string;
  basePrice: number;
  days: AdminPricingDay[];
  overrides: { date: string; price?: number; blocked: boolean }[];
  bookings: AdminCalendarBooking[];
}

export interface BookingQuote {
  subtotal: number;
  taxes: number;
  total: number;
  nights: number;
  pricePerNight: number;
  nightlyBreakdown: { date: string; price: number }[];
}

export interface AdminCalendarBooking {
  id: string;
  checkIn: string;
  checkOut: string;
  source: "website" | "airbnb";
  guestName: string;
  status: string;
  displayTitle?: string;
  airbnbKind?: "booking" | "blocked" | "other";
}

export function getAdminRoomCalendarQueryKey(roomId: number) {
  return ["admin", "calendar", roomId] as const;
}

export interface SyncLogEntry {
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

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : "Request failed";
    throw new Error(msg);
  }
  return data as T;
}

export interface RoomListFilters {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
}

function roomsQueryString(filters?: RoomListFilters): string {
  const sp = new URLSearchParams();
  if (!filters) return sp.toString();
  if (filters.type && filters.type !== "all") sp.set("type", filters.type);
  if (typeof filters.minPrice === "number")
    sp.set("minPrice", String(filters.minPrice));
  if (typeof filters.maxPrice === "number")
    sp.set("maxPrice", String(filters.maxPrice));
  if (typeof filters.capacity === "number")
    sp.set("capacity", String(filters.capacity));
  return sp.toString();
}

export function getGetRoomsQueryKey(_filters?: RoomListFilters) {
  return ["rooms", "list"] as const;
}

export function useGetRooms(filters?: RoomListFilters) {
  const qs = roomsQueryString(filters);
  const url = qs ? `/api/rooms?${qs}` : "/api/rooms";
  return useQuery({
    queryKey: ["rooms", "list", filters ?? {}],
    queryFn: async (): Promise<Room[]> => {
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load rooms");
      return res.json() as Promise<Room[]>;
    },
    retry: 1,
  });
}

export function useGetFeaturedRooms() {
  return useQuery({
    queryKey: ["rooms", "featured"],
    queryFn: async (): Promise<Room[]> => {
      const res = await fetch("/api/rooms", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load rooms");
      const rooms = (await res.json()) as Room[];
      return rooms.filter((r) => r.featured);
    },
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
    queryFn: async (): Promise<Room | undefined> => {
      const res = await fetch(`/api/rooms/${id}`, { credentials: "include" });
      if (res.status === 404) return undefined;
      if (!res.ok) throw new Error("Failed to load room");
      return res.json() as Promise<Room>;
    },
    enabled: Number.isFinite(id) && id > 0,
    ...options?.query,
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: RoomUpsertInput }): Promise<Room> => {
      return jsonFetch<Room>("/api/rooms", {
        method: "POST",
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          type: data.type,
          price: data.price,
          capacity: data.capacity,
          totalRooms: data.totalRooms,
          featured: data.featured ?? false,
          images: data.images,
          amenities: data.amenities,
          sizeSqFt: data.sizeSqFt,
          airbnbIcalUrl: data.airbnbIcalUrl,
          syncEnabled: data.syncEnabled,
        }),
      });
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
    }): Promise<Room> => {
      return jsonFetch<Room>(`/api/rooms/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          type: data.type,
          price: data.price,
          capacity: data.capacity,
          totalRooms: data.totalRooms,
          featured: data.featured ?? false,
          images: data.images,
          amenities: data.amenities,
          sizeSqFt: data.sizeSqFt,
          airbnbIcalUrl: data.airbnbIcalUrl ?? "",
          syncEnabled: data.syncEnabled,
          regenerateExportToken: data.regenerateExportToken ?? false,
        }),
      });
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
      await jsonFetch<{ ok: boolean }>(`/api/rooms/${id}`, {
        method: "DELETE",
      });
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useSyncRoom(roomId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return jsonFetch<{
        roomId: number;
        success: boolean;
        imported: number;
        removed: number;
        error?: string;
      }>(`/api/rooms/${roomId}/sync`, { method: "POST" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "sync-logs"] });
      queryClient.invalidateQueries({
        queryKey: getAdminRoomCalendarQueryKey(roomId),
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "calendar"] });
    },
  });
}

export function getAdminRoomPricingQueryKey(
  roomId: number,
  from: string,
  to: string
) {
  return ["admin", "pricing", roomId, from, to] as const;
}

export function useGetAdminRoomPricing(
  roomId: number,
  range: { from: string; to: string } | null,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: getAdminRoomPricingQueryKey(
      roomId,
      range?.from ?? "",
      range?.to ?? ""
    ),
    queryFn: async (): Promise<AdminRoomPricingResponse> => {
      const params = new URLSearchParams({
        from: range!.from,
        to: range!.to,
      });
      const res = await fetch(
        `/api/admin/rooms/${roomId}/pricing?${params}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed to load pricing calendar");
      return res.json() as Promise<AdminRoomPricingResponse>;
    },
    enabled:
      (options?.enabled ?? true) &&
      Number.isFinite(roomId) &&
      roomId > 0 &&
      !!range?.from &&
      !!range?.to,
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
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof (payload as { error: unknown }).error === "string"
            ? (payload as { error: string }).error
            : "Failed to update day";
        throw new Error(msg);
      }
      return payload as AdminPricingDay;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pricing", roomId] });
      queryClient.invalidateQueries({ queryKey: ["rooms", roomId, "availability"] });
    },
  });
}

export function useGetBookingQuote(
  roomId: number,
  checkIn: string | null,
  checkOut: string | null,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["bookings", "quote", roomId, checkIn, checkOut],
    queryFn: async (): Promise<BookingQuote> => {
      const params = new URLSearchParams({
        roomId: String(roomId),
        checkIn: checkIn!,
        checkOut: checkOut!,
      });
      const res = await fetch(`/api/bookings/quote?${params}`);
      if (!res.ok) throw new Error("Failed to load quote");
      return res.json() as Promise<BookingQuote>;
    },
    enabled:
      (options?.enabled ?? true) &&
      Number.isFinite(roomId) &&
      roomId > 0 &&
      !!checkIn &&
      !!checkOut,
  });
}

export function useGetAdminRoomCalendar(
  roomId: number,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: getAdminRoomCalendarQueryKey(roomId),
    queryFn: async (): Promise<AdminCalendarBooking[]> => {
      const res = await fetch(`/api/admin/rooms/${roomId}/calendar`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load calendar");
      return res.json() as Promise<AdminCalendarBooking[]>;
    },
    enabled: (options?.enabled ?? true) && Number.isFinite(roomId) && roomId > 0,
  });
}

export function useGetSyncLogs(roomId?: number) {
  return useQuery({
    queryKey: ["admin", "sync-logs", roomId ?? "all"],
    queryFn: async (): Promise<SyncLogEntry[]> => {
      const u =
        roomId != null
          ? `/api/admin/sync-logs?roomId=${roomId}`
          : "/api/admin/sync-logs";
      const res = await fetch(u, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load sync logs");
      return res.json() as Promise<SyncLogEntry[]>;
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
      const res = await fetch("/api/bookings", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json() as Promise<Booking[]>;
    },
    retry: 1,
  });
}

export function useGetBooking(id: string, options?: BookingQueryOptions) {
  return useQuery({
    queryKey: ["bookings", id],
    queryFn: async (): Promise<Booking | undefined> => {
      if (!id) return undefined;
      const res = await fetch(`/api/bookings/${id}`, { credentials: "include" });
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
      const res = await fetch("/api/bookings", { credentials: "include" });
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
      const res = await fetch(`/api/bookings/availability?roomId=${roomId}`, {
        credentials: "include",
      });
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
        credentials: "include",
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
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        credentials: "include",
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
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

// ── Admin queries — REAL API ─────────────────────────────────────────────────

export function useGetAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async (): Promise<AdminStats> => {
      const res = await fetch("/api/admin/stats", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json() as Promise<AdminStats>;
    },
    retry: 1,
  });
}

export function useGetRevenueData() {
  return useQuery({
    queryKey: ["admin", "revenue"],
    queryFn: async (): Promise<RevenueMonth[]> => {
      const res = await fetch("/api/admin/revenue", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch revenue");
      return res.json() as Promise<RevenueMonth[]>;
    },
    retry: 1,
  });
}
