import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { requireAdminResponse, isUnauthorized } from "@/lib/auth-guard";
import { CancellationFeedback, type CancellationReason } from "@/models/CancellationFeedback";
import { CANCELLATION_REASON_LABELS } from "@/lib/cancellation-feedback";

export async function GET() {
  const auth = await requireAdminResponse();
  if (isUnauthorized(auth)) return auth;

  try {
    await connectMongo();
    const docs = await CancellationFeedback.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      docs.map((doc) => ({
        id: doc._id.toString(),
        bookingId: doc.bookingId.toString(),
        guestName: doc.guestName,
        guestEmail: doc.guestEmail,
        roomTitle: doc.roomTitle,
        roomType: doc.roomType,
        checkIn: doc.checkIn.toISOString(),
        checkOut: doc.checkOut.toISOString(),
        totalPrice: doc.totalPrice,
        reason: doc.reason,
        reasonLabel: CANCELLATION_REASON_LABELS[doc.reason as CancellationReason],
        reasonOther: doc.reasonOther ?? "",
        experienceRating: doc.experienceRating ?? null,
        wouldBookAgain: doc.wouldBookAgain ?? null,
        comments: doc.comments ?? "",
        createdAt: doc.createdAt.toISOString(),
      }))
    );
  } catch (err) {
    console.error("[GET /api/admin/feedback]", err);
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
  }
}
