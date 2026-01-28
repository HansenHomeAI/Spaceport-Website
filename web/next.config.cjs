/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const nextConfig = {
  reactStrictMode: true,
  experimental: { appDir: true },
  images: { unoptimized: true },
  // Do not use static export; we deploy with @cloudflare/next-on-pages to enable Pages Functions.
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
};
module.exports = nextConfig;
