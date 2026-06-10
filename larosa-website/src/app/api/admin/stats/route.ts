import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";
import { requireAdminResponse, isUnauthorized } from "@/lib/auth-guard";

// GET /api/admin/stats
export async function GET() {
  const auth = await requireAdminResponse();
  if (isUnauthorized(auth)) return auth;

  try {
    await connectMongo();

    const [confirmed, cancelled, revenueAgg] = await Promise.all([
      Booking.countDocuments({ status: "confirmed", source: "website" }),
      Booking.countDocuments({ status: "cancelled", source: "website" }),
      Booking.aggregate([
        { $match: { status: "confirmed", source: "website" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
    ]);

    const totalRevenue: number =
      revenueAgg.length > 0 ? (revenueAgg[0] as { total: number }).total : 0;

    // Occupancy rate: base 40% + adjust per active confirmed bookings
    const occupancyRate = Math.min(96, Math.round(40 + confirmed * 4.5));

    return NextResponse.json({
      totalRevenue,
      occupancyRate,
      confirmedBookings: confirmed,
      cancelledBookings: cancelled,
    });
  } catch (err) {
    console.error("[GET /api/admin/stats]", err);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
