export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const { name, email, company, service, budget, message, website } = req.body || {};

    // Honeypot field: silently accept obvious bot submissions.
    if (website) {
      return res.status(200).json({ ok: true });
    }

    if (!name || !email || !message) {
      return res.status(400).json({
        ok: false,
        message: "Please provide your name, email, and message."
      });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        ok: false,
        message: "Email service is not configured yet."
      });
    }

    const safe = (value = "") =>
      String(value).replace(/[<>]/g, "").trim();

    const subject = `New Veylora enquiry from ${safe(name)}`;

    const html = `
      <h2>New Veylora project enquiry</h2>
      <p><strong>Name:</strong> ${safe(name)}</p>
      <p><strong>Email:</strong> ${safe(email)}</p>
      <p><strong>Company:</strong> ${safe(company) || "Not provided"}</p>
      <p><strong>Service:</strong> ${safe(service) || "Not provided"}</p>
      <p><strong>Budget:</strong> ${safe(budget) || "Not provided"}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <p>${safe(message).replace(/\n/g, "<br />")}</p>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "Veylora Website <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO || "veylora.info@gmail.com"],
        reply_to: safe(email),
        subject,
        html
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({
        ok: false,
        message: "Unable to send your enquiry right now."
      });
    }

    return res.status(200).json({ ok: true, id: data.id });
  } catch {
    return res.status(500).json({
      ok: false,
      message: "Something went wrong. Please try again."
    });
  }
}
