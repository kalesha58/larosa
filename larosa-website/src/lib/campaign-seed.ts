import { Campaign } from "@/models/Campaign";

export const SEED_CAMPAIGN_ID = "larosa-seed-monsoon-showcase";

const SEED_CAMPAIGN = {
  campaignId: SEED_CAMPAIGN_ID,
  name: "Monsoon Sanctuary Offer",
  type: "showcase" as const,
  status: "draft" as const,
  headline: "Escape to the Monsoon Magic",
  message:
    "Book a serene stay at Larosa this season. Limited villas available with complimentary welcome refreshments and late checkout on select dates.",
  ctaLabel: "Explore rooms",
  ctaUrl: "/rooms",
  imageUrl: "/Hero2.jpeg",
  accent: "gold" as const,
  priority: 10,
  dismissible: true,
};

export type CampaignSeedResult = {
  inserted: boolean;
  campaignId: string;
};

export async function ensureCampaignSeeded(): Promise<CampaignSeedResult> {
  const existing = await Campaign.findOne({ campaignId: SEED_CAMPAIGN_ID }).lean();
  if (existing) {
    return { inserted: false, campaignId: SEED_CAMPAIGN_ID };
  }

  await Campaign.create(SEED_CAMPAIGN);
  return { inserted: true, campaignId: SEED_CAMPAIGN_ID };
}
