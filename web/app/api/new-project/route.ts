export const runtime = 'edge';

export async function POST(request: Request): Promise<Response> {
  // For now, accept and log. Wire to real backend later.
  const body = await request.json().catch(() => ({}));
  return new Response(JSON.stringify({ ok: true, received: body }), {
    status: 200,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}


