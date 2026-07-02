import ical, { expandRecurringEvent, type VEvent } from "node-ical";
import icalGen from "ical-generator";
import { connectMongo } from "@/lib/mongodb";
import { assertAllowedAirbnbIcalUrl } from "@/lib/ical-url";
import { Booking } from "@/models/Booking";
import { Room } from "@/models/Room";
import { SyncLog } from "@/models/SyncLog";
import {
  icalDateToPropertyYmd,
  propertyStayFromYmd,
  PROPERTY_TIMEZONE,
} from "@/lib/property-dates";

const FETCH_TIMEOUT_MS = 25_000;

function toDate(d: unknown): Date {
  if (d instanceof Date) return d;
  if (typeof d === "string" || typeof d === "number") return new Date(d);
  return new Date(NaN);
}

/** iCal DATE (floating) or DATE-TIME → IST calendar check-in / exclusive check-out. */
function stayRangeFromIcalInstants(start: Date, end: Date): {
  checkIn: Date;
  checkOut: Date;
} {
  const endResolved = isNaN(end.getTime())
    ? new Date(start.getTime() + 86400000)
    : end;
  const checkInYmd = icalDateToPropertyYmd(start);
  const checkOutYmd = icalDateToPropertyYmd(endResolved);
  return propertyStayFromYmd(checkInYmd, checkOutYmd);
}

function summaryText(s: unknown): string {
  if (typeof s === "string") return s.slice(0, 200);
  if (s && typeof s === "object" && "val" in s) {
    const v = (s as { val: unknown }).val;
    if (typeof v === "string") return v.slice(0, 200);
  }
  return "Airbnb reservation";
}

export type ParsedStayRange = {
  uid: string;
  checkIn: Date;
  checkOut: Date;
  summary: string;
};

/** Flatten VEVENTs into stay ranges (check-out day exclusive, UTC date-only). */
function extractStayRangesFromCalendar(parsed: ReturnType<typeof ical.parseICS>): ParsedStayRange[] {
  const ranges: ParsedStayRange[] = [];
  const from = new Date(Date.now() - 90 * 86400000);
  const to = new Date(Date.now() + 730 * 86400000);

  for (const comp of Object.values(parsed)) {
    if (!comp || typeof comp !== "object" || (comp as { type?: string }).type !== "VEVENT") {
      continue;
    }
    const ev = comp as VEvent;
    if (ev.status === "CANCELLED" || ev.transparency === "TRANSPARENT") {
      continue;
    }

    const baseSummary = summaryText(ev.summary);

    if (ev.rrule) {
      try {
        const instances = expandRecurringEvent(ev, { from, to });
        for (const inst of instances) {
          const start = toDate(inst.start);
          const end = toDate(inst.end);
          if (isNaN(start.getTime())) continue;
          const { checkIn, checkOut } = stayRangeFromIcalInstants(start, end);
          ranges.push({
            uid: `${ev.uid}#${checkIn.getTime()}`,
            checkIn,
            checkOut,
            summary: baseSummary,
          });
        }
      } catch {
        // skip broken recurrence
      }
      continue;
    }

    const start = toDate(ev.start);
    let end = ev.end ? toDate(ev.end) : new Date(NaN);
    if (isNaN(start.getTime())) continue;

    if (isNaN(end.getTime())) {
      end = new Date(start.getTime() + 86400000);
    }

    const { checkIn, checkOut } = stayRangeFromIcalInstants(start, end);

    ranges.push({
      uid: ev.uid,
      checkIn,
      checkOut,
      summary: baseSummary,
    });
  }

  return ranges.filter((r) => r.checkOut > r.checkIn);
}

export interface SyncRoomResult {
  roomId: number;
  success: boolean;
  imported: number;
  removed: number;
  error?: string;
}

