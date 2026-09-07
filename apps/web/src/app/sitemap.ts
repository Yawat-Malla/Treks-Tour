import type { MetadataRoute } from "next";
import { fetchPublic, tripHref } from "@/lib/api";
import { routing } from "@/i18n/routing";
import { absoluteSiteUrl, localizedPath } from "@/lib/seo";
import { DESTINATION_SLUGS } from "@/lib/regions";

const STATIC_PATHS = [
  "/",
  "/treks",
  "/rafting",
  "/activities",
  "/safaris",
  "/blog",
  "/plan",
  "/prepare",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await fetchPublic("en");
  const base = absoluteSiteUrl(data.settings);
  const now = new Date();
  const tripDates = new Map(data.trips.map((trip) => [tripHref(trip), trip.updatedAt]));
  const postDates = new Map(data.posts.map((post) => [`/blog/${post.slug}`, post.updatedAt || post.publishedAt]));

  const paths = [
    ...STATIC_PATHS,
    ...DESTINATION_SLUGS.map((slug) => `/destinations/${slug}`),
    ...data.trips.map((trip) => tripHref(trip)),
    ...data.posts.map((post) => `/blog/${post.slug}`),
  ];

  return paths.flatMap((path) => {
    const stamp = tripDates.get(path) || postDates.get(path);
    const lastModified = stamp ? new Date(stamp) : now;
    return routing.locales.map((locale) => ({
      url: `${base}${localizedPath(locale, path)}`,
      lastModified,
      changeFrequency: path === "/" ? "weekly" : "weekly",
      priority: path === "/" ? 1 : path === "/treks" || path.startsWith("/destinations/") ? 0.9 : 0.7,
    }));
  });
}
