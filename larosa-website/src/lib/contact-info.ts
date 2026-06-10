/** Larosa public contact numbers (display + E.164 for tel:/wa.me). */

export const SITE_INSTAGRAM_URL =
  "https://www.instagram.com/larosa_villas?igsh=MTdpY2hnZWJ6Y21raQ%3D%3D&utm_source=qr";

export const SITE_EMAIL = "info@larosa.co.in";

export const SITE_MOBILE_DISPLAY = "+91 94904 43765";
export const SITE_MOBILE_E164 = "919490443765";

export const SITE_WHATSAPP_DISPLAY = "+91 73306 93377";
export const SITE_WHATSAPP_E164 = "917330693377";

export const LARGE_GROUP_WHATSAPP_MESSAGE =
  "Hi, I'd like to enquire about a stay for more than 16 guests at Larosa. Could you please assist?";

export function siteMobileTelHref(): string {
  return `tel:+${SITE_MOBILE_E164}`;
}

export function buildWhatsAppUrl(message = LARGE_GROUP_WHATSAPP_MESSAGE): string {
  return `https://wa.me/${SITE_WHATSAPP_E164}?text=${encodeURIComponent(message)}`;
}
