import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { fetchPublic } from "@/lib/api";
import { Reveal } from "@/components/ui/Reveal";
import { TripCard } from "@/components/trip/TripCard";
import { FaqList } from "@/components/home/FaqList";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { DestinationChips } from "@/components/home/DestinationChips";
import { PartnerStrip } from "@/components/home/PartnerStrip";
import { PurposeBand } from "@/components/home/PurposeBand";
import { TrekCtaBanner } from "@/components/home/TrekCtaBanner";
import { BlogTeaser } from "@/components/home/BlogTeaser";
import { RatedBand } from "@/components/home/RatedBand";
import { MemoryWall } from "@/components/home/MemoryWall";
import { Voices } from "@/components/home/Voices";
import { AssociatedWith } from "@/components/home/AssociatedWith";

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations();
  const { settings, treks, rafting, activities, safaris, trips, faqs, testimonials, posts } =
    await fetchPublic(locale);
  const featured = (treks.filter((x) => x.featured).length ? treks.filter((x) => x.featured) : treks).slice(0, 2);
  const visited = rafting.slice(0, 2);
  const bannerTrip = featured[0] || treks[0];
  const memories = trips.flatMap((x) => x.gallery).filter(Boolean);
  const uniqueMemories = [...new Set(memories)].slice(0, 5);

  // #region agent log
  fetch('http://127.0.0.1:7250/ingest/4f909da6-e362-4dd0-8c11-1048ad8b271f',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'894e04'},body:JSON.stringify({sessionId:'894e04',runId:'run1',hypothesisId:'H3',location:'page.tsx:29',message:'HomePage SSR render',data:{tripCount:trips?.length,treksCount:treks?.length,locale},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  return (
    <>
      <HeroCarousel trips={trips}>
        <DestinationChips treks={treks} rafting={rafting} activities={activities} safaris={safaris} />
      </HeroCarousel>

      <PartnerStrip years={settings.yearsGuiding} walkers={settings.trekkerCount} />

      <section className="bg-ivory py-16">
        <Reveal className="mx-auto max-w-6xl px-5 text-center lg:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-sky">{t("featured.kicker")}</p>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl">{t("featured.title")}</h2>
        </Reveal>
        <div className="mx-auto mt-10 grid max-w-6xl gap-6 px-5 sm:grid-cols-2 lg:px-8">
          {featured.map((trip) => (
            <TripCard key={trip.id} trip={trip} large />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/treks" className="text-sm text-sky underline-offset-4 hover:underline">
            {t("featured.viewAll")}
          </Link>
        </div>
      </section>

      {visited.length > 0 && (
        <section className="bg-ivory pb-16">
          <Reveal className="mx-auto max-w-6xl px-5 text-center lg:px-8">
            <h2 className="font-serif text-4xl sm:text-5xl">{t("featured.visitedTitle")}</h2>
          </Reveal>
          <div className="mx-auto mt-10 grid max-w-6xl gap-6 px-5 sm:grid-cols-2 lg:px-8">
            {visited.map((trip) => (
              <TripCard key={trip.id} trip={trip} large />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/rafting" className="text-sm text-sky underline-offset-4 hover:underline">
              {t("featured.allRaft")}
            </Link>
          </div>
        </section>
      )}

      <PurposeBand title={settings.introTitle} body={settings.introBody} />

      {testimonials.length > 0 && <Voices items={testimonials} />}

      {bannerTrip && <TrekCtaBanner trip={bannerTrip} />}

      <BlogTeaser posts={posts} locale={locale} />

      <RatedBand years={settings.yearsGuiding} walkers={settings.trekkerCount} />

      <MemoryWall images={uniqueMemories} />

      <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <FaqList items={faqs} kicker={t("faq.kicker")} title={t("faq.title")} />
      </section>

      <AssociatedWith />
    </>
  );
}
