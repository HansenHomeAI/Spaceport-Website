import { NextResponse } from 'next/server';
import { css as viewerCss, js as viewerJs } from '@playcanvas/supersplat-viewer';

const ASSETS: Record<string, { body: string; contentType: string }> = {
  'assets.css': { body: viewerCss, contentType: 'text/css; charset=utf-8' },
  'runtime.js': { body: viewerJs, contentType: 'application/javascript; charset=utf-8' },
};

export const dynamic = 'force-static';

interface Params {
  asset: string;
}

export function GET(_: Request, { params }: { params: Params }) {
  const entry = ASSETS[params.asset];
  if (!entry) {
    return new NextResponse('Not Found', { status: 404 });
  }
  return new NextResponse(entry.body, {
    headers: {
      'content-type': entry.contentType,
      'cache-control': 'public, max-age=3600',
    },
  });
}
