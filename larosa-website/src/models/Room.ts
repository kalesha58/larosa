import mongoose, { Schema, model, models } from "mongoose";

const RoomSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, enum: ["room", "villa"], default: "room" },
    description: { type: String, required: true },
    type: { type: String, required: true }, // e.g., Standard, Deluxe, Suite
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    totalRooms: { type: Number, required: true },
    sizeSqFt: { type: Number, default: 450 },
    images: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    status: { 
      type: String, 
      enum: ["active", "hidden"], 
      default: "active" 
    },
    airbnbCalendarUrl: { type: String },
  },
  { timestamps: true }
);

// If using numeric IDs in the frontend, we might want to map _id to id or keep it separate.
// For simplicity with existing frontend code, we'll add a virtual 'id' if needed or just use _id.

export const Room = models.Room || model("Room", RoomSchema);
