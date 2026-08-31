import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { fetchTrek, tripHref, type ItineraryDay, type ProfilePoint, type Trip } from "@/lib/api";
import { contactPrefill, whatsappHref } from "@/lib/contacts";
import type { Locale } from "@/i18n/routing";
import { FilmImage } from "@/components/ui/FilmImage";
import { WAVES } from "@/components/ui/SceneMarks";
import { ItinerarySnap } from "./ItinerarySnap";
import { AltitudeChart } from "./AltitudeChart";
import { Lightbox } from "./Lightbox";
import { TripCard } from "./TripCard";
import { Clock, Mountain } from "lucide-react";

export async function TripDetail({ slug }: { slug: string }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("trek");
  const data = await fetchTrek(slug, locale);
  if (!data) notFound();
  const { trek, settings, trips } = data;
  const itinerary = Array.isArray(trek.itinerary) ? (trek.itinerary as ItineraryDay[]) : [];
  const profile = Array.isArray(trek.altitudeProfile) ? (trek.altitudeProfile as ProfilePoint[]) : [];
  const wa = whatsappHref(settings, contactPrefill(locale, trek.name));
  const raft = trek.kind === "rafting";
  const activity = trek.kind === "activity";
  const safari = trek.kind === "safari";
  const showAltitude = !raft && !activity && trek.maxAltitudeM > 0;
  const similar = trips.filter((x) => x.kind === trek.kind && x.slug !== trek.slug).slice(0, 3);
  const cross = raft || activity || safari
    ? trips.find((x) => x.slug === "ghorepani-poon-hill")
    : trips.find((x) => x.slug === "kaligandaki-1-day");
  const bookHref = `/book?trip=${trek.slug}&kind=${trek.kind}`;

  return (
    <>
      <section className="relative h-[70vh] min-h-[460px] overflow-hidden">
        <FilmImage src={trek.heroImageUrl} className="absolute inset-0" kenburns />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-6xl items-end px-5 pb-16 lg:px-8">
          <div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-snow/80">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {t("days", { count: trek.durationDays })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Mountain className="h-4 w-4" />
                {(raft || activity) && trek.grade ? trek.grade : trek.difficultyLabel}
              </span>
              {showAltitude && <span>{t("altitude", { count: trek.maxAltitudeM })}</span>}
            </div>
            <h1 className="mt-3 max-w-3xl font-serif text-5xl text-snow sm:text-7xl">{trek.name}</h1>
          </div>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden>
          <path fill="var(--ivory)" d={WAVES} />
        </svg>
      </section>

      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 lg:grid-cols-[1fr_320px] lg:px-8">
        <article>
          <p className="text-lg leading-relaxed text-ink-soft">{trek.summary}</p>
          <p className="mt-6 leading-relaxed">{trek.description}</p>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-serif text-2xl">{t("includes")}</h2>
              <ul className="mt-3 space-y-1 text-sm text-ink-soft">
                {trek.inclusions.map((x) => (
                  <li key={x}>— {x}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-2xl">{t("excludes")}</h2>
              <ul className="mt-3 space-y-1 text-sm text-ink-soft">
                {trek.exclusions.map((x) => (
                  <li key={x}>— {x}</li>
                ))}
              </ul>
            </div>
          </div>
          <h2 className="mt-14 font-serif text-3xl">{t("itinerary")}</h2>
          <div className="mt-6">
            <ItinerarySnap days={itinerary} />
          </div>
          <div className="mt-14">
            <AltitudeChart points={profile} label={raft || activity ? t("gradeProfile") : t("profile")} />
          </div>
          {trek.gallery?.length > 0 && (
            <div className="mt-14">
              <h2 className="mb-6 font-serif text-3xl">{t("gallery")}</h2>
              <Lightbox images={trek.gallery} />
            </div>
          )}
        </article>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl bg-snow p-6 shadow-[var(--shadow)] ring-1 ring-ink/8">
            <p className="text-sm text-ink-soft">{t("from")}</p>
            <p className="font-serif text-4xl">${trek.priceFromUsd}</p>
            <p className="mt-2 text-xs text-ink-soft">{t("priceNote")}</p>
            <dl className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">{t("season")}</dt>
                <dd>{trek.seasonLabel}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">{raft || activity ? t("grade") : t("difficulty")}</dt>
                <dd>{(raft || activity) && trek.grade ? trek.grade : trek.difficultyLabel}</dd>
              </div>
              {raft && trek.river && (
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-soft">{t("river")}</dt>
                  <dd>{trek.river}</dd>
                </div>
              )}
              {raft && trek.minAge ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-soft">{t("minAge")}</dt>
                  <dd>{trek.minAge}+</dd>
                </div>
              ) : null}
            </dl>
            <Link href={bookHref} className="mt-6 block rounded-full bg-ink py-3 text-center text-sm font-medium text-snow hover:bg-moss-deep">
              {raft ? t("bookRaft") : t("bookThis")}
            </Link>
            <a href={wa} className="mt-2 block py-2 text-center text-sm text-sky hover:underline">
              {t("enquire")}
            </a>
          </div>
          {cross && (
            <Link href={tripHref(cross)} className="mt-4 block rounded-2xl bg-ink p-5 text-snow">
              <p className="text-xs uppercase tracking-[0.16em] text-river">{raft ? t("pairTrek") : t("finishPokhara")}</p>
              <p className="mt-2 font-serif text-2xl">{cross.name}</p>
              <p className="mt-2 text-sm text-snow/70">{cross.summary}</p>
            </Link>
          )}
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-20 lg:px-8">
          <h2 className="font-serif text-3xl">{t("similar")}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {similar.map((s: Trip) => (
              <TripCard key={s.id} trip={s} />
            ))}
          </div>
        </section>
      )}

      <div className="sticky bottom-0 z-30 border-t border-ink/10 bg-ivory/95 p-3 backdrop-blur md:hidden">
        <Link href={bookHref} className="block rounded-full bg-ink py-3 text-center text-sm font-medium text-snow">
          {raft ? t("bookRaft") : t("bookThis")}
        </Link>
      </div>
    </>
  );
}
