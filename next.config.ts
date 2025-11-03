import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Export statico: genera /out per Cloudflare Pages
  output: 'export',

  // Con export statico disattiviamo l’optimizer di Next
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**.geotapp.com' }, // (fix: era geotap.com)
      { protocol: 'http', hostname: 'localhost' },
    ],
  },

  // URL con slash finale per evitare 404 sugli asset statici
  trailingSlash: true,

  // Oggi pubblichiamo: non bloccare la build per lint/TS
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Env usate a build-time (non runtime su statico)
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
};

export default nextConfig;
