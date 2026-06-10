import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { connectMongo } from "@/lib/mongodb";
import { requireAdminResponse, isUnauthorized } from "@/lib/auth-guard";
import {
  serializeCampaign,
  getPublicCampaigns,
} from "@/lib/campaign-api";
import { ensureCampaignSeeded } from "@/lib/campaign-seed";
import { deactivateOtherCampaignsOfType } from "@/lib/campaign-visibility";
import { Campaign } from "@/models/Campaign";

const createSchema = z.object({
  name: z.string().min(2),
  type: z.enum(["strip", "showcase"]),
  status: z.enum(["active", "draft", "archived"]).optional(),
  headline: z.string().min(2),
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

export async function GET(request: NextRequest) {
  try {
    await connectMongo();
    await ensureCampaignSeeded();
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";

    if (isAdmin) {
      const auth = await requireAdminResponse();
      if (isUnauthorized(auth)) return auth;
    }

    const query: Record<string, unknown> = isAdmin ? {} : { status: "active" };
    const docs = await Campaign.find(query).sort({ priority: -1, createdAt: -1 }).lean();
    const campaigns = docs.map(serializeCampaign);

    if (isAdmin) {
      return NextResponse.json(campaigns);
    }

    return NextResponse.json(getPublicCampaigns(campaigns));
  } catch (err) {
    console.error("[GET /api/campaigns]", err);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminResponse();
  if (isUnauthorized(auth)) return auth;

  try {
    await connectMongo();
    const json: unknown = await request.json();
    const parsed = createSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const status = data.status ?? "draft";
    const campaignId = randomUUID();

    if (status === "active") {
      await deactivateOtherCampaignsOfType(data.type, campaignId);
    }

    const campaign = await Campaign.create({
      campaignId,
      name: data.name,
      type: data.type,
      status,
      headline: data.headline,
      message: data.message ?? "",
      ctaLabel: data.ctaLabel ?? "",
      ctaUrl: data.ctaUrl ?? "",
      imageUrl: data.imageUrl ?? "",
      accent: data.accent ?? "neutral",
      priority: data.priority ?? 0,
      startsAt: data.startsAt ?? undefined,
      endsAt: data.endsAt ?? undefined,
      dismissible: data.dismissible ?? true,
    });

    return NextResponse.json(serializeCampaign(campaign.toObject()));
  } catch (err) {
    console.error("[POST /api/campaigns]", err);
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}
