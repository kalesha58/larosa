function parseBaseUrl(raw: string): URL {
  return new URL(raw.startsWith("http") ? raw : `https://${raw}`);
}

/** Canonical site URL for Open Graph / absolute asset links in metadata. */
export function getSiteUrl(): URL {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (siteUrl) return parseBaseUrl(siteUrl);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl) return parseBaseUrl(appUrl);

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return new URL(`https://${vercel}`);

  return new URL("http://localhost:3000");
}

/** Build an absolute URL from a path (e.g. `/api/rooms/1/calendar.ics?token=…`). */
export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  return new URL(path.startsWith("/") ? path : `/${path}`, base).href;
}

/** Hero image for link previews (WhatsApp, iMessage, social). */
export const OG_VILLA_IMAGE_PATH = "/poolview1.jpeg";
