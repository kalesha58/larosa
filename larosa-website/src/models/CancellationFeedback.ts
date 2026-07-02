import mongoose, { Schema, models, model } from "mongoose";

export type CancellationReason =
  | "change_of_plans"
  | "found_alternative"
  | "pricing"
  | "dates_changed"
  | "travel_issues"
  | "other";

export interface ICancellationFeedback {
  _id: mongoose.Types.ObjectId;
  bookingId: mongoose.Types.ObjectId;
  guestName: string;
  guestEmail: string;
  roomTitle: string;
  roomType: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  reason: CancellationReason;
  reasonOther?: string;
  experienceRating?: number;
  wouldBookAgain?: "yes" | "no" | "maybe";
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CancellationFeedbackSchema = new Schema<ICancellationFeedback>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
    },
    guestName: { type: String, required: true, trim: true },
    guestEmail: { type: String, required: true, lowercase: true, trim: true },
    roomTitle: { type: String, required: true },
    roomType: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    reason: {
      type: String,
      enum: [
        "change_of_plans",
        "found_alternative",
        "pricing",
        "dates_changed",
        "travel_issues",
        "other",
      ],
      required: true,
    },
    reasonOther: { type: String, trim: true },
    experienceRating: { type: Number, min: 1, max: 5 },
    wouldBookAgain: { type: String, enum: ["yes", "no", "maybe"] },
    comments: { type: String, trim: true },
  },
  { timestamps: true }
);

CancellationFeedbackSchema.index({ createdAt: -1 });

export const CancellationFeedback =
  models.CancellationFeedback ??
  model<ICancellationFeedback>("CancellationFeedback", CancellationFeedbackSchema);
