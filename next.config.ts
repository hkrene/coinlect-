import type { NextConfig } from 'next';

/**
 * Content-Security-Policy.
 *
 * Next.js injects inline bootstrap scripts and Tailwind ships inline styles, so
 * `'unsafe-inline'` (and `'unsafe-eval'` for some client libs) is required for
 * the app to function. The policy still restricts scripts, frames and objects
 * to a known allow-list, which blocks the most common injection payloads.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://accounts.google.com https://apis.google.com https://challenges.cloudflare.com https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https:",
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://accounts.google.com https://content.googleapis.com https://challenges.cloudflare.com https://vitals.vercel-insights.com https://va.vercel-scripts.com",
  "frame-src 'self' https://accounts.google.com https://challenges.cloudflare.com https://www.youtube.com https://www.youtube-nocookie.com",
  "media-src 'self' https:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Ensure proper image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Silence the multiple lockfiles warning
  outputFileTracingRoot: process.cwd(),
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
