import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'node:stream';
import {
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

const DEFAULT_REGION = process.env.AWS_REGION || 'us-west-2';
const s3 = new S3Client({ region: DEFAULT_REGION });

const decodeSegments = (segments?: string[]) => (segments || []).map((segment) => decodeURIComponent(segment));

const extractTarget = (segments?: string[]) => {
  const decoded = decodeSegments(segments);
  const [bucket, ...rest] = decoded;
  const key = rest.join('/');
  return { bucket, key };
};

const toWebStream = (body: any) => {
  if (!body) {
    return null;
  }
  if (typeof body.transformToWebStream === 'function') {
    return body.transformToWebStream();
  }
  return Readable.toWeb(body);
};

const buildHeaders = (result: any) => {
  const headers = new Headers();
  if (result.ContentType) headers.set('content-type', result.ContentType);
  if (result.ContentLength != null) headers.set('content-length', String(result.ContentLength));
  if (result.ETag) headers.set('etag', result.ETag);
  if (result.LastModified) headers.set('last-modified', result.LastModified.toUTCString());
  if (result.ContentRange) headers.set('content-range', result.ContentRange);
  headers.set('cache-control', 'private, max-age=60');
  return headers;
};

async function streamObject(range: string | null, bucket: string, key: string) {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key, Range: range ?? undefined });
  const result = await s3.send(command);
  const stream = toWebStream(result.Body);
  if (!stream) {
    return NextResponse.json({ error: 'Empty object' }, { status: 502 });
  }
  const headers = buildHeaders(result);
  return new NextResponse(stream, {
    status: range ? 206 : 200,
    headers,
  });
}

async function headObject(bucket: string, key: string) {
  const command = new HeadObjectCommand({ Bucket: bucket, Key: key });
  const result = await s3.send(command);
  const headers = buildHeaders(result);
  return new NextResponse(null, { status: 200, headers });
}

const ensureTarget = (bucket?: string, key?: string) => {
  if (!bucket || !key) {
    throw new Error('Missing S3 bucket or key');
  }
};

const handleError = (error: any) => {
  if (error?.$metadata?.httpStatusCode === 404) {
    return new NextResponse('Not Found', { status: 404 });
  }
  console.error('s3-bundle proxy error', error);
  return new NextResponse('Upstream error', { status: 502 });
};

export const runtime = 'nodejs';

export async function GET(req: NextRequest, { params }: { params: { path?: string[] } }) {
  try {
    const { bucket, key } = extractTarget(params.path);
    ensureTarget(bucket, key);
    const range = req.headers.get('range');
    return await streamObject(range, bucket!, key!);
  } catch (error) {
    return handleError(error);
  }
}

export async function HEAD(_: NextRequest, { params }: { params: { path?: string[] } }) {
  try {
    const { bucket, key } = extractTarget(params.path);
    ensureTarget(bucket, key);
    return await headObject(bucket!, key!);
  } catch (error) {
    return handleError(error);
  }
}
