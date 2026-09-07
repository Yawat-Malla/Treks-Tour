import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { fetchPublic } from "@/lib/api";
import { destCopy, destFaqs, DESTINATION_SLUGS, isDestinationSlug, pathToRegion } from "@/lib/regions";
import { destinationMetadata } from "@/lib/page-metadata";
import { absoluteSiteUrl, absoluteUrl } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { TripCard } from "@/components/trip/TripCard";
import { FaqList } from "@/components/home/FaqList";
import { siteCopy } from "@/lib/site-copy";
import { Link } from "@/i18n/navigation";

export function generateStaticParams() {
  return DESTINATION_SLUGS.map((region) => ({ region }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; region: string }> }) {
  const { locale, region } = await params;
  return destinationMetadata(locale, region);
}

export default async function DestinationPage({ params }: { params: Promise<{ region: string }> }) {
  const { region: slug } = await params;
  if (!isDestinationSlug(slug)) notFound();
  const locale = await getLocale();
  const t = await getTranslations("trek");
  const { settings, treks, faqs } = await fetchPublic(locale);
  const region = pathToRegion(slug);
  const trips = treks.filter((trip) => trip.region === region);
  const title = siteCopy(settings, `dest.${slug}.title`, destCopy(slug, locale, "h1"));
  const lede = siteCopy(settings, `dest.${slug}.lede`, destCopy(slug, locale, "lede"));
  const body = siteCopy(settings, `dest.${slug}.body`, destCopy(slug, locale, "body"));
  const destFaq = destFaqs(slug, locale);
  const hero = trips[0]?.heroImageUrl || settings.heroPosterUrl || "/heroes/hero-poster.jpg";
  const base = absoluteSiteUrl(settings);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: t("breadcrumbHome"), url: absoluteUrl(locale, "/", base) },
            { name: t("breadcrumbTreks"), url: absoluteUrl(locale, "/treks", base) },
            { name: title, url: absoluteUrl(locale, `/destinations/${slug}`, base) },
          ]),
          faqJsonLd(destFaq),
        ].filter(Boolean)}
      />
      <PageHero kicker={t("breadcrumbTreks")} title={title} lede={lede} image={hero} tall />
      <article className="mx-auto max-w-3xl px-5 py-14 lg:px-8">
        {body.split(/\n\n+/).map((para) => (
          <p key={para.slice(0, 24)} className="mt-5 text-lg leading-relaxed text-ink-soft first:mt-0">
            {para}
          </p>
        ))}
        <p className="mt-8 text-sm">
          <Link href="/treks" className="text-sky underline-offset-4 hover:underline">
            {t("breadcrumbTreks")}
          </Link>
          {" · "}
          <Link href="/blog/best-treks-in-nepal" className="text-sky underline-offset-4 hover:underline">
            {t("guideLink")}
          </Link>
          {" · "}
          <Link href="/prepare" className="text-sky underline-offset-4 hover:underline">
            {t("permitsLink")}
          </Link>
        </p>
      </article>
      <div className="mx-auto max-w-6xl px-5 pb-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
        {destFaq.length > 0 && (
          <div className="mt-16">
            <FaqList items={destFaq} kicker={t("faqTitle")} title={t("faqTitle")} columns={1} />
          </div>
        )}
        {faqs.length > 0 && trips.length === 0 ? (
          <p className="mt-10 text-ink-soft">No published treks in this region yet.</p>
        ) : null}
      </div>
    </>
  );
}
