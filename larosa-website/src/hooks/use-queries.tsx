"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";

export interface Room {
  id: number;
  title: string;
  type: string;
  price: number;
  images: string[];
  description: string;
  amenities: string[];
  capacity: number;
  sizeSqFt: number;
  /** Physical units available (admin inventory). */
  totalRooms: number;
  featured?: boolean;
}

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
  id: number;
  roomId: number;
  room: Room;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "confirmed" | "cancelled";
}

export interface AvailabilityRange {
  checkIn: string;
  checkOut: string;
}

let MOCK_ROOMS: Room[] = [
  {
    id: 1,
    title: "Regal Suite",
    type: "Suite",
    price: 1200,
    images: ["/room-suite.png"],
    description:
      "A timeless masterpiece of comfort and elegance with bespoke furnishings and garden outlooks.",
    amenities: ["Wifi", "Minibar", "Air Conditioning", "Room Service"],
    capacity: 2,
    sizeSqFt: 750,
    totalRooms: 8,
    featured: true,
  },
  {
    id: 2,
    title: "Presidential Suite",
    type: "Presidential",
    price: 3500,
    images: ["/room-presidential.png"],
    description:
      "The pinnacle of La Rosa hospitality with panoramic views and a private terrace.",
    amenities: ["Wifi", "Minibar", "Air Conditioning", "Room Service"],
    capacity: 4,
    sizeSqFt: 1400,
    totalRooms: 3,
    featured: true,
  },
  {
    id: 3,
    title: "Deluxe Heritage",
    type: "Deluxe",
    price: 850,
    images: ["/room-deluxe.png"],
    description:
      "Intimate and refined for the modern traveler with Italian marble bathroom.",
    amenities: ["Wifi", "Air Conditioning", "Room Service"],
    capacity: 2,
    sizeSqFt: 520,
    totalRooms: 14,
    featured: true,
  },
  {
    id: 4,
    title: "Garden Courtyard",
    type: "Standard",
    price: 450,
    images: ["/room-deluxe.png"],
    description:
      "Quiet courtyard views and refined simplicity for short urban stays.",
    amenities: ["Wifi", "Air Conditioning"],
    capacity: 2,
    sizeSqFt: 380,
    totalRooms: 20,
  },
  {
    id: 5,
    title: "Ocean Penthouse",
    type: "Deluxe",
    price: 2100,
    images: ["/room-suite.png"],
    description:
      "Elevated living with wraparound glass and a deep soaking tub.",
    amenities: ["Wifi", "Minibar", "Air Conditioning", "Room Service"],
    capacity: 3,
    sizeSqFt: 980,
    totalRooms: 4,
  },
];

/** Mock booked ranges per room (inclusive check-in, exclusive check-out for night logic in UI). */
const MOCK_AVAILABILITY: Record<number, AvailabilityRange[]> = {
  1: [
    { checkIn: "2026-06-01", checkOut: "2026-06-05" },
    { checkIn: "2026-07-10", checkOut: "2026-07-14" },
  ],
  2: [{ checkIn: "2026-05-20", checkOut: "2026-05-25" }],
  3: [],
  4: [{ checkIn: "2026-04-12", checkOut: "2026-04-18" }],
  5: [{ checkIn: "2026-08-01", checkOut: "2026-08-10" }],
};

