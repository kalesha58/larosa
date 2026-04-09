import { NextResponse } from "next/server";
import { isRazorpayConfigured } from "@/lib/payments-env";

export async function GET() {
  return NextResponse.json({
    configured: isRazorpayConfigured(),
  });
}
