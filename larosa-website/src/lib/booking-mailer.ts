import { format } from "date-fns";
import { sendContactMail, isMailConfigured } from "./mailer";

export interface BookingEmailData {
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

const BRAND_GOLD = "#c9a96e";
const BRAND_DARK = "#1a1510";
const BRAND_GRAY = "#8a7e6e";
const BG_OFF_WHITE = "#faf9f7";

function buildClientEmail(data: BookingEmailData): string {
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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="tag">Reservation Confirmed</div>
      <h1 class="h1">Welcome to La Rosa</h1>
      <p style="font-size: 13px; opacity: 0.7; margin: 0; text-transform: uppercase; letter-spacing: 3px;">The Art of Living Well</p>
    </div>
    <div class="content">
      <h2 class="h2">Dear ${data.guestName},</h2>
      <p style="color: #4a4a4a; line-height: 1.8; margin-bottom: 40px; font-size: 15px;">
        We are delighted to confirm your reservation at <strong>La Rosa Luxury Suites</strong>. 
        Your suite is being prepared with the utmost care for your arrival.
      </p>

      <div class="grid">
        <div class="grid-item">
          <div class="label">Check-in</div>
          <div class="value">${format(data.checkIn, "EEE, MMM dd, yyyy")}</div>
        </div>
        <div class="grid-item">
          <div class="label">Check-out</div>
          <div class="value">${format(data.checkOut, "EEE, MMM dd, yyyy")}</div>
        </div>
        <div class="grid-item">
          <div class="label">Room Selection</div>
          <div class="value">${data.roomTitle} (${data.roomType})</div>
        </div>
        <div class="grid-item">
          <div class="label">Nights & Guests</div>
          <div class="value">${data.nights} Nights • ${data.guests} Guests</div>
        </div>
      </div>

      <div class="total-box">
        <div class="total-label">Amount Paid</div>
        <div class="total-value">₹${data.totalPrice.toLocaleString("en-IN")}</div>
        <p style="font-size: 10px; color: ${BRAND_GRAY}; margin: 8px 0 0;">Transaction ID: ${data.razorpayPaymentId || "Verified"}</p>
      </div>

      <div class="divider"></div>

      <p style="font-size: 14px; color: #4a4a4a; line-height: 1.8;">
        <strong>Need Assistance?</strong><br>
        If you have any special requirements or need to arrange airport transfers, please reply to this email or contact our concierge at <a href="mailto:info@larosa.co.in" style="color: ${BRAND_GOLD}; text-decoration: none;">info@larosa.co.in</a>.
      </p>
    </div>
    <div class="footer">
      <p style="font-size: 12px; color: ${BRAND_GRAY}; margin: 0 0 8px;">128 Elite District, Silk Road, Marina Bay</p>
      <p style="font-size: 11px; color: ${BRAND_GRAY}; opacity: 0.6;">© 2026 La Rosa Luxury Hotel & Villas. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function buildAdminEmail(data: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
    .card { background: white; border-radius: 8px; padding: 32px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; }
    .h1 { font-size: 20px; color: #333; margin-top: 0; border-bottom: 2px solid ${BRAND_GOLD}; padding-bottom: 12px; }
    .section { margin-bottom: 24px; }
    .label { font-size: 11px; color: #999; text-transform: uppercase; margin-bottom: 4px; font-weight: bold; }
    .value { font-size: 14px; color: #333; margin-bottom: 12px; }
    .price { font-size: 20px; color: ${BRAND_GOLD}; font-weight: bold; }
    .alert { background: ${BRAND_GOLD}10; color: ${BRAND_GOLD}; padding: 8px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; display: inline-block; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="alert">New Confirmed Booking</div>
    <h1 class="h1">Reservation Details</h1>
    
    <div class="section">
      <div class="label">Guest Information</div>
      <div class="value"><strong>${data.guestName}</strong></div>
      <div class="value">${data.guestEmail}</div>
      ${data.guestPhone ? `<div class="value">${data.guestPhone}</div>` : ""}
    </div>

    <div class="section">
      <div class="label">Stay Information</div>
      <div class="value"><strong>${data.roomTitle}</strong> (${data.roomType})</div>
      <div class="value">${format(data.checkIn, "MMM dd")} — ${format(data.checkOut, "MMM dd, yyyy")} (${data.nights} nights)</div>
      <div class="value">${data.guests} Guests</div>
    </div>

    ${data.specialRequests ? `
    <div class="section">
      <div class="label">Special Requests</div>
      <div class="value" style="background: #f9f9f9; padding: 12px; border-radius: 4px;">${data.specialRequests}</div>
    </div>
    ` : ""}

    <div class="section" style="border-top: 1px solid #eee; pt: 16px;">
      <div class="label">Financials</div>
      <div class="price">₹${data.totalPrice.toLocaleString("en-IN")}</div>
      <div class="value" style="font-size: 11px; color: #999;">Razorpay ID: ${data.razorpayPaymentId || "N/A"}</div>
    </div>

    <p style="font-size: 11px; color: #999; margin-top: 32px;">
      Manage this booking in the <a href="${process.env.NEXT_PUBLIC_APP_URL || ""}/admin/bookings">Admin Dashboard</a>.
    </p>
  </div>
</body>
</html>
  `.trim();
}

export async function sendBookingEmails(data: BookingEmailData) {
  if (!isMailConfigured()) {
    console.warn("[booking-mailer] Mail not configured, skipping emails.");
    return;
  }

  const adminEmail = process.env.CONTACT_TO_EMAIL || "admin@larosa.co.in";

  try {
    // 1. Send to Guest
    await sendContactMail({
      to: data.guestEmail,
      replyTo: adminEmail,
      subject: `Booking Confirmed — La Rosa | ${data.roomTitle}`,
      html: buildClientEmail(data),
    });

    // 2. Send to Admin
    await sendContactMail({
      to: adminEmail,
      replyTo: data.guestEmail,
      subject: `NEW BOOKING: ${data.guestName} — ${data.roomTitle}`,
      html: buildAdminEmail(data),
    });

    console.log("[booking-mailer] Both emails sent successfully.");
  } catch (err) {
    console.error("[booking-mailer] Failed to send emails:", err);
    throw err;
  }
}
