import mongoose, { Schema, models, model } from "mongoose";

export type BookingStatus = "pending" | "confirmed" | "cancelled";
export type BookingSource = "website" | "airbnb" | "manual";

/** How long a pending booking holds its dates before expiring (30 minutes). */
export const PENDING_BOOKING_HOLD_MS = 30 * 60 * 1000;


export interface IBooking {
  _id: mongoose.Types.ObjectId;
  roomId: string;
  roomTitle: string;
  roomType: string;
  pricePerNight: number;
  userId?: mongoose.Types.ObjectId;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: number;
  totalPrice: number;
  status: BookingStatus;
  source?: BookingSource;
  externalUid?: string;
  specialRequests?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpayRefundId?: string;
  cancelledAt?: Date;
  cancelledBy?: "admin" | "guest";
  confirmationEmailSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    roomId: { type: String, required: true },
    roomTitle: { type: String, required: true },
    roomType: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    guestName: { type: String, required: true, trim: true },
    guestEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    guestPhone: { type: String, trim: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: true },
    guests: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    source: {
      type: String,
      enum: ["website", "airbnb", "manual"],
      default: "website",
    },
    externalUid: { type: String, trim: true },
    specialRequests: { type: String },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpayRefundId: { type: String },
    cancelledAt: { type: Date },
    cancelledBy: { type: String, enum: ["admin", "guest"] },
    confirmationEmailSentAt: { type: Date },
  },
  { timestamps: true }
);

// Index for fast overlap queries
BookingSchema.index({ roomId: 1, checkIn: 1, checkOut: 1, status: 1 });
BookingSchema.index(
  { roomId: 1, source: 1, externalUid: 1 },
  {
    unique: true,
    partialFilterExpression: {
      source: "airbnb",
      externalUid: { $type: "string", $ne: "" },
    },
  }
);
// Index for user booking lookups
BookingSchema.index({ guestEmail: 1 });
BookingSchema.index({ razorpayOrderId: 1 });

/** Checks if a date range overlaps with any confirmed booking for a given room.
 *  Returns true if there IS a conflict (i.e., dates are NOT available). */
export async function hasOverlap(
  roomId: string,
  checkIn: Date,
  checkOut: Date,
  excludeBookingId?: string
): Promise<boolean> {
  const { resolveBookingRoomIds } = await import("@/lib/room-api");
  const roomIds = await resolveBookingRoomIds(roomId);
  const query: Record<string, unknown> = {
    roomId: roomIds.length === 1 ? roomIds[0] : { $in: roomIds },
    status: "confirmed",
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  };
  if (excludeBookingId) {
    query._id = { $ne: new mongoose.Types.ObjectId(excludeBookingId) };
  }
  const conflict = await Booking.findOne(query).lean();
  return conflict !== null;
}

// In development, Next.js HMR can leave stale models in the cache.
// If we changed roomId from Number to String, we must clear it.
if (process.env.NODE_ENV === "development") {
  delete models.Booking;
}

export const Booking =
  models.Booking ?? model<IBooking>("Booking", BookingSchema);