let MOCK_BOOKINGS: Booking[] = [
  {
    id: 1024,
    roomId: 1,
    room: MOCK_ROOMS[0],
    guestName: "John Doe",
    guestEmail: "john@example.com",
    checkIn: "2026-05-15",
    checkOut: "2026-05-18",
    guests: 2,
    totalPrice: 3600,
    status: "confirmed",
  },
];

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
  const minPrice = filters.minPrice;
  const maxPrice = filters.maxPrice;
  const cap = filters.capacity;
  if (typeof minPrice === "number") {
    list = list.filter((r) => r.price >= minPrice);
  }
  if (typeof maxPrice === "number") {
    list = list.filter((r) => r.price <= maxPrice);
  }
  if (typeof cap === "number") {
    list = list.filter((r) => r.capacity >= cap);
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

export function useGetBooking(id: number, options?: BookingQueryOptions) {
  return useQuery({
    queryKey: ["bookings", id],
    queryFn: async () => MOCK_BOOKINGS.find((b) => b.id === id),
    ...options?.query,
  });
}

export function useGetUserBookings() {
  return useQuery({
    queryKey: ["bookings", "user"],
    queryFn: async () => MOCK_BOOKINGS,
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
    queryFn: async () => MOCK_AVAILABILITY[roomId] ?? [],
    enabled: Number.isFinite(roomId) && roomId > 0,
    ...options?.query,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      data,
    }: {
      data: {
        roomId: number;
        checkIn: string;
        checkOut: string;
        guests: number;
        guestName: string;
        guestEmail: string;
        guestPhone?: string;
        specialRequests?: string;
      };
    }) => {
      const room = MOCK_ROOMS.find((r) => r.id === data.roomId);
      if (!room) {
        throw new Error("Room not found");
      }
      const checkIn = new Date(data.checkIn);
      const checkOut = new Date(data.checkOut);
      const nights = Math.max(
        1,
        Math.ceil(
          (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
        )
      );
      const subtotal = room.price * nights;
      const taxes = Math.floor(subtotal * 0.15);
      const newBooking: Booking = {
        id: Math.floor(Math.random() * 10000),
        roomId: data.roomId,
        room,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        guests: data.guests,
        totalPrice: subtotal + taxes,
        status: "confirmed",
      };
      MOCK_BOOKINGS = [newBooking, ...MOCK_BOOKINGS];
      return newBooking;
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
    mutationFn: async ({ id }: { id: number }) => {
      MOCK_BOOKINGS = MOCK_BOOKINGS.map((b) =>
        b.id === id ? { ...b, status: "cancelled" as const } : b
      );
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useGetAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async (): Promise<AdminStats> => {
      const confirmed = MOCK_BOOKINGS.filter((b) => b.status === "confirmed");
      const cancelled = MOCK_BOOKINGS.filter((b) => b.status === "cancelled");
      const totalRevenue = confirmed.reduce((sum, b) => sum + b.totalPrice, 0);
      const occupancyRate = Math.min(
        96,
        52 + confirmed.length * 6 + cancelled.length * 2
      );
      return {
        totalRevenue,
        occupancyRate,
        confirmedBookings: confirmed.length,
        cancelledBookings: cancelled.length,
      };
    },
  });
}

const MOCK_REVENUE: RevenueMonth[] = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 38500 },
  { month: "Mar", revenue: 45200 },
  { month: "Apr", revenue: 49800 },
  { month: "May", revenue: 52100 },
  { month: "Jun", revenue: 61200 },
  { month: "Jul", revenue: 58900 },
  { month: "Aug", revenue: 54300 },
  { month: "Sep", revenue: 47600 },
  { month: "Oct", revenue: 50100 },
  { month: "Nov", revenue: 46800 },
  { month: "Dec", revenue: 55400 },
];

export function useGetRevenueData() {
  return useQuery({
    queryKey: ["admin", "revenue"],
    queryFn: async () => MOCK_REVENUE,
  });
}

export function getGetAllBookingsQueryKey() {
  return ["bookings", "all"] as const;
}

export function useGetAllBookings() {
  return useQuery({
    queryKey: getGetAllBookingsQueryKey(),
    queryFn: async () => MOCK_BOOKINGS,
  });
}

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
      if (!existing) {
        throw new Error("Room not found");
      }
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
      MOCK_BOOKINGS = MOCK_BOOKINGS.map((b) =>
        b.roomId === id ? { ...b, room: updated } : b
      );
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
      if (!existed) {
        throw new Error("Room not found");
      }
      MOCK_ROOMS = MOCK_ROOMS.filter((r) => r.id !== id);
      MOCK_BOOKINGS = MOCK_BOOKINGS.filter((b) => b.roomId !== id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}
