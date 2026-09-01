import type { AssociationLogo, ChipCard } from "@/cms/page-catalog";
import { fallbackBlog, fallbackPublic, fallbackTrek } from "@/data/fallback-site";

export type { AssociationLogo, ChipCard };

export type SiteSettings = {
  siteTitle: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  whatsapp: string;
  viber: string;
  email: string;
  wechatId: string;
  wechatQrUrl: string | null;
  address: string;
  phone: string;
  trekkerCount: number;
  yearsGuiding: number;
  heroPosterUrl: string | null;
  heroVideoUrl: string | null;
  aboutHeroUrl: string | null;
  associations: AssociationLogo[] | null;
  chips: ChipCard[] | null;
  tagline: string;
  heroHeadline: string;
  heroSubhead: string;
  introTitle: string;
  introBody: string;
  aboutTitle: string;
  aboutBody: string;
  pages: Record<string, string>;
};

export type ItineraryDay = { day: number; title: string; body: string };
export type ProfilePoint = { d: number; m: number };

export type Trip = {
  id: string;
  slug: string;
  kind: "trek" | "rafting" | "activity" | "safari";
  durationDays: number;
  difficulty: string;
  maxAltitudeM: number;
  priceFromUsd: number;
  season: string;
  heroImageUrl: string;
  gallery: string[];
  featured: boolean;
  inclusions: string[];
  exclusions: string[];
  bestMonths: number[];
  river: string | null;
  grade: string | null;
  minAge: number | null;
  altitudeProfile: ProfilePoint[];
  name: string;
  summary: string;
  description: string;
  itinerary: ItineraryDay[];
  seasonLabel: string;
  difficultyLabel: string;
};

export type Faq = { id: string; question: string; answer: string };
export type Testimonial = { id: string; quote: string; attribution: string };
export type BlogPost = {
  id: string;
  slug: string;
  heroImageUrl: string;
  featured: boolean;
  publishedAt: string;
  title: string;
  excerpt: string;
  body: string;
};

export type PublicPayload = {
  settings: SiteSettings;
  treks: Trip[];
  rafting: Trip[];
  activities: Trip[];
  safaris: Trip[];
  trips: Trip[];
  faqs: Faq[];
  testimonials: Testimonial[];
  posts: BlogPost[];
};

function isLoopback(url: string) {
  try {
    const host = new URL(url).hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
}

/** Live Nest API, or null on Vercel/production when only the frontend is hosted. */
export function apiBase(): string | null {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  const hosted = Boolean(process.env.VERCEL || process.env.NODE_ENV === "production");
  if (fromEnv && !(hosted && isLoopback(fromEnv))) return fromEnv.replace(/\/$/, "");
  if (hosted) return null;
  return fromEnv || "http://localhost:4000";
}

async function liveFetch(path: string) {
  const base = apiBase();
  if (!base) return null;
  try {
    const res = await fetch(`${base}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res;
  } catch {
    return null;
  }
}

export async function fetchPublic(locale: string): Promise<PublicPayload> {
  const res = await liveFetch(`/public/site?locale=${locale}`);
  if (res) {
    const data = (await res.json()) as PublicPayload;
    return { ...data, posts: data.posts ?? [] };
  }
  return fallbackPublic(locale);
}

export async function fetchTrek(slug: string, locale: string) {
  const res = await liveFetch(`/public/treks/${slug}?locale=${locale}`);
  if (res) return res.json() as Promise<{ settings: SiteSettings; trek: Trip; trips: Trip[] }>;
  return fallbackTrek(slug, locale);
}

export async function fetchBlog(slug: string, locale: string) {
  const res = await liveFetch(`/public/blog/${slug}?locale=${locale}`);
  if (res) return res.json() as Promise<{ settings: SiteSettings; post: BlogPost; posts: BlogPost[] }>;
  return fallbackBlog(slug, locale);
}

export function apiUrl(path: string) {
  const base = apiBase();
  if (!base) return path;
  return `${base}${path}`;
}

export function tripHref(trip: Pick<Trip, "kind" | "slug">) {
  if (trip.kind === "rafting") return `/rafting/${trip.slug}`;
  if (trip.kind === "activity") return `/activities/${trip.slug}`;
  if (trip.kind === "safari") return `/safaris/${trip.slug}`;
  return `/treks/${trip.slug}`;
}

export type Trek = Trip;
