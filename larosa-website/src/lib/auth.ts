import jwt from "jsonwebtoken";
import type { UserRole } from "@/models/User";

export const AUTH_COOKIE_NAME = "larosa_auth";

const JWT_MAX_AGE_SEC = 60 * 60 * 24 * 7;

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Please define JWT_SECRET in .env.local");
  }
  return secret;
}

export interface IAuthTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export function createAuthToken(payload: IAuthTokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_MAX_AGE_SEC });
}

export function verifyAuthToken(token: string): IAuthTokenPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("sub" in decoded) ||
      !("email" in decoded) ||
      !("role" in decoded)
    ) {
      return null;
    }
    const sub = (decoded as { sub: unknown }).sub;
    const email = (decoded as { email: unknown }).email;
    const role = (decoded as { role: unknown }).role;
    if (
      typeof sub !== "string" ||
      typeof email !== "string" ||
      (role !== "admin" && role !== "user")
    ) {
      return null;
    }
    return { sub, email, role };
  } catch {
    return null;
  }
}

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: JWT_MAX_AGE_SEC,
  };
}
