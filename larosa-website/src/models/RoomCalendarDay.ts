import mongoose, { Schema, models, model } from "mongoose";

export interface IRoomCalendarDay {
  _id: mongoose.Types.ObjectId;
  roomId: number;
  /** Property timezone calendar day (YYYY-MM-DD). */
  date: string;
  /** Override nightly rate; omit to use Room.price. */
  price?: number;
  /** Manual admin block for this night. */
  blocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoomCalendarDaySchema = new Schema<IRoomCalendarDay>(
  {
    roomId: { type: Number, required: true, index: true },
    date: { type: String, required: true, trim: true },
    price: { type: Number, min: 0 },
    blocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

RoomCalendarDaySchema.index({ roomId: 1, date: 1 }, { unique: true });

export const RoomCalendarDay =
  models.RoomCalendarDay ??
  model<IRoomCalendarDay>("RoomCalendarDay", RoomCalendarDaySchema);
