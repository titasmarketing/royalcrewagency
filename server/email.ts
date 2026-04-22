/**
 * Email helper using Resend
 * Set RESEND_API_KEY in environment variables to enable email sending.
 * Without the key, all functions log a warning and return gracefully (no crash).
 */

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Royal Crew Agency <noreply@royalcrewagency.com>";

function getClient(): Resend | null {
  if (!RESEND_API_KEY) {
    console.warn("[Email] RESEND_API_KEY not set — email sending is disabled.");
    return null;
  }
  return new Resend(RESEND_API_KEY);
}

// ============================================================================
// HTML TEMPLATES
// ============================================================================

function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Royal Crew Agency</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:#0c1b33;padding:32px 40px;text-align:center;">
              <img src="https://dados.royalcrewagency.com/gallery/1776897529584-r25iv.png" alt="Royal Crew Agency" height="60" style="display:block;margin:0 auto 12px;" />
              <p style="margin:0;color:#D4AF37;font-size:11px;letter-spacing:4px;text-transform:uppercase;font-weight:700;">Premium Event Staffing</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#0c1b33;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px;color:#D4AF37;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">Royal Crew Agency</p>
              <p style="margin:0;color:#8899aa;font-size:11px;">London, UK · contact@royalcrewagency.com · royalcrewagency.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ============================================================================
// EMAIL: Event Confirmed (with invoice PDF attachment)
// ============================================================================

export async function sendEventConfirmedEmail(params: {
  to: string;
  clientName: string;
  eventTitle: string;
  eventDate: string;
  location: string;
  totalPrice: string;
  invoicePdfBase64?: string;
  invoiceFilename?: string;
}): Promise<boolean> {
  const resend = getClient();
  if (!resend) return false;

  const content = `
    <h2 style="margin:0 0 8px;color:#0c1b33;font-size:22px;font-weight:700;">Your Event is Confirmed!</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">Dear ${params.clientName},</p>
    <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
      We are delighted to confirm your upcoming event with Royal Crew Agency. Our elite team is ready to deliver an exceptional experience.
    </p>

    <!-- Event Details Box -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;margin-bottom:24px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 4px;color:#D4AF37;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">Event Details</p>
          <h3 style="margin:4px 0 16px;color:#0c1b33;font-size:18px;font-weight:700;">${params.eventTitle}</h3>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:4px 0;color:#6b7280;font-size:13px;width:120px;">Date</td>
              <td style="padding:4px 0;color:#111827;font-size:13px;font-weight:600;">${params.eventDate}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#6b7280;font-size:13px;">Location</td>
              <td style="padding:4px 0;color:#111827;font-size:13px;font-weight:600;">${params.location || "To be confirmed"}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#6b7280;font-size:13px;">Total</td>
              <td style="padding:4px 0;color:#D4AF37;font-size:15px;font-weight:700;">£ ${params.totalPrice}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${params.invoicePdfBase64 ? `<p style="margin:0 0 16px;color:#374151;font-size:14px;line-height:1.6;">Your invoice is attached to this email. Please review it and do not hesitate to contact us if you have any questions.</p>` : ""}

    <p style="margin:0 0 8px;color:#374151;font-size:14px;line-height:1.6;">
      You can track your event status and access all details through your client portal at any time.
    </p>
    <p style="margin:0;color:#6b7280;font-size:13px;">
      Thank you for choosing Royal Crew Agency. We look forward to making your event unforgettable.
    </p>
    <p style="margin:24px 0 0;color:#0c1b33;font-size:13px;font-weight:700;">The Royal Crew Team</p>
  `;

  try {
    const attachments = params.invoicePdfBase64 && params.invoiceFilename
      ? [{ filename: params.invoiceFilename, content: params.invoicePdfBase64 }]
      : [];

    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `✅ Event Confirmed — ${params.eventTitle}`,
      html: baseTemplate(content),
      attachments,
    });
    console.log(`[Email] Confirmation sent to ${params.to}`);
    return true;
  } catch (err) {
    console.error("[Email] Failed to send confirmation:", err);
    return false;
  }
}

