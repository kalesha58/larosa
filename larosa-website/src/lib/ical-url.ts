/** Airbnb private iCal links must be HTTPS and point at Airbnb hosts. */
export function assertAllowedAirbnbIcalUrl(raw: string): URL {
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    throw new Error("Invalid iCal URL");
  }
  if (u.protocol !== "https:") {
    throw new Error("iCal URL must use HTTPS");
  }
  const host = u.hostname.toLowerCase();
  if (!host.includes("airbnb.")) {
    throw new Error("iCal URL must be an Airbnb calendar export link");
  }
  if (!u.pathname.toLowerCase().includes("ical")) {
    throw new Error("URL does not look like an Airbnb iCal feed");
  }
  return u;
}
