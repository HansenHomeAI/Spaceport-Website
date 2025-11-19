const DEFAULT_REGION = process.env.NEXT_PUBLIC_S3_REGION || 'us-west-2';

const S3_PREFIX = /^s3:\/\//i;

const trimMetaSuffix = (value: string) => {
  if (value.endsWith('/')) {
    return value;
  }
  const lowered = value.toLowerCase();
  if (lowered.endsWith('meta.json')) {
    return value.slice(0, value.lastIndexOf('/') + 1);
  }
  if (lowered.endsWith('settings.json')) {
    return value.slice(0, value.lastIndexOf('/') + 1);
  }
  return value;
};

const ensureTrailingSlash = (value: string) => (value.endsWith('/') ? value : `${value}/`);

const encodePathSegments = (path: string) =>
  path
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/');

const isArchivePath = (value: string) => /\.tar(\.gz)?$/i.test(value);

const encodeProxyPath = (bucket: string, keyPrefix: string) => {
  const safeSegments = keyPrefix
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment));
  const encodedKey = safeSegments.join('/');
  const suffix = encodedKey ? `/${encodedKey}` : '';
  return ensureTrailingSlash(`/api/s3-bundle/${encodeURIComponent(bucket)}${suffix}`);
};

export type ResolvedBundle = {
  input: string;
  baseUrl: string;
  metadataUrl: string;
  settingsUrl: string;
  displayName: string;
  requiresProxy: boolean;
  proxyBaseUrl?: string;
};

export const toHttpsFromS3 = (s3Url: string, region: string = DEFAULT_REGION) => {
  const raw = s3Url.trim();
  if (!S3_PREFIX.test(raw)) {
    throw new Error('Value is not an s3:// URL');
  }
  const withoutPrefix = raw.replace(S3_PREFIX, '');
  const firstSlash = withoutPrefix.indexOf('/');
  const bucket = firstSlash === -1 ? withoutPrefix : withoutPrefix.slice(0, firstSlash);
  const key = firstSlash === -1 ? '' : withoutPrefix.slice(firstSlash + 1);
  const encodedKey = encodePathSegments(trimMetaSuffix(key));
  const regionSuffix = region ? `.s3.${region}.amazonaws.com` : '.s3.amazonaws.com';
  const pathSuffix = encodedKey ? `/${encodedKey}` : '';
  return ensureTrailingSlash(`https://${bucket}${regionSuffix}${pathSuffix}`);
};

export const resolveBundleInput = (raw: string, region: string = DEFAULT_REGION): ResolvedBundle => {
  const input = raw.trim();
  if (!input) {
    throw new Error('Enter an S3 or HTTPS bundle URL');
  }
  let baseUrl: string;
  let proxyBaseUrl: string | undefined;
  let requiresProxy = false;
  if (S3_PREFIX.test(input)) {
    const withoutPrefix = input.replace(S3_PREFIX, '');
    const firstSlash = withoutPrefix.indexOf('/');
    const bucket = firstSlash === -1 ? withoutPrefix : withoutPrefix.slice(0, firstSlash);
    const key = firstSlash === -1 ? '' : withoutPrefix.slice(firstSlash + 1);
    if (isArchivePath(key)) {
      throw new Error('Splat viewer requires a supersplat bundle directory (with meta.json), not a .tar archive. Run the compression job and point to its supersplat_bundle/.');
    }
    const normalizedKey = ensureTrailingSlash(trimMetaSuffix(key));
    baseUrl = toHttpsFromS3(`s3://${bucket}/${normalizedKey}`, region);
    proxyBaseUrl = encodeProxyPath(bucket, normalizedKey);
    requiresProxy = true;
  } else {
    if (!/^https?:\/\//i.test(input)) {
      throw new Error('Only s3:// or https:// URLs are supported');
    }
    try {
      const url = new URL(input);
      if (isArchivePath(url.pathname)) {
        throw new Error('The provided URL points to an archive. Please select the supersplat bundle directory instead.');
      }
      const normalizedPath = ensureTrailingSlash(trimMetaSuffix(url.pathname));
      url.pathname = normalizedPath;
      url.search = '';
      url.hash = '';
      baseUrl = url.toString();
      requiresProxy = false;
      proxyBaseUrl = undefined;
    } catch (error) {
      throw new Error('Invalid HTTPS URL');
    }
  }
  const effectiveBase = proxyBaseUrl ?? baseUrl;
  const metadataUrl = `${effectiveBase}meta.json`;
  const settingsUrl = `${effectiveBase}settings.json`;
  const segments = baseUrl.replace(/\/$/, '').split('/');
  const displayName = segments.slice(-1)[0] || baseUrl;
  return {
    input,
    baseUrl,
    metadataUrl,
    settingsUrl,
    displayName,
    requiresProxy,
    proxyBaseUrl,
  };
};

export const describeResolvedBundle = (bundle: ResolvedBundle) =>
  `${bundle.displayName} (${bundle.baseUrl})`;
