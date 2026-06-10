import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  AUTH_COOKIE_NAME,
  verifyAuthToken,
  type IAuthTokenPayload,
} from "@/lib/auth";

export async function getAuthPayload(): Promise<IAuthTokenPayload | null> {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAuthToken(token);
}

/** Returns admin payload or a 401 NextResponse. */
export async function requireAdminResponse(): Promise<
  IAuthTokenPayload | NextResponse
> {
  const p = await getAuthPayload();
  if (!p || p.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return p;
}

export function isUnauthorized(
  r: IAuthTokenPayload | NextResponse
): r is NextResponse {
  return r instanceof NextResponse;
}
