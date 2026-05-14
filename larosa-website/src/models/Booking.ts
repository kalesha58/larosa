import mongoose, { Schema, models, model } from "mongoose";

export type BookingStatus = "pending" | "confirmed" | "cancelled";
export type BookingSource = "website" | "airbnb";

/** Pending website bookings block availability for this long (payment window). */
export const PENDING_BOOKING_HOLD_MS = 30 * 60 * 1000;

export interface IBooking {
  _id: mongoose.Types.ObjectId;
  roomId: number;
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
  source: BookingSource;
  /** iCal UID for imported Airbnb blocks (dedupe / removal). */
  externalUid?: string;
  specialRequests?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    roomId: { type: Number, required: true },
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
      enum: ["website", "airbnb"],
      default: "website",
    },
    externalUid: { type: String, trim: true, sparse: true },
    specialRequests: { type: String },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
  },
  { timestamps: true }
);

BookingSchema.index({ roomId: 1, checkIn: 1, checkOut: 1, status: 1 });
BookingSchema.index({ roomId: 1, source: 1, externalUid: 1 });
BookingSchema.index({ guestEmail: 1 });
BookingSchema.index({ razorpayOrderId: 1 });

/** Overlap with confirmed stays (website or Airbnb) or recent pending website holds. */
export async function hasOverlap(
  roomId: number,
  checkIn: Date,
  checkOut: Date,
  excludeBookingId?: string
): Promise<boolean> {
  const BookingModel = models.Booking ?? model<IBooking>("Booking", BookingSchema);
  const holdSince = new Date(Date.now() - PENDING_BOOKING_HOLD_MS);

  const base: Record<string, unknown> = {
    roomId,
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
    status: { $ne: "cancelled" },
    $or: [
      { status: "confirmed" },
      {
        status: "pending",
        createdAt: { $gte: holdSince },
        $or: [{ source: "website" }, { source: { $exists: false } }],
      },
    ],
  };

  if (excludeBookingId) {
    base._id = { $ne: new mongoose.Types.ObjectId(excludeBookingId) };
  }

  const conflict = await BookingModel.findOne(base).lean();
  return conflict !== null;
}

export const Booking =
  models.Booking ?? model<IBooking>("Booking", BookingSchema);