// ============================================================================
// EMAIL: Staff Invited to Event
// ============================================================================

export async function sendStaffInviteEmail(params: {
  to: string;
  staffName: string;
  eventTitle: string;
  eventDate: string;
  location: string;
  role: string;
  payment: string;
}): Promise<boolean> {
  const resend = getClient();
  if (!resend) return false;

  const content = `
    <h2 style="margin:0 0 8px;color:#0c1b33;font-size:22px;font-weight:700;">You've Been Invited to an Event</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">Hi ${params.staffName},</p>
    <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
      Royal Crew Agency would like to invite you to work at the following event. Please log in to your staff portal to accept or decline.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;margin-bottom:24px;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 4px;color:#D4AF37;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">Event Details</p>
          <h3 style="margin:4px 0 16px;color:#0c1b33;font-size:18px;font-weight:700;">${params.eventTitle}</h3>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:4px 0;color:#6b7280;font-size:13px;width:120px;">Date</td>
              <td style="padding:4px 0;color:#111827;font-size:13px;font-weight:600;">${params.eventDate}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#6b7280;font-size:13px;">Location</td>
              <td style="padding:4px 0;color:#111827;font-size:13px;font-weight:600;">${params.location || "To be confirmed"}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#6b7280;font-size:13px;">Your Role</td>
              <td style="padding:4px 0;color:#111827;font-size:13px;font-weight:600;">${params.role}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#6b7280;font-size:13px;">Payment</td>
              <td style="padding:4px 0;color:#D4AF37;font-size:15px;font-weight:700;">£ ${params.payment}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="margin:0;color:#6b7280;font-size:13px;">Log in to your staff portal to respond to this invitation.</p>
    <p style="margin:24px 0 0;color:#0c1b33;font-size:13px;font-weight:700;">The Royal Crew Team</p>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `🎯 New Event Invitation — ${params.eventTitle}`,
      html: baseTemplate(content),
    });
    console.log(`[Email] Staff invite sent to ${params.to}`);
    return true;
  } catch (err) {
    console.error("[Email] Failed to send staff invite:", err);
    return false;
  }
}

// ============================================================================
// EMAIL: Event Reminder (3 days before)
// ============================================================================

export async function sendEventReminderEmail(params: {
  to: string;
  name: string;
  eventTitle: string;
  eventDate: string;
  location: string;
  role: "client" | "staff";
}): Promise<boolean> {
  const resend = getClient();
  if (!resend) return false;

  const isClient = params.role === "client";
  const content = `
    <h2 style="margin:0 0 8px;color:#0c1b33;font-size:22px;font-weight:700;">Your Event is in 3 Days</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">Hi ${params.name},</p>
    <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
      ${isClient
        ? "This is a friendly reminder that your event with Royal Crew Agency is coming up in 3 days. Our team is fully prepared and ready to deliver an exceptional experience."
        : "This is a reminder that you are scheduled to work at the following event in 3 days. Please make sure you are prepared and arrive on time."}
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;margin-bottom:24px;">
      <tr>
        <td style="padding:20px 24px;">
          <h3 style="margin:0 0 12px;color:#0c1b33;font-size:18px;font-weight:700;">${params.eventTitle}</h3>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:4px 0;color:#6b7280;font-size:13px;width:120px;">Date</td>
              <td style="padding:4px 0;color:#111827;font-size:13px;font-weight:600;">${params.eventDate}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#6b7280;font-size:13px;">Location</td>
              <td style="padding:4px 0;color:#111827;font-size:13px;font-weight:600;">${params.location || "To be confirmed"}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="margin:0;color:#6b7280;font-size:13px;">If you have any questions, please contact us at contact@royalcrewagency.com</p>
    <p style="margin:24px 0 0;color:#0c1b33;font-size:13px;font-weight:700;">The Royal Crew Team</p>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `⏰ Reminder — ${params.eventTitle} is in 3 days`,
      html: baseTemplate(content),
    });
    console.log(`[Email] Reminder sent to ${params.to}`);
    return true;
  } catch (err) {
    console.error("[Email] Failed to send reminder:", err);
    return false;
  }
}
