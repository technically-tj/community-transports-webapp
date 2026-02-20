import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    // Initialize Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Insert into database
    const { error: dbError } = await supabase
      .from("applications")
      .insert([{
        user_id: null, // you can wire auth later
        eligible: body.status === "Eligible",
        created_at: body.submittedAt ?? new Date().toISOString(),

        first_name: body.firstName,
        last_name: body.lastName,
        email: body.email,
        status: body.status,
        submitted_at: body.submittedAt ?? new Date().toISOString(),
        districts: body.districts,
        payload: body
      }]);

    if (dbError) {
      console.error("Database error:", dbError);
      return res.status(500).json({ ok: false, error: dbError.message });
    }

    // Send email notification
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Community Transports <onboarding@resend.dev>",
      to: [process.env.NOTIFY_TO_EMAIL],
      subject: "New Driver Application",
      html: `
        <h2>New Driver Application</h2>
        <pre>${JSON.stringify(body, null, 2)}</pre>
      `,
    });

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
