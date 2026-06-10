import * as z from "zod";
import type { CampaignClient } from "@/lib/campaign-api";

export const campaignFormSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  type: z.enum(["strip", "showcase"]),
  status: z.enum(["active", "draft", "archived"]),
  headline: z.string().trim().min(2, "Headline is required").max(120),
  message: z.string().trim().max(500).optional(),
  ctaLabel: z.string().trim().max(40).optional(),
  ctaUrl: z.string().trim().max(500).optional(),
  imageUrl: z.string().trim().optional(),
  accent: z.enum(["gold", "navy", "neutral"]),
  priority: z.coerce.number().int().min(0).max(100),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  dismissible: z.boolean(),
});

export type CampaignFormValues = z.infer<typeof campaignFormSchema>;

export const campaignFormDefaults: CampaignFormValues = {
  name: "",
  type: "strip",
  status: "draft",
  headline: "",
  message: "",
  ctaLabel: "",
  ctaUrl: "",
  imageUrl: "",
  accent: "neutral",
  priority: 0,
  startsAt: "",
  endsAt: "",
  dismissible: true,
};

function toIsoOrUndefined(value?: string): Date | undefined {
  if (!value?.trim()) return undefined;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}

export function formValuesToPayload(values: CampaignFormValues) {
  return {
    name: values.name.trim(),
    type: values.type,
    status: values.status,
    headline: values.headline.trim(),
    message: values.message?.trim() ?? "",
    ctaLabel: values.ctaLabel?.trim() ?? "",
    ctaUrl: values.ctaUrl?.trim() ?? "",
    imageUrl: values.imageUrl?.trim() ?? "",
    accent: values.accent,
    priority: values.priority,
    startsAt: toIsoOrUndefined(values.startsAt),
    endsAt: toIsoOrUndefined(values.endsAt),
    dismissible: values.dismissible,
  };
}

export function campaignToFormValues(campaign: CampaignClient): CampaignFormValues {
  return {
    name: campaign.name,
    type: campaign.type,
    status: campaign.status,
    headline: campaign.headline,
    message: campaign.message,
    ctaLabel: campaign.ctaLabel,
    ctaUrl: campaign.ctaUrl,
    imageUrl: campaign.imageUrl,
    accent: campaign.accent,
    priority: campaign.priority,
    startsAt: campaign.startsAt ? campaign.startsAt.slice(0, 16) : "",
    endsAt: campaign.endsAt ? campaign.endsAt.slice(0, 16) : "",
    dismissible: campaign.dismissible,
  };
}
