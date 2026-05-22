/** Canonical site URL for Open Graph / absolute asset links in metadata. */
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return new URL(explicit.startsWith("http") ? explicit : `https://${explicit}`);
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return new URL(`https://${vercel}`);
  }
  return new URL("http://localhost:3000");
}

/** Hero image for link previews (WhatsApp, iMessage, social). */
export const OG_VILLA_IMAGE_PATH = "/poolview1.jpeg";