export async function syncRoomFromAirbnb(roomId: number): Promise<SyncRoomResult> {
  const startedAt = new Date();
  const bookingRoomId = String(roomId);
  await connectMongo();

  const room = await Room.findOne({ roomId }).lean();
  if (!room) {
    return { roomId, success: false, imported: 0, removed: 0, error: "Room not found" };
  }
  if (!room.syncEnabled) {
    return { roomId, success: true, imported: 0, removed: 0, error: "Sync disabled" };
  }
  if (!room.airbnbIcalUrl?.trim()) {
    await Room.updateOne(
      { roomId },
      { $set: { syncStatus: "idle", lastSyncedAt: new Date() } }
    );
    return { roomId, success: true, imported: 0, removed: 0, error: "No Airbnb URL configured" };
  }

  let validatedUrl: URL;
  try {
    validatedUrl = assertAllowedAirbnbIcalUrl(room.airbnbIcalUrl);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid URL";
    await Room.updateOne({ roomId }, { $set: { syncStatus: "error" } });
    await SyncLog.create({
      roomId,
      source: "airbnb_import",
      success: false,
      startedAt,
      finishedAt: new Date(),
      eventsImported: 0,
      eventsRemoved: 0,
      errorMessage: msg,
    });
    return { roomId, success: false, imported: 0, removed: 0, error: msg };
  }

  await Room.updateOne({ roomId }, { $set: { syncStatus: "syncing" } });

  let body: string;
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(validatedUrl.toString(), {
      signal: ac.signal,
      headers: { "User-Agent": "LarosaCalendarSync/1.0" },
    });
    clearTimeout(t);
    if (!res.ok) {
      throw new Error(`Airbnb returned HTTP ${res.status}`);
    }
    body = await res.text();
    if (!body.includes("BEGIN:VCALENDAR")) {
      throw new Error("Response is not a valid iCalendar document");
    }
  } catch (e) {
    const msg =
      e instanceof Error
        ? e.name === "AbortError"
          ? "Airbnb calendar request timed out"
          : e.message
        : "Network error";
    await Room.updateOne({ roomId }, { $set: { syncStatus: "error" } });
    const finishedAt = new Date();
    await SyncLog.create({
      roomId,
      source: "airbnb_import",
      success: false,
      startedAt,
      finishedAt,
      eventsImported: 0,
      eventsRemoved: 0,
      errorMessage: msg,
    });
    return { roomId, success: false, imported: 0, removed: 0, error: msg };
  }

  let ranges: ParsedStayRange[];
  try {
    const parsed = ical.parseICS(body);
    ranges = extractStayRangesFromCalendar(parsed);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to parse iCal";
    await Room.updateOne({ roomId }, { $set: { syncStatus: "error" } });
    await SyncLog.create({
      roomId,
      source: "airbnb_import",
      success: false,
      startedAt,
      finishedAt: new Date(),
      eventsImported: 0,
      eventsRemoved: 0,
      errorMessage: msg,
    });
    return { roomId, success: false, imported: 0, removed: 0, error: msg };
  }

  const byUid = new Map<string, ParsedStayRange>();
  for (const r of ranges) {
    byUid.set(r.uid, r);
  }
  const uidSet = new Set(byUid.keys());

  let removed = 0;
  if (uidSet.size === 0) {
    const del = await Booking.deleteMany({ roomId: bookingRoomId, source: "airbnb" });
    removed = del.deletedCount ?? 0;
  } else {
    const del = await Booking.deleteMany({
      roomId: bookingRoomId,
      source: "airbnb",
      externalUid: { $nin: [...uidSet] },
    });
    removed = del.deletedCount ?? 0;
  }

  let imported = 0;
  for (const r of byUid.values()) {
    const nights = Math.max(
      1,
      Math.ceil(
        (r.checkOut.getTime() - r.checkIn.getTime()) / (1000 * 60 * 60 * 24)
      )
    );
    const guestLabel = r.summary || "Airbnb reservation";

    await Booking.findOneAndUpdate(
      { roomId: bookingRoomId, source: "airbnb", externalUid: r.uid },
      {
        $set: {
          roomId: bookingRoomId,
          roomTitle: room.title,
          roomType: room.type,
          pricePerNight: 0,
          guestName: guestLabel,
          guestEmail: "airbnb-sync@blocked.invalid",
          checkIn: r.checkIn,
          checkOut: r.checkOut,
          nights,
          guests: 1,
          totalPrice: 0,
          status: "confirmed",
          source: "airbnb",
          externalUid: r.uid,
        },
      },
      { upsert: true, new: true }
    );
    imported++;
  }

  const finishedAt = new Date();
  await Room.updateOne(
    { roomId },
    {
      $set: {
        syncStatus: "ok",
        lastSyncedAt: finishedAt,
      },
    }
  );

  await SyncLog.create({
    roomId,
    source: "airbnb_import",
    success: true,
    startedAt,
    finishedAt,
    eventsImported: imported,
    eventsRemoved: removed,
  });

  return { roomId, success: true, imported, removed };
}

export async function syncAllEnabledRooms(): Promise<SyncRoomResult[]> {
  await connectMongo();
  const rooms = await Room.find({ syncEnabled: true, airbnbIcalUrl: { $ne: "" } })
    .select("roomId")
    .lean();
  const results: SyncRoomResult[] = [];
  for (const r of rooms) {
    results.push(await syncRoomFromAirbnb(r.roomId));
  }
  return results;
}

export async function buildWebsiteExportIcs(params: {
  roomId: number;
  roomTitle: string;
}): Promise<string> {
  await connectMongo();
  const bookings = await Booking.find({
    roomId: String(params.roomId),
    source: "website",
    status: "confirmed",
    checkOut: { $gte: new Date(Date.now() - 86400000) },
  })
    .sort({ checkIn: 1 })
    .lean();

  const cal = icalGen({
    name: `La Rosa — ${params.roomTitle}`,
    timezone: PROPERTY_TIMEZONE,
    ttl: 900,
    prodId: { company: "La Rosa", product: "Website", language: "EN" },
  });

  for (const b of bookings) {
    const checkInYmd = icalDateToPropertyYmd(new Date(b.checkIn));
    const checkOutYmd = icalDateToPropertyYmd(new Date(b.checkOut));
    const range = propertyStayFromYmd(checkInYmd, checkOutYmd);
    cal.createEvent({
      id: `larosa-booking-${b._id.toString()}@larosa`,
      start: range.checkIn,
      end: range.checkOut,
      allDay: true,
      summary: `${params.roomTitle} — Booking ${b._id.toString()}`,
      description: `Booking ID: ${b._id.toString()}\nRoom: ${params.roomTitle}`,
    });
  }

  return cal.toString();
}
