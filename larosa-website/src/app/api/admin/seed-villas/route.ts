import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { requireAdminResponse, isUnauthorized } from "@/lib/auth-guard";
import { ensureCatalogRoomsSeeded } from "@/lib/room-seed";

export async function POST() {
  const auth = await requireAdminResponse();
  if (isUnauthorized(auth)) return auth;

  try {
    await connectMongo();
    const result = await ensureCatalogRoomsSeeded();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[POST /api/admin/seed-villas]", err);
    const message =
      err instanceof Error ? err.message : "Failed to seed villa catalog";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
