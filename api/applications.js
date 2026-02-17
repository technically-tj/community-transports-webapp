export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const toEmail = process.env.NOTIFY_TO_EMAIL;

    const { data, error } = await resend.emails.send({
      from: "Community Transports <onboarding@resend.dev>",
      to: [toEmail],
      subject: `New Driver Application`,
      html: `
        <h2>New Driver Application</h2>
        <pre>${JSON.stringify(body, null, 2)}</pre>
      `,
    });

    if (error) {
      return res.status(500).json({ ok: false, error });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
