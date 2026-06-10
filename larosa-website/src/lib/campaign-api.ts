import type { ICampaign } from "@/models/Campaign";

export interface CampaignClient {
  id: string;
  name: string;
  type: "strip" | "showcase";
  status: "active" | "draft" | "archived";
  headline: string;
  message: string;
  ctaLabel: string;
  ctaUrl: string;
  imageUrl: string;
  accent: "gold" | "navy" | "neutral";
  priority: number;
  startsAt: string | null;
  endsAt: string | null;
  dismissible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function serializeCampaign(doc: ICampaign | Record<string, unknown>): CampaignClient {
  const d = doc as ICampaign & { createdAt?: Date; updatedAt?: Date };
  return {
    id: d.campaignId,
    name: d.name,
    type: d.type,
    status: d.status,
    headline: d.headline,
    message: d.message ?? "",
    ctaLabel: d.ctaLabel ?? "",
    ctaUrl: d.ctaUrl ?? "",
    imageUrl: d.imageUrl ?? "",
    accent: d.accent ?? "neutral",
    priority: d.priority ?? 0,
    startsAt: d.startsAt ? new Date(d.startsAt).toISOString() : null,
    endsAt: d.endsAt ? new Date(d.endsAt).toISOString() : null,
    dismissible: d.dismissible ?? true,
    createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : undefined,
    updatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : undefined,
  };
}

export function isCampaignInWindow(
  campaign: Pick<CampaignClient, "startsAt" | "endsAt">,
  now = new Date()
): boolean {
  if (campaign.startsAt && new Date(campaign.startsAt) > now) return false;
  if (campaign.endsAt && new Date(campaign.endsAt) < now) return false;
  return true;
}

export function filterActiveCampaigns(
  campaigns: CampaignClient[],
  now = new Date()
): CampaignClient[] {
  return campaigns
    .filter((c) => c.status === "active" && isCampaignInWindow(c, now))
    .sort((a, b) => b.priority - a.priority);
}

/** Public site: at most one active strip and one active showcase. */
export function limitOneCampaignPerType(
  campaigns: CampaignClient[]
): CampaignClient[] {
  const strip = campaigns.find((c) => c.type === "strip");
  const showcase = campaigns.find((c) => c.type === "showcase");
  return [strip, showcase].filter((c): c is CampaignClient => Boolean(c));
}

export function getPublicCampaigns(
  campaigns: CampaignClient[],
  now = new Date()
): CampaignClient[] {
  return limitOneCampaignPerType(filterActiveCampaigns(campaigns, now));
}
