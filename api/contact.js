export const runtime = 'edge';

export async function POST(req) {
  const payload = await req.json().catch(() => null);
  if (!payload) return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'content-type': 'application/json' } });

  const { name = '', email = '', message = '' } = payload;
  if (!email || !message) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400, headers: { 'content-type': 'application/json' } });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM || 'no-reply@your-domain.com';

  if (!apiKey || !to) {
    return new Response(JSON.stringify({ error: 'Email not configured' }), { status: 500, headers: { 'content-type': 'application/json' } });
  }

  const subject = `New contact form message from ${name || email}`;
  const html = `<p><strong>Name:</strong> ${name || 'N/A'}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${(message || '').replace(/\n/g, '<br/>')}</p>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ from, to, subject, html })
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'Failed to send' }), { status: 500, headers: { 'content-type': 'application/json' } });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
}


