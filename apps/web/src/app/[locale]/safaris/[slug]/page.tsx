import { TripDetail } from "@/components/trip/TripDetail";
import { tripPageMetadata } from "@/lib/page-metadata";
import { fetchPublic } from "@/lib/api";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  return tripPageMetadata(locale, slug);
}

export async function generateStaticParams() {
  const data = await fetchPublic("en");
  return data.safaris.map((t) => ({ slug: t.slug }));
}

export default async function SafariDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <TripDetail slug={slug} />;
}
