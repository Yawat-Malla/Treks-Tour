import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { fetchPublic } from "@/lib/api";
import { Reveal } from "@/components/ui/Reveal";
import { CinemaRail } from "@/components/trip/CinemaRail";
import { TripCard } from "@/components/trip/TripCard";
import { PokharaMap } from "@/components/home/PokharaMap";
import { FaqList } from "@/components/home/FaqList";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { HomeBookBar } from "@/components/home/HomeBookBar";
import { HowPills } from "@/components/home/HowPills";
import { TopDeals } from "@/components/home/TopDeals";
import { ValueBar } from "@/components/home/ValueBar";
import { AskManager } from "@/components/home/AskManager";
import { Quote } from "lucide-react";

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations();
  const { settings, treks, rafting, trips, faqs, testimonials } = await fetchPublic(locale);
  const featured = treks.filter((x) => x.featured);

  return (
    <>
      <HeroCarousel />
      <HomeBookBar trips={trips} />

      <section className="pt-16 pb-8">
        <Reveal className="mx-auto max-w-6xl px-5 lg:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-sky">{t("featured.kicker")}</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-xl font-serif text-4xl sm:text-5xl">{t("featured.title")}</h2>
            <Link href="/treks" className="text-sm text-sky underline-offset-4 hover:underline">
              {t("featured.viewAll")}
            </Link>
          </div>
        </Reveal>
        <div className="mt-10">
          <CinemaRail>
            {(featured.length ? featured : treks).map((trip) => (
              <TripCard key={trip.id} trip={trip} large />
            ))}
          </CinemaRail>
        </div>
      </section>

      <TopDeals treks={treks} rafting={rafting} />

      {rafting.length > 0 && (
        <section className="py-20">
          <Reveal className="mx-auto max-w-6xl px-5 lg:px-8">
            <p className="text-xs uppercase tracking-[0.22em] text-river">{t("featured.raftKicker")}</p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <h2 className="max-w-xl font-serif text-4xl sm:text-5xl">{t("featured.raftTitle")}</h2>
              <Link href="/rafting" className="text-sm text-sky underline-offset-4 hover:underline">
                {t("featured.allRaft")}
              </Link>
            </div>
          </Reveal>
          <div className="mt-10">
            <CinemaRail>
              {rafting.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </CinemaRail>
          </div>
        </section>
      )}

      <ValueBar />

      <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <Reveal>
          <PokharaMap trips={trips} />
        </Reveal>
      </section>

      <section className="bg-moss-deep text-snow">
        <Reveal className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-sky">{settings.address}</p>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl">{settings.introTitle}</h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-snow/80">{settings.introBody}</p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <Reveal>
          <HowPills />
        </Reveal>
      </section>

      {testimonials.length > 0 && (
        <section className="bg-ivory py-20">
          <Reveal className="mx-auto max-w-6xl px-5 lg:px-8">
            <p className="text-xs uppercase tracking-[0.22em] text-sky">{t("voices.kicker")}</p>
            <h2 className="mt-3 font-serif text-4xl">{t("voices.title")}</h2>
            <div className="mt-10 flex gap-6 overflow-x-auto pb-2 cinema-rail ps-0">
              {testimonials.map((v) => (
                <blockquote key={v.id} className="min-w-[min(80vw,380px)] rounded-2xl bg-snow p-8 shadow-[var(--shadow)] ring-1 ring-ink/8">
                  <Quote className="h-8 w-8 text-sky/40" />
                  <p className="mt-4 font-serif text-2xl leading-snug">“{v.quote}”</p>
                  <footer className="mt-4 text-sm text-ink-soft">{v.attribution}</footer>
                </blockquote>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-5 py-20 lg:px-8">
        <Reveal>
          <FaqList items={faqs} kicker={t("faq.kicker")} title={t("faq.title")} />
        </Reveal>
      </section>

      <AskManager settings={settings} />
    </>
  );
}
