import * as z from "zod";

export const ROOM_FORM_LIMITS = {
  titleMin: 2,
  titleMax: 80,
  descriptionMin: 10,
  descriptionMax: 500,
  priceMin: 1,
  priceMax: 500_000,
  capacityMin: 1,
  capacityMax: 50,
  totalRoomsMin: 1,
  totalRoomsMax: 50,
  imagesMin: 1,
  imagesMax: 10,
  amenitiesMin: 1,
  amenitiesMax: 20,
  amenityItemMax: 60,
} as const;

function parseAmenities(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export const roomFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(ROOM_FORM_LIMITS.titleMin, `Title must be at least ${ROOM_FORM_LIMITS.titleMin} characters`)
    .max(ROOM_FORM_LIMITS.titleMax, `Title must be ${ROOM_FORM_LIMITS.titleMax} characters or fewer`),
  category: z.enum(["room", "villa"]),
  description: z
    .string()
    .trim()
    .min(ROOM_FORM_LIMITS.descriptionMin, `Description must be at least ${ROOM_FORM_LIMITS.descriptionMin} characters`)
    .max(ROOM_FORM_LIMITS.descriptionMax, `Description must be ${ROOM_FORM_LIMITS.descriptionMax} characters or fewer`),
  type: z.string().min(1, "Property type is required"),
  price: z.coerce
    .number({ message: "Price must be a number" })
    .min(ROOM_FORM_LIMITS.priceMin, `Price must be at least ₹${ROOM_FORM_LIMITS.priceMin}`)
    .max(ROOM_FORM_LIMITS.priceMax, `Price cannot exceed ₹${ROOM_FORM_LIMITS.priceMax.toLocaleString("en-IN")}`),
  capacity: z.coerce
    .number({ message: "Capacity must be a number" })
    .int("Capacity must be a whole number")
    .min(ROOM_FORM_LIMITS.capacityMin, `At least ${ROOM_FORM_LIMITS.capacityMin} guest`)
    .max(ROOM_FORM_LIMITS.capacityMax, `Maximum ${ROOM_FORM_LIMITS.capacityMax} guests`),
  totalRooms: z.coerce
    .number({ message: "Inventory must be a number" })
    .int("Inventory must be a whole number")
    .min(ROOM_FORM_LIMITS.totalRoomsMin, "At least 1 unit required")
    .max(ROOM_FORM_LIMITS.totalRoomsMax, `Maximum ${ROOM_FORM_LIMITS.totalRoomsMax} units`),
  featured: z.boolean(),
  status: z.enum(["active", "hidden"]),
  images: z
    .array(
      z
        .string()
        .min(1, "Image path cannot be empty")
        .refine(
          (val) => val.startsWith("/") || val.startsWith("http"),
          "Each image must be a valid path or URL"
        )
    )
    .min(ROOM_FORM_LIMITS.imagesMin, "Upload at least one image")
    .max(ROOM_FORM_LIMITS.imagesMax, `Maximum ${ROOM_FORM_LIMITS.imagesMax} images allowed`),
  amenities: z
    .string()
    .trim()
    .min(1, "Add at least one amenity")
    .superRefine((val, ctx) => {
      const items = parseAmenities(val);
      if (items.length < ROOM_FORM_LIMITS.amenitiesMin) {
        ctx.addIssue({
          code: "custom",
          message: "Add at least one amenity (comma-separated)",
        });
        return;
      }
      if (items.length > ROOM_FORM_LIMITS.amenitiesMax) {
        ctx.addIssue({
          code: "custom",
          message: `Maximum ${ROOM_FORM_LIMITS.amenitiesMax} amenities allowed`,
        });
      }
      for (const item of items) {
        if (item.length > ROOM_FORM_LIMITS.amenityItemMax) {
          ctx.addIssue({
            code: "custom",
            message: `Each amenity must be ${ROOM_FORM_LIMITS.amenityItemMax} characters or fewer`,
          });
          break;
        }
      }
    }),
  airbnbCalendarUrl: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || val === "" || z.string().url().safeParse(val).success,
      "Must be a valid URL"
    ),
});

export type RoomFormValues = z.infer<typeof roomFormSchema>;

export const roomFormDefaults: RoomFormValues = {
  title: "",
  category: "villa",
  description: "",
  type: "Villa",
  price: 25000,
  capacity: 6,
  totalRooms: 1,
  featured: false,
  status: "active",
  images: [],
  amenities: "",
  airbnbCalendarUrl: "",
};

export function roomToFormValues(room: {
  title: string;
  category?: "room" | "villa";
  description: string;
  type: string;
  price: number;
  capacity: number;
  totalRooms: number;
  featured?: boolean;
  status?: "active" | "hidden";
  images: string[];
  amenities: string[];
  airbnbIcalUrl?: string;
  airbnbCalendarUrl?: string;
}): RoomFormValues {
  return {
    title: room.title,
    category: room.category ?? "villa",
    description: room.description,
    type: room.type,
    price: room.price,
    capacity: room.capacity,
    totalRooms: room.totalRooms,
    featured: room.featured ?? false,
    status: room.status ?? "active",
    images: room.images,
    amenities: room.amenities.join(", "),
    airbnbCalendarUrl: room.airbnbIcalUrl || room.airbnbCalendarUrl || "",
  };
}

export function formValuesToPayload(values: RoomFormValues) {
  const { airbnbCalendarUrl, amenities, ...rest } = values;
  return {
    ...rest,
    amenities: parseAmenities(amenities),
    airbnbIcalUrl: airbnbCalendarUrl?.trim() || "",
  };
}
