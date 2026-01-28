export const runtime = 'edge';

export async function POST(request: Request): Promise<Response> {
  const contentType = request.headers.get('content-type') || '';
  let data: Record<string, string> = {};
  if (contentType.includes('application/json')) {
    data = await request.json().catch(() => ({}));
  } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
    const form = await request.formData();
    for (const [k, v] of form.entries()) {
      data[k] = typeof v === 'string' ? v : '';
    }
  }
  return new Response(JSON.stringify({ ok: true, received: data }), {
    status: 200,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}


