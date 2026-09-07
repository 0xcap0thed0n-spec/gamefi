import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Local /public images work with next/image by default (no remotePatterns needed).
  images: {
    // unoptimized not required; static files under public/ are served as-is.
  },
};

export default nextConfig;
