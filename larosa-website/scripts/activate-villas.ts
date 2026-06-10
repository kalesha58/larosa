/**
 * Set catalog villas to active visibility (one-time migration helper).
 * Usage: npx tsx scripts/activate-villas.ts
 */
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const { connectMongo } = await import("../src/lib/mongodb");
  const { Room } = await import("../src/models/Room");

  await connectMongo();

  const result = await Room.updateMany(
    { roomId: { $in: [1, 2] } },
    { $set: { status: "active", category: "villa" } }
  );

  console.log(`[activate-villas] Matched ${result.matchedCount}, modified ${result.modifiedCount}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("[activate-villas] Failed:", err);
  process.exit(1);
});
