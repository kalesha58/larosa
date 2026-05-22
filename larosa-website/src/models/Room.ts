import mongoose, { Schema, models, model } from "mongoose";

export type RoomSyncStatus = "idle" | "syncing" | "ok" | "error";

export interface IRoom {
  _id: mongoose.Types.ObjectId;
  /** Stable bookable villa id (one whole villa per `roomId`; map one Airbnb listing + .ics URL). */
  roomId: number;
  title: string;
  description: string;
  type: string;
  price: number;
  images: string[];
  amenities: string[];
  capacity: number;
  sizeSqFt: number;
  totalRooms: number;
  featured: boolean;
  airbnbIcalUrl?: string;
  syncEnabled: boolean;
  syncStatus: RoomSyncStatus;
  lastSyncedAt?: Date;
  /** Secret for `GET .../calendar.ics?token=` */
  calendarExportToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    roomId: { type: Number, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    capacity: { type: Number, required: true, min: 1 },
    sizeSqFt: { type: Number, default: 600 },
    totalRooms: { type: Number, required: true, min: 1 },
    featured: { type: Boolean, default: false },
    airbnbIcalUrl: { type: String, trim: true, default: "" },
    syncEnabled: { type: Boolean, default: true },
    syncStatus: {
      type: String,
      enum: ["idle", "syncing", "ok", "error"],
      default: "idle",
    },
    lastSyncedAt: { type: Date },
    calendarExportToken: { type: String, required: true },
  },
  { timestamps: true }
);

RoomSchema.index({ featured: 1 });

export const Room = models.Room ?? model<IRoom>("Room", RoomSchema);

export async function getNextRoomId(): Promise<number> {
  const last = await Room.findOne().sort({ roomId: -1 }).select("roomId").lean();
  return (last?.roomId ?? 0) + 1;
}
