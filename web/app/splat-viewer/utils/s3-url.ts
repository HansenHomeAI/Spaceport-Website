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

export type ResolvedBundle = {
  input: string;
  baseUrl: string;
  metadataUrl: string;
  settingsUrl: string;
  displayName: string;
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
  if (S3_PREFIX.test(input)) {
    baseUrl = toHttpsFromS3(input, region);
  } else {
    if (!/^https?:\/\//i.test(input)) {
      throw new Error('Only s3:// or https:// URLs are supported');
    }
    try {
      const url = new URL(input);
      const normalizedPath = ensureTrailingSlash(trimMetaSuffix(url.pathname));
      url.pathname = normalizedPath;
      url.search = '';
      url.hash = '';
      baseUrl = url.toString();
    } catch (error) {
      throw new Error('Invalid HTTPS URL');
    }
  }
  const metadataUrl = `${baseUrl}meta.json`;
  const settingsUrl = `${baseUrl}settings.json`;
  const segments = baseUrl.replace(/\/$/, '').split('/');
  const displayName = segments.slice(-1)[0] || baseUrl;
  return {
    input,
    baseUrl,
    metadataUrl,
    settingsUrl,
    displayName,
  };
};

export const describeResolvedBundle = (bundle: ResolvedBundle) =>
  `${bundle.displayName} (${bundle.baseUrl})`;
