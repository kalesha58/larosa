import { format } from "date-fns";
import { connectMongo } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";
import { formatPropertyDate } from "@/lib/property-dates";
import { sendContactMail, isMailConfigured } from "./mailer";

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
  razorpayRefundId?: string;
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

function formatStayDate(d: Date): string {
  return formatPropertyDate(d);
}

function buildClientConfirmationEmail(data: BookingEmailData): string {
  const ref = data.bookingId
    ? data.bookingId.slice(0, 12).toUpperCase()
    : "—";
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
    .total-box { background: ${BG_OFF_WHITE}; border-radius: 8px; padding: 24px; text-align: right; }
    .total-label { font-size: 12px; color: ${BRAND_GRAY}; text-transform: uppercase; letter-spacing: 2px; }
    .total-value { font-size: 32px; color: ${BRAND_GOLD}; font-weight: bold; margin-top: 4px; }
    .tag { display: inline-block; padding: 4px 12px; background: ${BRAND_GOLD}20; color: ${BRAND_GOLD}; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px; margin-bottom: 12px; }
    .contract-box { background: ${BG_OFF_WHITE}; border: 1px solid #e5e0d8; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="tag">Reservation Contract</div>
      <h1 class="h1">LaRosa Villas</h1>
      <p style="font-size: 13px; opacity: 0.7; margin: 0; text-transform: uppercase; letter-spacing: 3px;">Booking Confirmation</p>
    </div>
    <div class="content">
      <h2 class="h2">Dear ${data.guestName},</h2>
      <p style="color: #4a4a4a; line-height: 1.8; margin-bottom: 24px; font-size: 15px;">
        Your reservation at <strong>${data.roomTitle}</strong> is confirmed. This email serves as your booking contract.
      </p>

      <div class="contract-box">
        <div class="label">Booking reference</div>
        <div class="value" style="font-family: monospace; margin-bottom: 12px;">${ref}</div>
        <div class="label">Property</div>
        <div class="value">${data.roomTitle} · ${data.roomType}</div>
      </div>

      <div class="grid">
        <div class="grid-item">
          <div class="label">Check-in</div>
          <div class="value">${formatStayDate(data.checkIn)}</div>
        </div>
        <div class="grid-item">
          <div class="label">Check-out</div>
          <div class="value">${formatStayDate(data.checkOut)}</div>
        </div>
        <div class="grid-item">
          <div class="label">Stay length</div>
          <div class="value">${data.nights} night${data.nights === 1 ? "" : "s"}</div>
        </div>
        <div class="grid-item">
          <div class="label">Guests</div>
          <div class="value">${data.guests}</div>
        </div>
      </div>

      ${data.specialRequests ? `
      <div class="label">Special requests</div>
      <div class="value" style="background: ${BG_OFF_WHITE}; padding: 12px; border-radius: 8px;">${data.specialRequests}</div>
      ` : ""}

      <div class="total-box">
        <div class="total-label">Amount paid</div>
        <div class="total-value">₹${data.totalPrice.toLocaleString("en-IN")}</div>
        <p style="font-size: 10px; color: ${BRAND_GRAY}; margin: 8px 0 0;">Payment ID: ${data.razorpayPaymentId || "Verified"}</p>
      </div>

      <div class="divider"></div>

      <p style="font-size: 13px; color: #4a4a4a; line-height: 1.8;">
        <strong>Cancellation policy</strong><br>
        To cancel, use your guest dashboard or contact us. Confirmed paid bookings receive a full refund when cancelled in accordance with our policy.
      </p>
      <p style="font-size: 14px; color: #4a4a4a; line-height: 1.8; margin-top: 16px;">
        Questions? Reply to this email or write to <a href="mailto:info@larosa.co.in" style="color: ${BRAND_GOLD}; text-decoration: none;">info@larosa.co.in</a>.
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
    : `<p style="margin-top: 16px; color: ${BRAND_GRAY}; font-size: 13px;">No payment was captured for this reservation.</p>`;

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
      <p>Your reservation for <strong>${data.roomTitle}</strong> has been cancelled.</p>
      <p style="font-size: 14px; color: #555;">
        <strong>Was:</strong> ${formatStayDate(data.checkIn)} → ${formatStayDate(data.checkOut)}<br>
        ${data.nights} night${data.nights === 1 ? "" : "s"} · ${data.guests} guest${data.guests === 1 ? "" : "s"}
      </p>
      ${refundBlock}
      <p style="font-size: 13px; color: ${BRAND_GRAY}; margin-top: 24px;">
        Questions? Contact <a href="mailto:info@larosa.co.in" style="color: ${BRAND_GOLD};">info@larosa.co.in</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function buildAdminCancellationEmail(data: BookingCancellationEmailData): string {
  const who = data.cancelledBy === "admin" ? "Admin" : "Guest";
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: sans-serif; background: #f4f4f4; padding: 20px;">
  <div style="background: white; border-radius: 8px; padding: 32px; max-width: 600px; margin: 0 auto;">
    <p style="color: #c0392b; font-weight: bold; font-size: 12px; text-transform: uppercase;">Booking cancelled by ${who}</p>
    <h1 style="font-size: 18px;">${data.guestName} — ${data.roomTitle}</h1>
    <p>${formatStayDate(data.checkIn)} → ${formatStayDate(data.checkOut)} · ₹${data.totalPrice.toLocaleString("en-IN")}</p>
    <p>Refund: ${data.refunded ? `Yes (${data.razorpayRefundId || "ID pending"})` : "No payment to refund"}</p>
    <p style="font-size: 11px; color: #999;"><a href="${appUrl()}/admin/bookings">Admin bookings</a></p>
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
    subject: `Reservation Confirmed — ${data.roomTitle} | LaRosa Villas`,
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
    subject: `Booking Cancelled — ${data.roomTitle} | LaRosa Villas`,
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
