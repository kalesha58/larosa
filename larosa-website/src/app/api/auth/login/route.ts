import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectMongo } from "@/lib/mongodb";
import { User } from "@/models/User";
import {
  AUTH_COOKIE_NAME,
  createAuthToken,
  getAuthCookieOptions,
} from "@/lib/auth";

const loginBodySchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const parsed = loginBodySchema.safeParse(json);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { error: first?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    await connectMongo();
    const user = await User.findOne({ email: email.toLowerCase() }).lean();
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const passwordOk = await bcrypt.compare(password, user.passwordHash);
    if (!passwordOk) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = createAuthToken({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    response.cookies.set(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Sign in failed. Please try again." },
      { status: 500 }
    );
  }
}
