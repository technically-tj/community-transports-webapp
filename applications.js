/**
 * api/applications.js
 * Handles new driver application submissions:
 *   - Sends admin email + SMS notification
 *   - Sends applicant confirmation or rejection email
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
  const isEligible = status === 'Eligible';

  const errors = [];
  const resend = new Resend(process.env.RESEND_API_KEY);

  // ── 1. Admin Email ────────────────────────────────────────────
  try {
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
                  <span style="display:inline-block; padding:2px 12px; border-radius:999px; font-weight:600; font-size:14px;
                    background:${isEligible ? '#d1fae5' : '#fee2e2'};
                    color:${isEligible ? '#065f46' : '#991b1b'};">${status}</span>
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
              <a href="https://community-transports.com/admin.html" style="display:inline-block; background:#4f46e5; color:white; padding:10px 24px; border-radius:6px; text-decoration:none; font-weight:600;">
                View in Admin Dashboard
              </a>
            </div>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error('Admin email error:', err);
    errors.push('admin_email: ' + err.message);
  }

  // ── 2. Applicant Confirmation or Rejection Email ──────────────
  try {
    if (isEligible) {
      await resend.emails.send({
        from: 'Community Transports <info@community-transports.com>',
        to: email,
        subject: 'Your Application Was Received — Community Transports',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #4f46e5; color: white; padding: 24px; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 22px;">Application Received!</h1>
              <p style="margin: 4px 0 0; opacity: 0.85;">Community Transports LLC</p>
            </div>
            <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <p style="color: #374151;">Hi ${firstName},</p>
              <p style="color: #374151;">Thank you for applying to drive with Community Transports! We've received your application and our team will be in touch soon with next steps.</p>
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0; color: #065f46; font-weight: 600;">✅ You meet our basic eligibility requirements!</p>
              </div>
              <p style="color: #374151;"><strong>Next steps:</strong></p>
              <ol style="color: #374151; padding-left: 20px; line-height: 1.8;">
                <li>Complete your <strong>drug test</strong> through Clearview Testing (~$25)</li>
                <li>Complete your <strong>background check</strong> through Identogo (~$37)</li>
                <li>Complete <strong>English validation</strong> through Contractor Compliance</li>
              </ol>
              <p style="color: #374151;">You can find links to all three on your application dashboard.</p>
              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px;">Questions? Reply to this email or contact us at <a href="mailto:info@community-transports.com" style="color: #4f46e5;">info@community-transports.com</a></p>
              </div>
            </div>
          </div>
        `,
      });
    } else {
      await resend.emails.send({
        from: 'Community Transports <info@community-transports.com>',
        to: email,
        subject: 'Your Application Status — Community Transports',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #4f46e5; color: white; padding: 24px; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 22px;">Application Received</h1>
              <p style="margin: 4px 0 0; opacity: 0.85;">Community Transports LLC</p>
            </div>
            <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <p style="color: #374151;">Hi ${firstName},</p>
              <p style="color: #374151;">Thank you for your interest in driving with Community Transports. We've reviewed your application and unfortunately you do not currently meet all of our eligibility requirements.</p>
              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0; color: #991b1b; font-weight: 600;">Our current requirements are:</p>
                <ul style="color: #7f1d1d; margin: 8px 0 0; padding-left: 20px; line-height: 1.8;">
                  <li>21 years of age or older</li>
                  <li>Valid driver's license</li>
                  <li>4-door car, van, or SUV less than 15 years old</li>
                  <li>Vehicle registered in Texas</li>
                </ul>
              </div>
              <p style="color: #374151;">If your situation changes in the future, we encourage you to reapply. We'd love to have you on our team when the time is right.</p>
              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px;">Questions? Contact us at <a href="mailto:info@community-transports.com" style="color: #4f46e5;">info@community-transports.com</a></p>
              </div>
            </div>
          </div>
        `,
      });
    }
  } catch (err) {
    console.error('Applicant email error:', err);
    errors.push('applicant_email: ' + err.message);
  }

  // ── 3. Admin SMS via Twilio ───────────────────────────────────
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER;
    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const smsBody = `New CT Application!\nName: ${fullName}\nStatus: ${status}\nEmail: ${email}\nSubmitted: ${submittedTime} CT`;

    await Promise.all(ADMIN_PHONES.map(async (toNumber) => {
      const twilioRes = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({ From: fromNumber, To: toNumber, Body: smsBody }),
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
