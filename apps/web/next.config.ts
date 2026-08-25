import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  async rewrites() {
    const api = process.env.NEXT_PUBLIC_API_URL;
    if (!api || /localhost|127\.0\.0\.1/.test(api)) return [];
    return [{ source: "/uploads/:path*", destination: `${api.replace(/\/$/, "")}/uploads/:path*` }];
  },
};

export default withNextIntl(nextConfig);
