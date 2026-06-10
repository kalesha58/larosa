export type AirbnbEventKind = "booking" | "blocked" | "other";

/** Classify raw Airbnb iCal SUMMARY text for admin calendar display. */
export function classifyAirbnbSummary(summary: string): AirbnbEventKind {
  const s = summary.trim().toLowerCase();
  if (!s) return "other";

  if (
    s.includes("not available") ||
    s.includes("unavailable") ||
    s.includes("blocked")
  ) {
    return "blocked";
  }

  if (
    s.includes("reserved") ||
    s.includes("booking") ||
    s.includes("confirmed")
  ) {
    return "booking";
  }

  return "other";
}

export function airbnbDisplayTitle(
  kind: AirbnbEventKind,
  _rawSummary?: string
): string {
  switch (kind) {
    case "booking":
      return "Airbnb booking";
    case "blocked":
      return "Blocked";
    default:
      return "Unavailable (Airbnb)";
  }
}

export function websiteDisplayTitle(
  guestName: string,
  status?: string
): string {
  const name = guestName?.trim();
  if (name) return name;
  if (status === "pending") return "Website booking (pending)";
  return "Website booking";
}

export function calendarDisplayTitle(params: {
  source: "website" | "airbnb";
  guestName: string;
  status?: string;
  airbnbKind?: AirbnbEventKind;
}): { displayTitle: string; airbnbKind?: AirbnbEventKind } {
  if (params.source === "airbnb") {
    const kind =
      params.airbnbKind ?? classifyAirbnbSummary(params.guestName);
    return {
      displayTitle: airbnbDisplayTitle(kind, params.guestName),
      airbnbKind: kind,
    };
  }
  return {
    displayTitle: websiteDisplayTitle(params.guestName, params.status),
  };
}
