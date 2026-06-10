import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectMongo } from "@/lib/mongodb";
import { requireAdminResponse, isUnauthorized } from "@/lib/auth-guard";
import { serializeCampaign } from "@/lib/campaign-api";
import { setCampaignVisibility } from "@/lib/campaign-visibility";

const bodySchema = z.object({
  visible: z.boolean(),
});

type Ctx = { params: Promise<{ id: string }> };

/** POST /api/campaigns/[id]/visibility — show or hide a campaign (one active per type). */
export async function POST(request: NextRequest, ctx: Ctx) {
  const auth = await requireAdminResponse();
  if (isUnauthorized(auth)) return auth;

  try {
    await connectMongo();
    const { id } = await ctx.params;
    const json: unknown = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const doc = await setCampaignVisibility(id, parsed.data.visible);
    if (!doc) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json(serializeCampaign(doc.toObject()));
  } catch (err) {
    console.error("[POST /api/campaigns/[id]/visibility]", err);
    return NextResponse.json(
      { error: "Failed to update campaign visibility" },
      { status: 500 }
    );
  }
}
