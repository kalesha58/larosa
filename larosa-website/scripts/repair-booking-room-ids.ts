/**
 * One-time fix: bookings saved with Mongo Room `_id` instead of catalog `roomId`.
 * Usage: npx tsx scripts/repair-booking-room-ids.ts
 */
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const { connectMongo } = await import("../src/lib/mongodb");
  const { Booking } = await import("../src/models/Booking");
  const { Room } = await import("../src/models/Room");

  await connectMongo();

  const legacy = await Booking.find({ roomId: /^[a-f0-9]{24}$/i }).lean();
  let repaired = 0;

  for (const b of legacy) {
    const room = await Room.findById(b.roomId).lean();
    if (room?.roomId == null) continue;
    await Booking.updateOne(
      { _id: b._id },
      {
        $set: {
          roomId: String(room.roomId),
          source: b.source ?? "website",
        },
      }
    );
    repaired++;
    console.log(
      `[repair] ${b._id} → roomId ${room.roomId} (${b.guestName}, ${b.status})`
    );
  }

  console.log(`[repair] Done. Updated ${repaired} booking(s).`);
  process.exit(0);
}

main().catch((err) => {
  console.error("[repair] Failed:", err);
  process.exit(1);
});
