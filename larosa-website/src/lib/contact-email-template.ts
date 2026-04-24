export type ContactEmailPayload = {
  name: string;
  email: string;
  message: string;
  subjectLabel: string;
  phone?: string;
  /** Human-readable stay range, e.g. "April 12, 2026 – April 15, 2026" */
  preferredStay?: string;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string): string {
  const v = value.trim() || "—";
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #ece8e3;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#7a756d;width:140px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:10px 0 10px 16px;border-bottom:1px solid #ece8e3;font-size:15px;color:#1a1814;line-height:1.5;vertical-align:top;">${escapeHtml(v)}</td>
    </tr>`;
}

export function buildContactEmailHtml(payload: ContactEmailPayload): string {
  const { name, email, message, subjectLabel, phone, preferredStay } = payload;
  const safeMessage = escapeHtml(message).replace(/\r\n/g, "\n").replace(/\n/g, "<br/>");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New enquiry</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f1ec;font-family:Georgia,'Times New Roman',serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f1ec;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 12px 40px rgba(26,24,20,0.08);border:1px solid #e8e4de;">
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#a67c52 0%,#c9a66b 50%,#8b6914 100%);"></td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px 32px;">
              <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#a67c52;">La Rosa</p>
              <h1 style="margin:8px 0 0 0;font-size:24px;font-weight:400;color:#1a1814;letter-spacing:-0.02em;">New website enquiry</h1>
              <p style="margin:12px 0 0 0;font-size:14px;color:#5c574f;line-height:1.55;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                Someone submitted the contact form. Reply directly to this email to respond to the guest.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 28px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                ${row("Topic", subjectLabel)}
                ${preferredStay ? row("Preferred stay", preferredStay) : ""}
                ${row("Name", name)}
                ${row("Email", email)}
                ${phone ? row("Phone", phone) : ""}
              </table>
              <p style="margin:24px 0 8px 0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#7a756d;">Message</p>
              <div style="padding:18px 20px;background-color:#faf8f5;border-radius:8px;border:1px solid #ece8e3;font-size:15px;color:#1a1814;line-height:1.65;">
                ${safeMessage}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
              <p style="margin:0;font-size:12px;color:#9a948a;line-height:1.5;">
                This message was sent from the La Rosa website contact form.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
