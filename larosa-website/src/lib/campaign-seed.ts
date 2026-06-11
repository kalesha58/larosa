import { Campaign } from "@/models/Campaign";
import { deactivateOtherCampaignsOfType } from "@/lib/campaign-visibility";

export const SEED_SHOWCASE_ID = "larosa-seed-monsoon-showcase";
export const SEED_STRIP_ID = "larosa-seed-announcement-strip";

const SEED_SHOWCASE = {
  campaignId: SEED_SHOWCASE_ID,
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

const SEED_STRIP = {
  campaignId: SEED_STRIP_ID,
  name: "Site announcement bar",
  type: "strip" as const,
  status: "active" as const,
  headline: "Monsoon rates now available — book direct for the best price",
  message: "Limited villa availability this season",
  ctaLabel: "View rooms",
  ctaUrl: "/rooms",
  imageUrl: "",
  accent: "gold" as const,
  priority: 10,
  dismissible: true,
};

export type CampaignSeedResult = {
  insertedShowcase: boolean;
  insertedStrip: boolean;
};

export async function ensureCampaignSeeded(): Promise<CampaignSeedResult> {
  const result: CampaignSeedResult = {
    insertedShowcase: false,
    insertedStrip: false,
  };

  const existingShowcase = await Campaign.findOne({
    campaignId: SEED_SHOWCASE_ID,
  }).lean();
  if (!existingShowcase) {
    await Campaign.create(SEED_SHOWCASE);
    result.insertedShowcase = true;
  }

  const existingStrip = await Campaign.findOne({ campaignId: SEED_STRIP_ID }).lean();
  if (!existingStrip) {
    await deactivateOtherCampaignsOfType("strip", SEED_STRIP_ID);
    await Campaign.create(SEED_STRIP);
    result.insertedStrip = true;
  } else {
    const anyActiveStrip = await Campaign.findOne({
      type: "strip",
      status: "active",
    }).lean();
    if (!anyActiveStrip) {
      await deactivateOtherCampaignsOfType("strip", SEED_STRIP_ID);
      await Campaign.updateOne(
        { campaignId: SEED_STRIP_ID },
        { $set: { status: "active" } }
      );
    }
  }

  return result;
}
