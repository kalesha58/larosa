import { NextResponse } from "next/server";
import { format, parse } from "date-fns";
import { z } from "zod";
import { buildContactEmailHtml } from "@/lib/contact-email-template";
import { isMailConfigured, sendContactMail } from "@/lib/mailer";

const ymdRegex = /^\d{4}-\d{2}-\d{2}$/;

const subjectEnum = z.enum([
  "reservation",
  "villa",
  "event",
  "wedding",
  "corporate",
  "feedback",
  "other",
]);

const contactBodySchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Valid email is required"),
  message: z.string().min(1, "Message is required").max(5000),
  phone: z.string().max(50).optional(),
  subject: subjectEnum.optional(),
  checkIn: z.string().regex(ymdRegex, "Invalid check-in date").optional(),
  checkOut: z.string().regex(ymdRegex, "Invalid check-out date").optional(),
});

const SUBJECT_LABELS: Record<z.infer<typeof subjectEnum>, string> = {
  reservation: "Reservation enquiry",
  villa: "Villa booking",
  event: "Private event",
  wedding: "Wedding",
  corporate: "Corporate stay",
  feedback: "Feedback",
  other: "Other",
};

function inboxSubjectLine(
  subjectKey: z.infer<typeof subjectEnum> | undefined,
  name: string
): string {
  const topic =
    subjectKey === undefined
      ? "General enquiry"
      : SUBJECT_LABELS[subjectKey];
  const shortName =
    name.length > 40 ? `${name.slice(0, 37).trimEnd()}…` : name;
  return `[La Rosa] ${topic} — ${shortName}`;
}

export async function POST(request: Request) {
  if (!isMailConfigured()) {
    return NextResponse.json(
      { error: "Email is not configured on the server." },
      { status: 503 }
    );
  }

  try {
    const json: unknown = await request.json();
    const parsed = contactBodySchema.safeParse(json);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { error: first?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { name, email, message, phone, subject, checkIn, checkOut } =
      parsed.data;

    const hasCheckIn = Boolean(checkIn);
    const hasCheckOut = Boolean(checkOut);
    if (hasCheckIn !== hasCheckOut) {
      return NextResponse.json(
        {
          error:
            "Please select both check-in and check-out, or leave dates empty.",
        },
        { status: 400 }
      );
    }

    let preferredStay: string | undefined;
    if (checkIn && checkOut) {
      const checkinDate = parse(checkIn, "yyyy-MM-dd", new Date());
      const checkoutDate = parse(checkOut, "yyyy-MM-dd", new Date());
      if (checkoutDate < checkinDate) {
        return NextResponse.json(
          { error: "Check-out must be on or after check-in." },
          { status: 400 }
        );
      }
      preferredStay = `${format(checkinDate, "MMMM d, yyyy")} – ${format(checkoutDate, "MMMM d, yyyy")}`;
    }

    const recipient = process.env.CONTACT_TO_EMAIL!.trim();
    const subjectLabel =
      subject === undefined ? "General enquiry" : SUBJECT_LABELS[subject];

    const html = buildContactEmailHtml({
      name,
      email,
      message,
      subjectLabel,
      phone: phone?.trim() || undefined,
      preferredStay,
    });

    await sendContactMail({
      to: recipient,
      replyTo: email,
      subject: inboxSubjectLine(subject, name),
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact mail error:", err);
    return NextResponse.json(
      { error: "Could not send your message. Please try again later." },
      { status: 500 }
    );
  }
}
