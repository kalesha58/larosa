import { format } from "date-fns";
import { BookingEmailData } from "./booking-mailer";

/**
 * Sends a notification to the admin via MSG91 Flow API.
 * This flow can be configured in MSG91 to send SMS, WhatsApp, or both.
 */
export async function sendAdminBookingNotifications(data: BookingEmailData) {
  const authKey = process.env.MSG91_AUTH_KEY;
  const flowId = process.env.MSG91_FLOW_ID;
  const adminMobile = process.env.ADMIN_PHONE_NUMBER;

  if (!authKey || !flowId || !adminMobile) {
    console.warn("[notifications] MSG91 not fully configured. Missing AUTH_KEY, FLOW_ID, or ADMIN_PHONE_NUMBER.");
    return;
  }

  // Prepare variables for the MSG91 template
  // Ensure these variable names match what you set up in the MSG91 Flow builder
  const payload = {
    flow_id: flowId,
    recipients: [
      {
        mobiles: adminMobile,
        guest_name: data.guestName,
        room_title: data.roomTitle,
        check_in: format(data.checkIn, "dd MMM yyyy"),
        check_out: format(data.checkOut, "dd MMM yyyy"),
        total_price: `INR ${data.totalPrice.toLocaleString("en-IN")}`,
        payment_id: data.razorpayPaymentId || "N/A"
      }
    ]
  };

  try {
    const response = await fetch("https://control.msg91.com/api/v5/flow/", {
      method: "POST",
      headers: {
        "authkey": authKey,
        "content-type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log("[notifications] MSG91 notification sent successfully:", result);
    } else {
      console.error("[notifications] MSG91 API error:", result);
    }
    
    return result;
  } catch (err) {
    console.error("[notifications] Failed to send MSG91 notification:", err);
    throw err;
  }
}

/**
 * Helper to check if MSG91 is configured
 */
export function isMsg91Configured(): boolean {
  return !!(
    process.env.MSG91_AUTH_KEY && 
    process.env.MSG91_FLOW_ID && 
    process.env.ADMIN_PHONE_NUMBER
  );
}
