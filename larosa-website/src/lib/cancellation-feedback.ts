import { z } from "zod";
import type { CancellationReason } from "@/models/CancellationFeedback";

export const CANCELLATION_REASON_LABELS: Record<CancellationReason, string> = {
  change_of_plans: "Change of plans",
  found_alternative: "Found another property",
  pricing: "Price / budget",
  dates_changed: "Dates no longer work",
  travel_issues: "Travel or personal reasons",
  other: "Other",
};

export const guestCancelFeedbackSchema = z.object({
  reason: z.enum([
    "change_of_plans",
    "found_alternative",
    "pricing",
    "dates_changed",
    "travel_issues",
    "other",
  ]),
  reasonOther: z.string().max(500).optional(),
  experienceRating: z.number().int().min(1).max(5).optional(),
  wouldBookAgain: z.enum(["yes", "no", "maybe"]).optional(),
  comments: z.string().max(2000).optional(),
});

export type GuestCancelFeedbackInput = z.infer<typeof guestCancelFeedbackSchema>;

export function formatFeedbackSummary(feedback: GuestCancelFeedbackInput): string {
  const lines: string[] = [];
  const reasonLabel =
    feedback.reason === "other" && feedback.reasonOther?.trim()
      ? `Other: ${feedback.reasonOther.trim()}`
      : CANCELLATION_REASON_LABELS[feedback.reason];
  lines.push(`Reason: ${reasonLabel}`);
  if (feedback.experienceRating) {
    lines.push(`Experience rating: ${feedback.experienceRating}/5`);
  }
  if (feedback.wouldBookAgain) {
    const labels = { yes: "Yes", no: "No", maybe: "Maybe" };
    lines.push(`Would book again: ${labels[feedback.wouldBookAgain]}`);
  }
  if (feedback.comments?.trim()) {
    lines.push(`Comments: ${feedback.comments.trim()}`);
  }
  return lines.join("\n");
}
