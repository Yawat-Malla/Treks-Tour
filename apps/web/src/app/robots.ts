import type { MetadataRoute } from "next";
import { DEFAULT_SITE_URL } from "@/lib/seo";

const admin = process.env.NEXT_PUBLIC_ADMIN_PATH || "studio-7f3a";
const site = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [`/${admin}`, `/${admin}/`, "/cms", "/cms/", "/book", "/book/", "/book/success"],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
