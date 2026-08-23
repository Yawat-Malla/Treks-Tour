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
  tagline: string;
  heroHeadline: string;
  heroSubhead: string;
  introTitle: string;
  introBody: string;
  aboutTitle: string;
  aboutBody: string;
};

export type ItineraryDay = { day: number; title: string; body: string };
export type ProfilePoint = { d: number; m: number };

export type Trip = {
  id: string;
  slug: string;
  kind: "trek" | "rafting";
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

export type PublicPayload = {
  settings: SiteSettings;
  treks: Trip[];
  rafting: Trip[];
  trips: Trip[];
  faqs: Faq[];
  testimonials: Testimonial[];
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function fetchPublic(locale: string): Promise<PublicPayload> {
  const res = await fetch(`${API}/public/site?locale=${locale}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load site");
  return res.json();
}

export async function fetchTrek(slug: string, locale: string) {
  const res = await fetch(`${API}/public/treks/${slug}?locale=${locale}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json() as Promise<{ settings: SiteSettings; trek: Trip; trips: Trip[] }>;
}

export function apiUrl(path: string) {
  return `${API}${path}`;
}

export function tripHref(trip: Pick<Trip, "kind" | "slug">) {
  return trip.kind === "rafting" ? `/rafting/${trip.slug}` : `/treks/${trip.slug}`;
}

export type Trek = Trip;
