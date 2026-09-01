import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { fetchPublic } from "@/lib/api";
import { fillCopy, siteAssociations, siteChips, siteCopy } from "@/lib/site-copy";
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
  const { settings, treks, rafting, trips, faqs, testimonials, posts } = await fetchPublic(locale);
  const featured = (treks.filter((x) => x.featured).length ? treks.filter((x) => x.featured) : treks).slice(0, 2);
  const visited = rafting.slice(0, 2);
  const bannerTrip = featured[0] || treks[0];
  const memories = trips.flatMap((x) => x.gallery).filter(Boolean);
  const uniqueMemories = [...new Set(memories)].slice(0, 5);
  const c = (key: string) =>
    siteCopy(settings, key, () => {
      // #region agent log
      fetch("http://127.0.0.1:7250/ingest/4f909da6-e362-4dd0-8c11-1048ad8b271f", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "4acaf2" },
        body: JSON.stringify({
          sessionId: "4acaf2",
          runId: "post-fix",
          hypothesisId: "A",
          location: "page.tsx:c",
          message: "t() invoked as last resort",
          data: { key },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      return t(key);
    });
  const chips = siteChips(settings);
  const chipTitles = Object.fromEntries(chips.map((chip) => [chip.titleKey, c(`heroTabs.${chip.titleKey}`)]));

  return (
    <>
      <HeroCarousel
        trips={trips}
        kicker={c("hero.kicker")}
        headline={c("hero.headline")}
        posterUrl={settings.heroPosterUrl}
        videoUrl={settings.heroVideoUrl}
      >
        <DestinationChips
          chips={chips}
          labels={{
            destinations: c("heroTabs.destinations"),
            activities: c("heroTabs.activities"),
            difficulty: c("heroTabs.difficulty"),
            trips: c("heroTabs.trips"),
            titles: chipTitles,
          }}
        />
      </HeroCarousel>

      <PartnerStrip settings={settings} fallback={(key) => t(key)} />

      <section className="bg-ivory py-16">
        <Reveal className="mx-auto max-w-6xl px-5 text-center lg:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-sky">{c("featured.kicker")}</p>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl">{c("featured.title")}</h2>
        </Reveal>
        <div className="mx-auto mt-10 grid max-w-6xl gap-6 px-5 sm:grid-cols-2 lg:px-8">
          {featured.map((trip) => (
            <TripCard key={trip.id} trip={trip} large />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/treks" className="text-sm text-sky underline-offset-4 hover:underline">
            {c("featured.viewAll")}
          </Link>
        </div>
      </section>

      {visited.length > 0 && (
        <section className="bg-ivory pb-16">
          <Reveal className="mx-auto max-w-6xl px-5 text-center lg:px-8">
            <h2 className="font-serif text-4xl sm:text-5xl">{c("featured.visitedTitle")}</h2>
          </Reveal>
          <div className="mx-auto mt-10 grid max-w-6xl gap-6 px-5 sm:grid-cols-2 lg:px-8">
            {visited.map((trip) => (
              <TripCard key={trip.id} trip={trip} large />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/rafting" className="text-sm text-sky underline-offset-4 hover:underline">
              {c("featured.allRaft")}
            </Link>
          </div>
        </section>
      )}

      <PurposeBand settings={settings} fallback={(key) => t(key)} />

      {testimonials.length > 0 && <Voices items={testimonials} kicker={c("voices.kicker")} title={c("voices.title")} />}

      {bannerTrip && (
        <TrekCtaBanner
          trip={bannerTrip}
          daysLabel={t("trek.days", { count: bannerTrip.durationDays })}
          bookNow={c("ctaBanner.bookNow")}
        />
      )}

      <BlogTeaser posts={posts} locale={locale} kicker={c("blogs.kicker")} title={c("blogs.title")} all={c("blogs.all")} />

      <RatedBand
        title={c("rated.title")}
        body={fillCopy(c("rated.body"), { walkers: settings.trekkerCount, years: settings.yearsGuiding })}
      />

      <MemoryWall images={uniqueMemories} title={c("memories.title")} />

      <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <FaqList items={faqs} kicker={c("faq.kicker")} title={c("faq.title")} />
      </section>

      <AssociatedWith title={c("associated.title")} logos={siteAssociations(settings)} />
    </>
  );
}
