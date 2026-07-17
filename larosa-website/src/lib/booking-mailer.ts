import { connectMongo } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";
import { formatPropertyDate, formatStayPeriod } from "@/lib/property-dates";
import { buildConfirmationTermsHtml } from "@/lib/booking-confirmation-terms";
import { sendContactMail, isMailConfigured } from "./mailer";
import {
  CANCELLATION_REASON_LABELS,
  type GuestCancelFeedbackInput,
} from "./cancellation-feedback";
import { SITE_EMAIL, SITE_MOBILE_DISPLAY } from "./contact-info";
import { absoluteUrl } from "@/lib/site-url";

const EMAIL_LOGO_PATH = "/larosa-logo-email.svg";

export interface BookingEmailData {
  bookingId?: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  roomTitle: string;
  roomType: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: number;
  totalPrice: number;
  razorpayPaymentId?: string;
  specialRequests?: string;
}

export interface BookingCancellationEmailData extends BookingEmailData {
  cancelledBy: "admin" | "guest";
  refunded: boolean;
  /** Paid booking cancelled without an automatic Razorpay refund */
  refundPending?: boolean;
  razorpayRefundId?: string;
  guestFeedback?: GuestCancelFeedbackInput;
}

const BRAND_GOLD = "#c9a96e";
const BRAND_DARK = "#1a1510";
const BRAND_GRAY = "#8a7e6e";
const BG_OFF_WHITE = "#faf9f7";

function adminInbox(): string {
  return process.env.CONTACT_TO_EMAIL?.trim() || "admin@larosa.co.in";
}

function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL?.trim() || "";
}

function emailLogoUrl(): string {
  const custom = process.env.EMAIL_LOGO_URL?.trim();
  if (custom) return custom;
  return absoluteUrl(EMAIL_LOGO_PATH);
}

function formatStayDate(d: Date): string {
  return formatPropertyDate(d);
}

function feedbackHtmlBlock(feedback?: GuestCancelFeedbackInput): string {
  if (!feedback) return "";
  const reasonLabel =
    feedback.reason === "other" && feedback.reasonOther?.trim()
      ? `Other — ${feedback.reasonOther.trim()}`
      : CANCELLATION_REASON_LABELS[feedback.reason];
  const wouldBookLabels = { yes: "Yes", no: "No", maybe: "Maybe" };
  return `
    <div style="margin-top: 20px; padding: 16px; background: ${BG_OFF_WHITE}; border-radius: 8px; border: 1px solid #e5e0d8;">
      <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: ${BRAND_GRAY}; font-weight: bold; margin: 0 0 12px;">Guest feedback</p>
      <p style="font-size: 14px; color: #444; margin: 0 0 8px;"><strong>Reason:</strong> ${reasonLabel}</p>
      ${feedback.experienceRating ? `<p style="font-size: 14px; color: #444; margin: 0 0 8px;"><strong>Experience:</strong> ${feedback.experienceRating}/5</p>` : ""}
      ${feedback.wouldBookAgain ? `<p style="font-size: 14px; color: #444; margin: 0 0 8px;"><strong>Would book again:</strong> ${wouldBookLabels[feedback.wouldBookAgain]}</p>` : ""}
      ${feedback.comments?.trim() ? `<p style="font-size: 14px; color: #444; margin: 0;"><strong>Comments:</strong> ${feedback.comments.trim()}</p>` : ""}
    </div>
  `;
}

