/**
 * api/applications.js
 * 
 * Serverless API route (Vercel / Next.js compatible).
 * Handles new driver application submissions:
 *   - Sends admin email via Resend
 *   - Sends admin SMS via Twilio
 * 
 * Required environment variables:
 *   RESEND_API_KEY         — from https://resend.com
 *   TWILIO_ACCOUNT_SID     — from https://console.twilio.com
 *   TWILIO_AUTH_TOKEN      — from https://console.twilio.com
 *   TWILIO_FROM_NUMBER     — your Twilio phone number (e.g. +12813334444)
 */

import { Resend } from 'resend';

const ADMIN_EMAIL = process.env.NOTIFY_TO_EMAIL || 'info@community-transports.com';
const ADMIN_PHONES = (process.env.TWILIO_TO_NUMBER || "+13464090831").split(",").map(n => n.trim()).filter(Boolean);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const application = req.body;
  const { firstName, lastName, email, status, districts = [], submittedAt } = application;
  const fullName = `${firstName} ${lastName}`;
  const submittedTime = new Date(submittedAt).toLocaleString('en-US', { timeZone: 'America/Chicago' });
  const districtList = districts.length > 0 ? districts.join(', ') : 'None selected';

  const errors = [];

  // ── 1. Send Email via Resend ────────────────────────────
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Community Transports <info@community-transports.com>',
      to: ADMIN_EMAIL,
      subject: `New Driver Application: ${fullName} — ${status}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #4f46e5; color: white; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 22px;">New Driver Application Submitted</h1>
            <p style="margin: 4px 0 0; opacity: 0.85;">Community Transports LLC</p>
          </div>
          <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; width: 140px;">Applicant Name</td>
                <td style="padding: 8px 0; font-weight: 600;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Email</td>
                <td style="padding: 8px 0;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Eligibility Status</td>
                <td style="padding: 8px 0;">
                  <span style="
                    display: inline-block;
                    padding: 2px 12px;
                    border-radius: 999px;
                    font-weight: 600;
                    font-size: 14px;
                    background: ${status === 'Eligible' ? '#d1fae5' : '#fef3c7'};
                    color: ${status === 'Eligible' ? '#065f46' : '#92400e'};
                  ">${status}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Submitted</td>
                <td style="padding: 8px 0;">${submittedTime} (CT)</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Districts</td>
                <td style="padding: 8px 0;">${districtList}</td>
              </tr>
            </table>
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
              <a href="https://community-transports.com/admin.html" style="
                display: inline-block;
                background: #4f46e5;
                color: white;
                padding: 10px 24px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
              ">View in Admin Dashboard</a>
            </div>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error('Email error:', err);
    errors.push('email: ' + err.message);
  }

  // ── 2. Send SMS via Twilio (supports multiple recipients) ─
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER;
    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const smsBody = `New CT Application!\nName: ${fullName}\nStatus: ${status}\nEmail: ${email}\nSubmitted: ${submittedTime} CT`;

    // Send to all admin phone numbers
    await Promise.all(ADMIN_PHONES.map(async (toNumber) => {
      const twilioRes = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            From: fromNumber,
            To: toNumber,
            Body: smsBody,
          }),
        }
      );
      if (!twilioRes.ok) {
        const errData = await twilioRes.json();
        throw new Error(`SMS to ${toNumber} failed: ` + (errData.message || 'Twilio error'));
      }
    }));
  } catch (err) {
    console.error('SMS error:', err);
    errors.push('sms: ' + err.message);
  }

  if (errors.length > 0) {
    return res.status(207).json({ ok: false, errors });
  }

  return res.status(200).json({ ok: true });
}
