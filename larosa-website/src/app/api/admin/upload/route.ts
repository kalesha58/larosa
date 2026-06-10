import { NextRequest, NextResponse } from "next/server";
import { requireAdminResponse, isUnauthorized } from "@/lib/auth-guard";
import { assertImageFile, uploadRoomImage } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  const auth = await requireAdminResponse();
  if (isUnauthorized(auth)) return auth;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    assertImageFile(file);

    const roomIdRaw = formData.get("roomId");
    const roomId =
      typeof roomIdRaw === "string" && roomIdRaw.trim()
        ? parseInt(roomIdRaw, 10)
        : undefined;

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadRoomImage(buffer, file.name, roomId);

    return NextResponse.json(result);
  } catch (err) {
    console.error("[POST /api/admin/upload]", err);
    const message =
      err instanceof Error ? err.message : "Failed to upload image";
    const status = message.includes("not configured") ? 503 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
