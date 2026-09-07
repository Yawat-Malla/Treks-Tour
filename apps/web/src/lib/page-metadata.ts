import type { Metadata } from "next";
import { fetchBlog, fetchPublic, fetchTrek, tripHref } from "@/lib/api";
import { blogTitle, buildMetadata, tripDescription, tripTitle } from "@/lib/seo";
import { destCopy, isDestinationSlug } from "@/lib/regions";

export async function publicMetadata(
  locale: string,
  path: string,
  title: string,
  description: string,
  image?: string | null,
  noIndex = false,
): Promise<Metadata> {
  const { settings } = await fetchPublic(locale);
  return {
    ...buildMetadata({ locale, path, settings, title, description, image, noIndex }),
    verification: settings.googleSiteVerification
      ? { google: settings.googleSiteVerification }
      : undefined,
  };
}

export async function homeMetadata(locale: string): Promise<Metadata> {
  const { settings } = await fetchPublic(locale);
  const title =
    settings.pages?.["meta.homeTitle"] ||
    `${settings.siteTitle} | Guided treks from Pokhara, Nepal`;
  const description =
    settings.pages?.["meta.homeDescription"] ||
    settings.tagline ||
    "Guided treks in Nepal from Lakeside, Pokhara. Annapurna, Everest, Langtang, and restricted-area routes with a local team.";
  return publicMetadata(locale, "/", title, description, settings.ogImageUrl || settings.heroPosterUrl);
}

export async function listingMetadata(
  locale: string,
  kind: "trek" | "rafting" | "activity" | "safari",
): Promise<Metadata> {
  const { settings } = await fetchPublic(locale);
  const map = {
    trek: {
      path: "/treks",
      title: settings.pages?.["featured.trekTitle"] || "Treks in Nepal | Packages from Pokhara",
      description:
        settings.pages?.["featured.trekLede"] ||
        "Compare treks in Nepal from Pokhara: Annapurna, Everest, Langtang, Mustang and quieter ridges. Days, altitude, difficulty and prices.",
    },
    rafting: {
      path: "/rafting",
      title: settings.pages?.["featured.raftTitle"] || "Kaligandaki Rafting from Pokhara",
      description: settings.pages?.["featured.raftLede"] || "Whitewater rafting on the Kali Gandaki from Pokhara.",
    },
    activity: {
      path: "/activities",
      title: settings.pages?.["featured.activityTitle"] || "Pokhara Activities | Balloon, Zip, Bungee",
      description: settings.pages?.["featured.activityLede"] || "Hot-air balloon, zip lines, bungee and swing from Lakeside, Pokhara.",
    },
    safari: {
      path: "/safaris",
      title: settings.pages?.["featured.safariTitle"] || "Jungle Safari Packages from Pokhara",
      description: settings.pages?.["featured.safariLede"] || "Chitwan, Bardia and Dhorpatan safari packages after the trek.",
    },
  }[kind];
  return publicMetadata(locale, map.path, `${map.title} | ${settings.siteTitle}`.replace(` | ${settings.siteTitle} | `, " | "), map.description);
}

export async function tripPageMetadata(locale: string, slug: string): Promise<Metadata> {
  const data = await fetchTrek(slug, locale);
  if (!data) return { title: "Trip" };
  const { settings, trek } = data;
  const title = trek.seoTitle || tripTitle(trek.name, trek.durationDays, settings.siteTitle);
  const description = trek.seoDescription || tripDescription(trek.name, trek.summary, trek.durationDays, trek.priceFromUsd);
  const thinLocale = locale !== "en" && !trek.description.trim() && !trek.seoDescription.trim();
  return publicMetadata(locale, tripHref(trek), title, description, trek.heroImageUrl, thinLocale);
}

export async function blogIndexMetadata(locale: string): Promise<Metadata> {
  const { settings } = await fetchPublic(locale);
  return publicMetadata(
    locale,
    "/blog",
    settings.pages?.["blogs.title"] || `Trek notes from Pokhara | ${settings.siteTitle}`,
    settings.pages?.["blogs.kicker"] ||
      "Season, permits, tea houses, and how we walk the Annapurna from Lakeside.",
    settings.heroPosterUrl,
  );
}

export async function blogPostMetadata(locale: string, slug: string): Promise<Metadata> {
  const data = await fetchBlog(slug, locale);
  if (!data) return { title: "Article" };
  const { settings, post } = data;
  const title = post.seoTitle || blogTitle(post.title, settings.siteTitle);
  const description = post.seoDescription || post.excerpt;
  const thinLocale = locale !== "en" && !post.body.trim();
  return publicMetadata(locale, `/blog/${post.slug}`, title, description, post.heroImageUrl, thinLocale);
}

export async function destinationMetadata(locale: string, slug: string): Promise<Metadata> {
  if (!isDestinationSlug(slug)) return { title: "Destinations" };
  const { settings } = await fetchPublic(locale);
  const title = settings.pages?.[`dest.${slug}.seoTitle`] || destCopy(slug, locale, "seoTitle");
  const description = settings.pages?.[`dest.${slug}.seoDescription`] || destCopy(slug, locale, "seoDescription");
  return publicMetadata(locale, `/destinations/${slug}`, title, description, settings.heroPosterUrl);
}
