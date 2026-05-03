import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ittwoqrnzvkegeslkymc.supabase.co" },
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: "5mb" },
  },
  async redirects() {
    return [
      // /exportaciones renombrado a /importaciones (28 abr 2026 — observación cliente).
      { source: "/:locale/exportaciones", destination: "/:locale/importaciones", permanent: true },
      { source: "/:locale/exportaciones/:path*", destination: "/:locale/importaciones/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
