import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

export const DEFAULT_SITE_URL = "https://upperpathtreks.com";

export type SeoSettings = {
  siteTitle: string;
  siteUrl?: string | null;
  ogImageUrl?: string | null;
  googleSiteVerification?: string | null;
  heroPosterUrl?: string | null;
  logoUrl?: string | null;
};

export function absoluteSiteUrl(settings?: Pick<SeoSettings, "siteUrl"> | null) {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const raw = fromEnv || settings?.siteUrl || DEFAULT_SITE_URL;
  return raw.replace(/\/$/, "");
}

export function localizedPath(locale: string, path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === routing.defaultLocale) return normalized === "" ? "/" : normalized;
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}

export function absoluteUrl(locale: string, path: string, base: string) {
  const loc = localizedPath(locale, path);
  if (loc === "/") return base;
  return `${base}${loc}`;
}

export function languageAlternates(path: string, base: string) {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = absoluteUrl(locale, path, base);
  }
  languages["x-default"] = absoluteUrl(routing.defaultLocale, path, base);
  return languages;
}

export function ogLocale(locale: string) {
  switch (locale) {
    case "zh":
      return "zh_CN";
    case "ko":
      return "ko_KR";
    case "he":
      return "he_IL";
    default:
      return "en_US";
  }
}

function clip(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

export function buildMetadata({
  locale,
  path,
  settings,
  title,
  description,
  image,
  noIndex = false,
}: {
  locale: string;
  path: string;
  settings: SeoSettings;
  title: string;
  description: string;
  image?: string | null;
  noIndex?: boolean;
}) {
  const base = absoluteSiteUrl(settings);
  const canonical = absoluteUrl(locale, path, base);
  const ogImage = image || settings.ogImageUrl || settings.heroPosterUrl || "/heroes/hero-poster.jpg";
  const absImage = ogImage.startsWith("http") ? ogImage : `${base}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`;
  const desc = clip(description, 160);
  const pageTitle = clip(title, 70);

  return {
    metadataBase: new URL(base),
    title: pageTitle,
    description: desc,
    alternates: {
      canonical,
      languages: languageAlternates(path, base),
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website" as const,
      locale: ogLocale(locale),
      url: canonical,
      siteName: settings.siteTitle,
      title: pageTitle,
      description: desc,
      images: [{ url: absImage, alt: pageTitle }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: pageTitle,
      description: desc,
      images: [absImage],
    },
  };
}

export function tripTitle(name: string, durationDays: number, brand: string) {
  return `${name} | ${durationDays} Days from Pokhara | ${brand}`;
}

export function tripDescription(name: string, summary: string, durationDays: number, priceFromUsd: number) {
  const base = summary.trim() || `Guided ${name} from Pokhara with a licensed local team.`;
  return clip(`${base} ${durationDays} days from US$${priceFromUsd} per person. Permits, tea houses, and a manager in Lakeside.`, 160);
}

export function blogTitle(title: string, brand: string) {
  if (title.toLowerCase().includes(brand.toLowerCase())) return title;
  return `${title} | ${brand}`;
}

export const LOCALES: Locale[] = [...routing.locales];
