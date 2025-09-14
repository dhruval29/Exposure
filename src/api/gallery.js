export const runtime = 'edge';

import { list } from '@vercel/blob';

export async function GET() {
  try {
    const result = await list({ prefix: 'gallery/' });
    const images = (result.blobs || []).map(b => ({ url: b.url, pathname: b.pathname, size: b.size, uploadedAt: b.uploadedAt }));
    return new Response(JSON.stringify({ images }), { status: 200, headers: { 'content-type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ images: [] }), { status: 200, headers: { 'content-type': 'application/json' } });
  }
}


