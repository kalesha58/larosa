/**
 * Seed catalog villas into MongoDB (idempotent).
 * Usage: npm run db:seed (from larosa-website/)
 */
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const { connectMongo } = await import("../src/lib/mongodb");
  const { ensureCatalogRoomsSeeded } = await import("../src/lib/room-seed");

  await connectMongo();
  const result = await ensureCatalogRoomsSeeded();

  console.log("[db:seed] Villa catalog seed complete:");
  console.log("  upserted (new):", result.upserted.length ? result.upserted : "none");
  console.log("  updated:", result.updated.length ? result.updated : "none");
  console.log("  pruned (stale, no bookings):", result.pruned.length ? result.pruned : "none");
  if (result.skippedWithBookings.length) {
    console.log("  skipped prune (has bookings):", result.skippedWithBookings);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("[db:seed] Failed:", err);
  process.exit(1);
});
