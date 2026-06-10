import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectMongo } from "@/lib/mongodb";
import { requireAdminResponse, isUnauthorized } from "@/lib/auth-guard";
import { serializeCampaign } from "@/lib/campaign-api";
import { deactivateOtherCampaignsOfType } from "@/lib/campaign-visibility";
import { Campaign } from "@/models/Campaign";

const patchSchema = z.object({
  name: z.string().min(2).optional(),
  type: z.enum(["strip", "showcase"]).optional(),
  status: z.enum(["active", "draft", "archived"]).optional(),
  headline: z.string().min(2).optional(),
  message: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  accent: z.enum(["gold", "navy", "neutral"]).optional(),
  priority: z.number().int().min(0).optional(),
  startsAt: z.coerce.date().optional().nullable(),
  endsAt: z.coerce.date().optional().nullable(),
  dismissible: z.boolean().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const auth = await requireAdminResponse();
  if (isUnauthorized(auth)) return auth;

  try {
    await connectMongo();
    const { id } = await ctx.params;
    const doc = await Campaign.findOne({ campaignId: id }).lean();
    if (!doc) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }
    return NextResponse.json(serializeCampaign(doc));
  } catch (err) {
    console.error("[GET /api/campaigns/[id]]", err);
    return NextResponse.json({ error: "Failed to load campaign" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const auth = await requireAdminResponse();
  if (isUnauthorized(auth)) return auth;

  try {
    await connectMongo();
    const { id } = await ctx.params;
    const json: unknown = await request.json();
    const parsed = patchSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const update: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.startsAt === null) update.startsAt = undefined;
    if (parsed.data.endsAt === null) update.endsAt = undefined;

    if (parsed.data.status === "active") {
      const existing = await Campaign.findOne({ campaignId: id }).lean();
      if (existing) {
        await deactivateOtherCampaignsOfType(existing.type, id);
      }
    }

    const doc = await Campaign.findOneAndUpdate(
      { campaignId: id },
      { $set: update },
      { new: true }
    ).lean();

    if (!doc) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json(serializeCampaign(doc));
  } catch (err) {
    console.error("[PATCH /api/campaigns/[id]]", err);
    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, ctx: Ctx) {
  const auth = await requireAdminResponse();
  if (isUnauthorized(auth)) return auth;

  try {
    await connectMongo();
    const { id } = await ctx.params;
    const res = await Campaign.deleteOne({ campaignId: id });
    if (res.deletedCount === 0) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/campaigns/[id]]", err);
    return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 });
  }
}
