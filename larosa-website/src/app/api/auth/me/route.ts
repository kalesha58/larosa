import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectMongo } from "@/lib/mongodb";
import { User } from "@/models/User";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ user: null });
    }

    const payload = verifyAuthToken(token);
    if (!payload) {
      return NextResponse.json({ user: null });
    }

    await connectMongo();
    const user = await User.findById(payload.sub).lean();
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not load session" },
      { status: 500 }
    );
  }
}
