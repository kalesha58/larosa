import mongoose, { Schema, models, model } from "mongoose";

export interface ISyncLog {
  _id: mongoose.Types.ObjectId;
  roomId: number;
  source: "airbnb_import";
  success: boolean;
  startedAt: Date;
  finishedAt: Date;
  eventsImported: number;
  eventsRemoved: number;
  errorMessage?: string;
  createdAt: Date;
}

const SyncLogSchema = new Schema<ISyncLog>(
  {
    roomId: { type: Number, required: true, index: true },
    source: {
      type: String,
      enum: ["airbnb_import"],
      required: true,
    },
    success: { type: Boolean, required: true },
    startedAt: { type: Date, required: true },
    finishedAt: { type: Date, required: true },
    eventsImported: { type: Number, default: 0 },
    eventsRemoved: { type: Number, default: 0 },
    errorMessage: { type: String, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

SyncLogSchema.index({ createdAt: -1 });

export const SyncLog = models.SyncLog ?? model<ISyncLog>("SyncLog", SyncLogSchema);
