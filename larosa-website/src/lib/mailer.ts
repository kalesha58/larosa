/**
 * Contact mail (Nodemailer). Set in .env.local:
 * - SMTP_HOST (e.g. smtp.gmail.com)
 * - SMTP_PORT (e.g. 587)
 * - SMTP_SECURE (true for port 465, false for 587)
 * - SMTP_USER, SMTP_PASS (Gmail: use an App Password)
 * - CONTACT_TO_EMAIL (inbox for enquiries)
 * Optional: CONTACT_FROM_EMAIL, CONTACT_FROM_NAME
 */

import nodemailer from "nodemailer";

const REQUIRED = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "CONTACT_TO_EMAIL",
] as const;

export function isMailConfigured(): boolean {
  return REQUIRED.every((key) => {
    const v = process.env[key];
    return typeof v === "string" && v.trim().length > 0;
  });
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!isMailConfigured()) {
    throw new Error("Mail is not configured");
  }
  if (transporter) return transporter;

  const port = Number.parseInt(process.env.SMTP_PORT ?? "587", 10);
  const secure =
    process.env.SMTP_SECURE === "true" || process.env.SMTP_SECURE === "1";

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.isFinite(port) ? port : 587,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

export type SendContactMailInput = {
  to: string;
  replyTo: string;
  subject: string;
  html: string;
};

export async function sendContactMail({
  to,
  replyTo,
  subject,
  html,
}: SendContactMailInput): Promise<void> {
  const transport = getTransporter();
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL?.trim() || process.env.SMTP_USER;
  const fromName = process.env.CONTACT_FROM_NAME?.trim() || "La Rosa — Website";
  const from =
    fromEmail && fromName
      ? `"${fromName.replace(/"/g, "")}" <${fromEmail}>`
      : fromEmail;

  await transport.sendMail({
    from,
    to,
    replyTo,
    subject,
    html,
  });
}
