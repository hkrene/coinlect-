import type { NextConfig } from 'next';

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
};

export default nextConfig;

