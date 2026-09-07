import type { SiteSettings } from "@/lib/api";
import { absoluteSiteUrl, absoluteUrl } from "@/lib/seo";
import type { Faq, Trip } from "@/lib/api";
import { tripHref } from "@/lib/api";

function sameAs(settings: SiteSettings) {
  return [settings.facebookUrl, settings.instagramUrl, settings.tripadvisorUrl, settings.googleBusinessUrl].filter(Boolean);
}

export function organizationJsonLd(settings: SiteSettings, locale: string) {
  const base = absoluteSiteUrl(settings);
  return {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness"],
    "@id": `${base}/#organization`,
    name: settings.siteTitle,
    url: base,
    email: settings.email,
    telephone: settings.phone,
    image: settings.logoUrl ? (settings.logoUrl.startsWith("http") ? settings.logoUrl : `${base}${settings.logoUrl}`) : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Pokhara",
      addressRegion: "Gandaki",
      addressCountry: "NP",
    },
    geo:
      settings.geoLat != null && settings.geoLng != null
        ? {
            "@type": "GeoCoordinates",
            latitude: settings.geoLat,
            longitude: settings.geoLng,
          }
        : undefined,
    areaServed: "Nepal",
    inLanguage: locale,
    sameAs: sameAs(settings),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqJsonLd(items: Faq[]) {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function tripJsonLd(settings: SiteSettings, trek: Trip, locale: string) {
  const base = absoluteSiteUrl(settings);
  const url = absoluteUrl(locale, tripHref(trek), base);
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: trek.name,
    description: trek.summary || trek.description,
    url,
    image: trek.heroImageUrl,
    touristType: trek.difficultyLabel,
    itinerary: Array.isArray(trek.itinerary)
      ? trek.itinerary.map((day) => ({
          "@type": "TouristAttraction",
          name: `Day ${day.day}: ${day.title}`,
          description: day.body,
        }))
      : undefined,
    offers: {
      "@type": "Offer",
      price: trek.priceFromUsd,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url,
    },
    provider: { "@id": `${base}/#organization` },
  };
}

export function articleJsonLd(
  settings: SiteSettings,
  post: { title: string; excerpt: string; heroImageUrl: string; publishedAt: string; slug: string },
  locale: string,
) {
  const base = absoluteSiteUrl(settings);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.heroImageUrl,
    datePublished: post.publishedAt,
    mainEntityOfPage: absoluteUrl(locale, `/blog/${post.slug}`, base),
    author: { "@type": "Organization", name: settings.siteTitle },
    publisher: { "@id": `${base}/#organization` },
  };
}
