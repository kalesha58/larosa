import mongoose, { Schema, model, models, Document } from "mongoose";

export type CampaignType = "strip" | "showcase";
export type CampaignStatus = "active" | "draft" | "archived";
export type CampaignAccent = "gold" | "navy" | "neutral";

export interface ICampaign extends Document {
  campaignId: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  headline: string;
  message?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  imageUrl?: string;
  accent: CampaignAccent;
  priority: number;
  startsAt?: Date;
  endsAt?: Date;
  dismissible: boolean;
}

const CampaignSchema = new Schema<ICampaign>(
  {
    campaignId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, enum: ["strip", "showcase"], required: true },
    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "draft",
    },
    headline: { type: String, required: true },
    message: { type: String, default: "" },
    ctaLabel: { type: String, default: "" },
    ctaUrl: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    accent: {
      type: String,
      enum: ["gold", "navy", "neutral"],
      default: "neutral",
    },
    priority: { type: Number, default: 0 },
    startsAt: { type: Date },
    endsAt: { type: Date },
    dismissible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Campaign =
  (models.Campaign as mongoose.Model<ICampaign>) ||
  model<ICampaign>("Campaign", CampaignSchema);
