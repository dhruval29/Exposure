export const runtime = 'edge';

import { put } from '@vercel/blob';

const getBearerToken = (req) => {
  const auth = req.headers.get('authorization') || '';
  const parts = auth.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') return parts[1];
  return null;
};

export async function POST(req) {
  const token = getBearerToken(req);
  if (!token || token !== process.env.ADMIN_UPLOAD_TOKEN) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } });
  }

  const form = await req.formData();
  const file = form.get('file');
  const alt = form.get('alt') || '';
  const title = form.get('title') || '';

  if (!file || typeof file === 'string') {
    return new Response(JSON.stringify({ error: 'File missing' }), { status: 400, headers: { 'content-type': 'application/json' } });
  }

  const safeName = `${Date.now()}-${file.name}`.replace(/[^a-zA-Z0-9_.-]/g, '_');

  try {
    const blob = await put(`gallery/${safeName}`, file, { access: 'public' });
    return new Response(JSON.stringify({ url: blob.url, alt, title }), { status: 200, headers: { 'content-type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Upload failed' }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}


