import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// GET /api/admin/revenue — monthly revenue for the current year
export async function GET() {
  try {
    await connectMongo();

    const currentYear = new Date().getFullYear();

    const agg = await Booking.aggregate([
      {
        $match: {
          status: "confirmed",
          checkIn: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$checkIn" },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Build a full 12-month array (fill 0 for months with no data)
    const revenueMap: Record<number, number> = {};
    for (const entry of agg as Array<{ _id: number; revenue: number }>) {
      revenueMap[entry._id] = entry.revenue;
    }

    const monthlyRevenue = MONTH_NAMES.map((month, i) => ({
      month,
      revenue: revenueMap[i + 1] ?? 0,
    }));

    return NextResponse.json(monthlyRevenue);
  } catch (err) {
    console.error("[GET /api/admin/revenue]", err);
    return NextResponse.json(
      { error: "Failed to fetch revenue" },
      { status: 500 }
    );
  }
}
