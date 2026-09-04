import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'wympfqmmhdnqavwslqsv.supabase.co' },
    ],
  },
  typedRoutes: false,
};

export default nextConfig;
