import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IRoom extends Document {
  roomId: number;
  title: string;
  category: "room" | "villa";
  description: string;
  type: string;
  price: number;
  capacity: number;
  totalRooms: number;
  sizeSqFt?: number;
  images: string[];
  amenities: string[];
  featured: boolean;
  status: "active" | "hidden";
  // iCal / Airbnb sync
  airbnbIcalUrl?: string;
  airbnbCalendarUrl?: string;
  syncEnabled: boolean;
  syncStatus: "idle" | "syncing" | "error";
  lastSyncedAt?: Date;
  calendarExportToken: string;
}

const RoomSchema = new Schema<IRoom>(
  {
    roomId: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, enum: ["room", "villa"], default: "room" },
    description: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    totalRooms: { type: Number, required: true },
    sizeSqFt: { type: Number, default: 450 },
    images: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "hidden"], default: "active" },
    // iCal / Airbnb sync
    airbnbIcalUrl: { type: String, default: "" },
    airbnbCalendarUrl: { type: String },
    syncEnabled: { type: Boolean, default: true },
    syncStatus: {
      type: String,
      enum: ["idle", "syncing", "error"],
      default: "idle",
    },
    lastSyncedAt: { type: Date },
    calendarExportToken: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Room =
  (models.Room as mongoose.Model<IRoom>) || model<IRoom>("Room", RoomSchema);
