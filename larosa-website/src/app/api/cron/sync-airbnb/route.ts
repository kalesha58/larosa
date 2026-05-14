import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { ensureCatalogRoomsSeeded } from "@/lib/room-seed";
import { syncAllEnabledRooms } from "@/lib/calendar-sync";

function verifyCronSecret(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.warn("[cron/sync-airbnb] CRON_SECRET is not set");
    return false;
  }
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

async function runCron() {
  await connectMongo();
  await ensureCatalogRoomsSeeded();
  return syncAllEnabledRooms();
}

// Vercel Cron invokes GET with Authorization: Bearer CRON_SECRET
export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const results = await runCron();
    return NextResponse.json({ ok: true, results });
  } catch (err) {
    console.error("[GET /api/cron/sync-airbnb]", err);
    return NextResponse.json({ error: "Cron sync failed" }, { status: 500 });
  }
}

// Manual / external POST with same Bearer token
export async function POST(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const results = await runCron();
    return NextResponse.json({ ok: true, results });
  } catch (err) {
    console.error("[POST /api/cron/sync-airbnb]", err);
    return NextResponse.json({ error: "Cron sync failed" }, { status: 500 });
  }
}
