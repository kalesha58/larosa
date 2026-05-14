import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { requireAdminResponse, isUnauthorized } from "@/lib/auth-guard";
import { SyncLog } from "@/models/SyncLog";

const PAGE = 50;

// GET /api/admin/sync-logs
export async function GET(request: Request) {
  const auth = await requireAdminResponse();
  if (isUnauthorized(auth)) return auth;

  try {
    await connectMongo();
    const url = new URL(request.url);
    const roomIdParam = url.searchParams.get("roomId");
    const filter =
      roomIdParam && !isNaN(parseInt(roomIdParam, 10))
        ? { roomId: parseInt(roomIdParam, 10) }
        : {};

    const logs = await SyncLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(PAGE)
      .lean();

    return NextResponse.json(
      logs.map((l) => ({
        id: l._id.toString(),
        roomId: l.roomId,
        source: l.source,
        success: l.success,
        startedAt: l.startedAt.toISOString(),
        finishedAt: l.finishedAt.toISOString(),
        eventsImported: l.eventsImported,
        eventsRemoved: l.eventsRemoved,
        errorMessage: l.errorMessage ?? "",
        createdAt: l.createdAt.toISOString(),
      }))
    );
  } catch (err) {
    console.error("[GET /api/admin/sync-logs]", err);
    return NextResponse.json({ error: "Failed to load logs" }, { status: 500 });
  }
}
