import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // Google account profile photos are served from this domain
    remotePatterns: [{ hostname: "lh3.googleusercontent.com" }],
  },
};

export default nextConfig;