function buildClientConfirmationEmail(data: BookingEmailData): string {
  const ref = data.bookingId
    ? data.bookingId.slice(0, 12).toUpperCase()
    : "—";
  const stayPeriod = formatStayPeriod(data.checkIn, data.checkOut);
  const termsHtml = buildConfirmationTermsHtml({
    guests: data.guests,
    totalPrice: data.totalPrice,
    amountPaid: data.totalPrice,
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: ${BG_OFF_WHITE}; margin: 0; padding: 40px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #e5e0d8; }
    .header { padding: 48px 40px; background: ${BRAND_DARK}; color: white; text-align: center; }
    .content { padding: 48px 40px; }
    .footer { padding: 32px 40px; background: ${BG_OFF_WHITE}; border-top: 1px solid #e5e0d8; text-align: center; }
    .h1 { font-size: 28px; margin: 0 0 12px; font-weight: 300; letter-spacing: 1px; color: white; }
    .h2 { font-size: 20px; margin: 0 0 24px; color: ${BRAND_DARK}; font-weight: 600; }
    .label { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: ${BRAND_GRAY}; font-weight: bold; margin-bottom: 4px; }
    .value { font-size: 15px; color: ${BRAND_DARK}; margin-bottom: 20px; }
    .grid { display: flex; flex-wrap: wrap; margin-bottom: 32px; }
    .grid-item { flex: 1; min-width: 50%; margin-bottom: 24px; }
    .divider { height: 1px; background: #e5e0d8; margin: 32px 0; }
    .total-box { background: ${BG_OFF_WHITE}; border-radius: 8px; padding: 24px; text-align: right; margin-bottom: 32px; }
    .total-label { font-size: 12px; color: ${BRAND_GRAY}; text-transform: uppercase; letter-spacing: 2px; }
    .total-value { font-size: 32px; color: ${BRAND_GOLD}; font-weight: bold; margin-top: 4px; }
    .tag { display: inline-block; padding: 4px 12px; background: ${BRAND_GOLD}20; color: ${BRAND_GOLD}; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px; margin-bottom: 12px; }
    .contract-box { background: ${BG_OFF_WHITE}; border: 1px solid #e5e0d8; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
    .cta-box { background: ${BRAND_GOLD}15; border: 1px solid ${BRAND_GOLD}40; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <a href="${appUrl() || absoluteUrl("/")}" style="display: inline-block; text-decoration: none;">
        <img
          src="${emailLogoUrl()}"
          alt="LaRosa Villas"
          width="160"
          style="display: block; margin: 0 auto 20px; border: 0; outline: none; text-decoration: none; max-width: 160px; height: auto;"
        />
      </a>
      <div class="tag">Reservation Contract</div>
      <p style="font-size: 13px; opacity: 0.85; margin: 12px 0 0; text-transform: uppercase; letter-spacing: 3px;">Booking Confirmation</p>
    </div>
    <div class="content">
      <h2 class="h2">Dear ${data.guestName},</h2>
      <p style="color: #4a4a4a; line-height: 1.8; margin-bottom: 16px; font-size: 15px;">
        Thank you for choosing <strong>LaRosa ${data.roomTitle}</strong>. This email serves as the official
        confirmation of your booking for the period ${stayPeriod}.
      </p>
      <p style="color: #4a4a4a; line-height: 1.8; margin-bottom: 24px; font-size: 15px;">
        To ensure a smooth and comfortable experience for all guests, we kindly request
        that you carefully review the following terms and conditions. By replying to this
        email with &ldquo;I Agree,&rdquo; you confirm that you have read, understood, and accepted all
        terms outlined below.
      </p>

      <div class="contract-box">
        <div class="label">Booking reference</div>
        <div class="value" style="font-family: monospace; margin-bottom: 12px;">${ref}</div>
        <div class="label">Property</div>
        <div class="value" style="margin-bottom: 0;">${data.roomTitle} · ${data.roomType}</div>
      </div>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
        <tr>
          <td width="50%" valign="top" style="padding: 0 8px 24px 0;">
            <div class="label">Check-in</div>
            <div class="value" style="margin-bottom: 0;">${formatStayDate(data.checkIn)}</div>
          </td>
          <td width="50%" valign="top" style="padding: 0 0 24px 8px;">
            <div class="label">Check-out</div>
            <div class="value" style="margin-bottom: 0;">${formatStayDate(data.checkOut)}</div>
          </td>
        </tr>
        <tr>
          <td width="50%" valign="top" style="padding: 0 8px 0 0;">
            <div class="label">Stay length</div>
            <div class="value" style="margin-bottom: 0;">${data.nights} night${data.nights === 1 ? "" : "s"}</div>
          </td>
          <td width="50%" valign="top" style="padding: 0 0 0 8px;">
            <div class="label">Guests</div>
            <div class="value" style="margin-bottom: 0;">${data.guests}</div>
          </td>
        </tr>
      </table>

      ${data.specialRequests ? `
      <div class="label">Special requests</div>
      <div class="value" style="background: ${BG_OFF_WHITE}; padding: 12px; border-radius: 8px;">${data.specialRequests}</div>
      ` : ""}

      <div class="total-box">
        <div class="total-label">Amount paid</div>
        <div class="total-value">₹${data.totalPrice.toLocaleString("en-IN")}</div>
        <p style="font-size: 10px; color: ${BRAND_GRAY}; margin: 8px 0 0;">Payment ID: ${data.razorpayPaymentId || "Verified"}</p>
      </div>

      <div class="cta-box">
        <p style="font-size: 14px; color: ${BRAND_DARK}; margin: 0; line-height: 1.6;">
          Please reply to this email with <strong>&ldquo;I Agree&rdquo;</strong> to confirm acceptance of all terms and conditions.
        </p>
      </div>

      <div class="divider"></div>

      ${termsHtml}

      <div class="divider"></div>

      <p style="font-size: 13px; color: #4a4a4a; line-height: 1.8; margin-top: 16px;">
        Questions? Contact us at
        <a href="mailto:${SITE_EMAIL}" style="color: ${BRAND_GOLD}; text-decoration: none;">${SITE_EMAIL}</a>
        or ${SITE_MOBILE_DISPLAY}.
      </p>
    </div>
    <div class="footer">
      <p style="font-size: 11px; color: ${BRAND_GRAY}; opacity: 0.6;">© 2026 LaRosa Villas. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function buildAdminConfirmationEmail(data: BookingEmailData): string {
  const ref = data.bookingId
    ? data.bookingId.slice(0, 12).toUpperCase()
    : "—";
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: sans-serif; background: #f4f4f4; margin: 0; padding: 20px;">
  <div style="background: white; border-radius: 8px; padding: 32px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
    <p style="background: ${BRAND_GOLD}10; color: ${BRAND_GOLD}; padding: 8px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; display: inline-block;">New confirmed booking</p>
    <h1 style="font-size: 20px; border-bottom: 2px solid ${BRAND_GOLD}; padding-bottom: 12px;">Reservation details</h1>
    <p style="font-size: 11px; color: #999;">Ref: ${ref}</p>
    <p><strong>${data.guestName}</strong><br>${data.guestEmail}${data.guestPhone ? `<br>${data.guestPhone}` : ""}</p>
    <p><strong>${data.roomTitle}</strong> (${data.roomType})<br>
    ${formatStayDate(data.checkIn)} → ${formatStayDate(data.checkOut)} · ${data.nights} nights · ${data.guests} guests</p>
    ${data.specialRequests ? `<p><em>Requests:</em> ${data.specialRequests}</p>` : ""}
    <p style="font-size: 20px; color: ${BRAND_GOLD}; font-weight: bold;">₹${data.totalPrice.toLocaleString("en-IN")}</p>
    <p style="font-size: 11px; color: #999;">Razorpay: ${data.razorpayPaymentId || "N/A"}</p>
    <p style="font-size: 11px; color: #999; margin-top: 24px;">
      <a href="${appUrl()}/admin/bookings">Open admin bookings</a>
    </p>
  </div>
</body>
</html>
  `.trim();
}

function buildGuestCancellationEmail(data: BookingCancellationEmailData): string {
  const refundBlock = data.refunded
    ? `<p style="margin-top: 16px; padding: 16px; background: ${BG_OFF_WHITE}; border-radius: 8px;">
        <strong>Refund issued:</strong> ₹${data.totalPrice.toLocaleString("en-IN")}<br>
        <span style="font-size: 11px; color: ${BRAND_GRAY};">Refund ID: ${data.razorpayRefundId || "Processing"}</span>
      </p>`
    : data.refundPending
      ? data.cancelledBy === "guest"
        ? `<p style="margin-top: 16px; padding: 16px; background: ${BG_OFF_WHITE}; border-radius: 8px;">
        <strong>Refund initiated:</strong> ₹${data.totalPrice.toLocaleString("en-IN")}<br>
        <span style="font-size: 13px; color: ${BRAND_GRAY}; line-height: 1.6;">
          Your refund has been initiated and will reflect in your bank account within <strong>2–3 business days</strong>.
        </span>
      </p>`
        : `<p style="margin-top: 16px; padding: 16px; background: ${BG_OFF_WHITE}; border-radius: 8px;">
        <strong>Refund pending:</strong> ₹${data.totalPrice.toLocaleString("en-IN")}<br>
        <span style="font-size: 13px; color: ${BRAND_GRAY};">Your refund will be processed manually within 5–7 business days.</span>
      </p>`
      : `<p style="margin-top: 16px; color: ${BRAND_GRAY}; font-size: 13px;">No payment was captured for this reservation.</p>`;

  const intro =
    data.cancelledBy === "admin"
      ? `<p>We regret to inform you that your reservation for <strong>${data.roomTitle}</strong> has been cancelled by our team. We apologise for any inconvenience.</p>`
      : `<p>Your reservation for <strong>${data.roomTitle}</strong> has been cancelled as requested. We're sorry your plans changed — we hope to welcome you another time.</p>`;

  const ref = data.bookingId
    ? data.bookingId.slice(0, 12).toUpperCase()
    : "—";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background: ${BG_OFF_WHITE}; padding: 40px;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; border: 1px solid #e5e0d8; overflow: hidden;">
    <div style="background: ${BRAND_DARK}; color: white; padding: 32px; text-align: center;">
      <p style="font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: ${BRAND_GOLD}; margin: 0 0 8px;">Cancellation confirmed</p>
      <h1 style="font-weight: 300; margin: 0;">LaRosa Villas</h1>
    </div>
    <div style="padding: 32px;">
      <p>Dear ${data.guestName},</p>
      ${intro}
      <p style="font-size: 11px; color: ${BRAND_GRAY}; margin: 12px 0;">Booking ref: ${ref}</p>
      <p style="font-size: 14px; color: #555;">
        <strong>Property:</strong> ${data.roomTitle} · ${data.roomType}<br>
        <strong>Check-in:</strong> ${formatStayDate(data.checkIn)}<br>
        <strong>Check-out:</strong> ${formatStayDate(data.checkOut)}<br>
        ${data.nights} night${data.nights === 1 ? "" : "s"} · ${data.guests} guest${data.guests === 1 ? "" : "s"} · ₹${data.totalPrice.toLocaleString("en-IN")}
      </p>
      ${refundBlock}
      <p style="font-size: 13px; color: ${BRAND_GRAY}; margin-top: 24px;">
        Questions? Contact <a href="mailto:${SITE_EMAIL}" style="color: ${BRAND_GOLD};">${SITE_EMAIL}</a>
        or ${SITE_MOBILE_DISPLAY}.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function buildAdminCancellationEmail(data: BookingCancellationEmailData): string {
  const who = data.cancelledBy === "admin" ? "Admin" : "Guest";
  const ref = data.bookingId
    ? data.bookingId.slice(0, 12).toUpperCase()
    : "—";
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: sans-serif; background: #f4f4f4; padding: 20px;">
  <div style="background: white; border-radius: 8px; padding: 32px; max-width: 600px; margin: 0 auto;">
    <p style="color: #c0392b; font-weight: bold; font-size: 12px; text-transform: uppercase;">Booking cancelled by ${who}</p>
    <h1 style="font-size: 18px;">${data.guestName} — ${data.roomTitle}</h1>
    <p style="font-size: 11px; color: #999;">Ref: ${ref}</p>
    <p><strong>${data.guestName}</strong><br>${data.guestEmail}${data.guestPhone ? `<br>${data.guestPhone}` : ""}</p>
    <p><strong>${data.roomTitle}</strong> (${data.roomType})<br>
    Check-in: ${formatStayDate(data.checkIn)}<br>
    Check-out: ${formatStayDate(data.checkOut)}<br>
    ${data.nights} nights · ${data.guests} guests</p>
    <p style="font-size: 18px; color: ${BRAND_GOLD}; font-weight: bold;">₹${data.totalPrice.toLocaleString("en-IN")}</p>
    <p>Refund: ${
      data.refunded
        ? `Yes (${data.razorpayRefundId || "ID pending"})`
        : data.refundPending
          ? data.cancelledBy === "guest"
            ? `Initiate manually — ₹${data.totalPrice.toLocaleString("en-IN")} (guest notified: 2–3 business days)`
            : `Manual refund required — ₹${data.totalPrice.toLocaleString("en-IN")} (payment ${data.razorpayPaymentId || "N/A"})`
          : "No payment to refund"
    }</p>
    ${feedbackHtmlBlock(data.guestFeedback)}
    <p style="font-size: 11px; color: #999; margin-top: 24px;">
      <a href="${appUrl()}/admin/bookings">Admin bookings</a>
      ${data.guestFeedback ? ` · <a href="${appUrl()}/admin/feedback">View feedback</a>` : ""}
    </p>
  </div>
</body>
</html>
  `.trim();
}

export async function sendBookingEmails(data: BookingEmailData): Promise<void> {
  if (!isMailConfigured()) {
    console.warn("[booking-mailer] Mail not configured, skipping emails.");
    return;
  }

  const adminEmail = adminInbox();

  await sendContactMail({
    to: data.guestEmail,
    replyTo: adminEmail,
    subject: `Booking Confirmation — ${data.roomTitle} | LaRosa Villas`,
    html: buildClientConfirmationEmail(data),
  });

  await sendContactMail({
    to: adminEmail,
    replyTo: data.guestEmail,
    subject: `NEW BOOKING: ${data.guestName} — ${data.roomTitle}`,
    html: buildAdminConfirmationEmail(data),
  });
}

/** Idempotent: sends confirmation emails once per booking. */
export async function sendBookingConfirmationEmailsIfNeeded(
  bookingId: string,
  data: BookingEmailData
): Promise<boolean> {
  await connectMongo();
  const existing = await Booking.findById(bookingId)
    .select("confirmationEmailSentAt")
    .lean();
  if (!existing) return false;
  if (existing.confirmationEmailSentAt) return false;

  if (!isMailConfigured()) {
    console.warn("[booking-mailer] Mail not configured, skipping confirmation.");
    return false;
  }

  await sendBookingEmails({ ...data, bookingId });
  await Booking.findByIdAndUpdate(bookingId, {
    confirmationEmailSentAt: new Date(),
  });
  return true;
}

export async function sendBookingCancellationEmails(
  data: BookingCancellationEmailData
): Promise<void> {
  if (!isMailConfigured()) {
    console.warn("[booking-mailer] Mail not configured, skipping cancellation emails.");
    return;
  }

  const adminEmail = adminInbox();

  await sendContactMail({
    to: data.guestEmail,
    replyTo: adminEmail,
    subject:
      data.cancelledBy === "admin"
        ? `Reservation Cancelled by LaRosa — ${data.roomTitle}`
        : `Booking Cancelled — ${data.roomTitle} | LaRosa Villas`,
    html: buildGuestCancellationEmail(data),
  });

  await sendContactMail({
    to: adminEmail,
    replyTo: data.guestEmail,
    subject: `CANCELLED: ${data.guestName} — ${data.roomTitle}`,
    html: buildAdminCancellationEmail(data),
  });
}

/** Map a booking document to email payload fields. */
export function bookingToEmailData(booking: {
  _id: { toString(): string };
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  roomTitle: string;
  roomType: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: number;
  totalPrice: number;
  razorpayPaymentId?: string;
  specialRequests?: string;
}): BookingEmailData {
  return {
    bookingId: booking._id.toString(),
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    guestPhone: booking.guestPhone,
    roomTitle: booking.roomTitle,
    roomType: booking.roomType,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    nights: booking.nights,
    guests: booking.guests,
    totalPrice: booking.totalPrice,
    razorpayPaymentId: booking.razorpayPaymentId,
    specialRequests: booking.specialRequests,
  };
}
