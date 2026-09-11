# Veylora contact form setup

The website now includes a Vercel serverless contact endpoint at `/api/contact`.

## Before deployment

1. Create a Resend account and obtain an API key.
2. In Vercel Project Settings → Environment Variables, add:
   - `RESEND_API_KEY`
   - `CONTACT_TO=veylora.info@gmail.com`
   - `EMAIL_FROM=Veylora Technologies <your-verified-domain-email>`
3. For production, verify the Veylora domain in Resend and use an email from that verified domain as `EMAIL_FROM`.
4. Deploy/redeploy on Vercel.

The form sends replies to `veylora.info@gmail.com` and sets the visitor's email as Reply-To.
