export const runtime = 'edge';

export async function GET(): Promise<Response> {
  return new Response('ok', {
    status: 200,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}


