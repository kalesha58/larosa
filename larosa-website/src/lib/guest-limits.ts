/** Online self-serve guest limits and manager escalation (WhatsApp). */

import {
  LARGE_GROUP_WHATSAPP_MESSAGE,
  SITE_WHATSAPP_DISPLAY,
  SITE_WHATSAPP_E164,
  buildWhatsAppUrl,
} from "@/lib/contact-info";

export const MIN_GUESTS = 1;
export const MAX_ONLINE_GUESTS = 16;

/** @deprecated Use SITE_WHATSAPP_E164 from contact-info */
export const MANAGER_WHATSAPP_E164 = SITE_WHATSAPP_E164;

/** @deprecated Use SITE_WHATSAPP_DISPLAY from contact-info */
export const MANAGER_WHATSAPP_DISPLAY = SITE_WHATSAPP_DISPLAY;

export { LARGE_GROUP_WHATSAPP_MESSAGE };

export function buildManagerWhatsAppUrl(message = LARGE_GROUP_WHATSAPP_MESSAGE): string {
  return buildWhatsAppUrl(message);
}

export function clampGuestCount(
  value: number,
  min = MIN_GUESTS,
  max = MAX_ONLINE_GUESTS
): number {
  return Math.min(max, Math.max(min, Math.floor(value)));
}

export function validateGuestsForRoom(
  guests: number,
  roomCapacity: number
): { ok: true } | { ok: false; error: string } {
  if (guests < MIN_GUESTS) {
    return { ok: false, error: "At least one guest is required." };
  }
  if (guests > MAX_ONLINE_GUESTS) {
    return {
      ok: false,
      error: `Online bookings support up to ${MAX_ONLINE_GUESTS} guests. Please contact us for larger groups.`,
    };
  }
  if (guests > roomCapacity) {
    return {
      ok: false,
      error: `This accommodation accommodates up to ${roomCapacity} guests.`,
    };
  }
  return { ok: true };
}
