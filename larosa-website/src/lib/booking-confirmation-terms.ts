const BRAND_DARK = "#1a1510";
const BRAND_GRAY = "#8a7e6e";

export interface ConfirmationTermsParams {
  guests: number;
  totalPrice: number;
  amountPaid: number;
}

function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function sectionHeading(n: number, title: string): string {
  return `<p style="font-size: 15px; font-weight: 600; color: ${BRAND_DARK}; margin: 28px 0 12px;">${n}. ${title}</p>`;
}

function bulletList(items: string[]): string {
  return `<ul style="margin: 0 0 16px; padding-left: 20px; color: #4a4a4a; font-size: 14px; line-height: 1.7;">
    ${items.map((item) => `<li style="margin-bottom: 6px;">${item}</li>`).join("")}
  </ul>`;
}

function subHeading(title: string): string {
  return `<p style="font-size: 14px; font-weight: 600; color: ${BRAND_DARK}; margin: 16px 0 8px;">${title}</p>`;
}

function bodyText(text: string): string {
  return `<p style="font-size: 14px; color: #4a4a4a; line-height: 1.7; margin: 0 0 12px;">${text}</p>`;
}

/** Sections 1–5 from the LaRosa booking confirmation PDF. */
export function buildConfirmationTermsHtml(params: ConfirmationTermsParams): string {
  const { guests, totalPrice, amountPaid } = params;
  const total = formatInr(totalPrice);
  const paid = formatInr(amountPaid);

  return `
    ${sectionHeading(1, "Stay Details")}
    ${bulletList([
      "Check-in Time: 2:00 PM",
      "Check-out Time: 11:00 AM",
      `Number of Guests: ${guests}`,
    ])}
    ${bodyText(
      "Please note that early check-in or late check-out requests are subject to availability and prior approval."
    )}

    ${sectionHeading(2, "Payment Terms")}
    ${bulletList([
      `Total Booking Amount: ${total}`,
      `Amount Paid: ${paid} (collected at the time of booking)`,
      "The amount paid at the time of booking is strictly non-refundable in the event of cancellation, date modification, or no-show.",
      "Full payment for the stay must be completed before the check-in time. Failure to complete payment within the required timeline may result in cancellation of the booking and denial of check-in access.",
    ])}

    ${sectionHeading(3, "House Rules")}
    ${bodyText(
      "To maintain the quality, safety, and comfort of the property, the following rules are strictly enforced. Violations may result in penalties, immediate termination of the stay, and removal from the property without refund."
    )}

    ${subHeading("General Rules")}
    ${bulletList([
      "Smoking is strictly prohibited inside all rooms and indoor areas.",
      "Illegal drugs, narcotics, and any unlawful substances are strictly prohibited anywhere on the property.",
      "Only registered guests are permitted to enter or stay on the premises.",
      "Any increase in the number of guests must be informed and approved before booking confirmation, as additional charges will apply.",
    ])}

    ${subHeading("Unauthorized Guests")}
    ${bodyText(
      "If any unregistered guests or excess guests beyond the confirmed count are found on the property:"
    )}
    ${bulletList([
      "A penalty charge will be imposed per additional person.",
      "The booking may be terminated immediately without refund.",
    ])}

    ${subHeading("Pool Area Rules")}
    ${bulletList([
      "Food and beverages are strictly prohibited inside or near the pool area.",
      "Violations will result in a substantial fine.",
    ])}

    ${subHeading("Property &amp; Damage Policy")}
    ${bulletList([
      "Guests are fully responsible for any damages, breakage, missing items, or misuse of the property caused during the stay.",
      "The security deposit will be returned within 24 hours after check-out, subject to inspection and confirmation that no damages or missing items are found.",
    ])}

    ${subHeading("Late Check-out")}
    ${bulletList([
      "A 15-minute grace period is provided after check-out time.",
      "Beyond this period, late check-out charges will apply on an hourly basis.",
    ])}

    ${subHeading("Restricted Items")}
    ${bodyText(
      "External speakers, party lighting, cooking equipment, gas stoves, or similar items are not permitted without prior approval. Any such requests must be communicated at least 24 hours before check-in."
    )}

    ${sectionHeading(4, "Liability")}
    ${bulletList([
      "Guests are solely responsible for their personal belongings and valuables during their stay.",
      "LaRosa and the host shall not be held liable for any accidents, injuries, loss, theft, or damages occurring during the stay on the property.",
    ])}

    ${sectionHeading(5, "Confirmation")}
    ${bodyText("By replying with &ldquo;I Agree&rdquo; to this email, you confirm that you:")}
    ${bulletList([
      "Accept all terms and conditions stated above.",
      "Agree to comply with all property rules.",
      "Understand that violations may result in fines, cancellation of stay, or removal from the property without refund.",
    ])}
    ${bodyText(
      `We appreciate your cooperation and look forward to hosting you at LaRosa. Our goal is to provide you with a safe, comfortable, and memorable experience.`
    )}
    <p style="font-size: 14px; color: ${BRAND_DARK}; line-height: 1.7; margin: 24px 0 0;">
      Warm regards,<br>
      <strong>LaRosa Villas</strong>
    </p>
  `.trim();
}
