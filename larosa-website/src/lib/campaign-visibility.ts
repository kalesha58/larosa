import { Campaign, type CampaignType } from "@/models/Campaign";

/** Hide all other active campaigns of the same banner type. */
export async function deactivateOtherCampaignsOfType(
  type: CampaignType,
  exceptCampaignId: string
) {
  await Campaign.updateMany(
    {
      type,
      campaignId: { $ne: exceptCampaignId },
      status: "active",
    },
    { $set: { status: "draft" } }
  );
}

export async function setCampaignVisibility(
  campaignId: string,
  visible: boolean
) {
  const doc = await Campaign.findOne({ campaignId });
  if (!doc) return null;

  if (visible) {
    await deactivateOtherCampaignsOfType(doc.type, campaignId);
    doc.status = "active";
  } else {
    doc.status = "draft";
  }

  await doc.save();
  return doc;
}
