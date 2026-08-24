import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Trip } from "@/lib/api";
import { tripHref } from "@/lib/api";
import { FilmImage } from "@/components/ui/FilmImage";

export async function TopDeals({ treks, rafting }: { treks: Trip[]; rafting: Trip[] }) {
  const t = await getTranslations("deals");
  const tt = await getTranslations("trek");
  const abc = treks.find((x) => x.slug === "annapurna-base-camp") || treks[0];
  const poon = treks.find((x) => x.slug === "ghorepani-poon-hill") || treks[1];
  const kali = rafting.find((x) => x.slug === "kaligandaki-1-day") || rafting[0];
  const cards = [
    abc && { trip: abc, chip: t("chipFeatured") },
    poon && { trip: poon, chip: t("chipRest") },
    kali && { trip: kali, chip: t("chipGrade") },
  ].filter(Boolean) as { trip: Trip; chip: string }[];

  return (
    <section className="wash-mist">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-sky">{t("kicker")}</p>
          <h2 className="mt-2 font-serif text-4xl sm:text-5xl">{t("title")}</h2>
        </div>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl bg-sky p-8 text-snow min-h-[280px]">
          <p className="text-xs uppercase tracking-[0.2em] text-snow/80">{t("promoKicker")}</p>
          <h3 className="mt-4 max-w-sm font-serif text-4xl">{t("promoTitle")}</h3>
          <p className="mt-4 max-w-md text-sm text-snow/85">{t("promoBody")}</p>
          <Link href="/treks" className="mt-8 inline-flex rounded-2xl bg-snow px-5 py-2.5 text-sm font-medium text-ink hover:bg-ivory">
            {t("promoCta")}
          </Link>
        </div>
        <div className="grid gap-4">
          {cards.map(({ trip, chip }) => (
            <Link
              key={trip.id}
              href={tripHref(trip)}
              className="flex gap-4 overflow-hidden rounded-2xl bg-snow ring-1 ring-ink/8 shadow-[var(--shadow)]"
            >
              <div className="relative h-28 w-36 shrink-0 overflow-hidden sm:h-32 sm:w-44">
                <FilmImage src={trip.heroImageUrl} className="absolute inset-0" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center py-3 pe-4">
                <p className="text-[10px] uppercase tracking-[0.14em] text-sky">{chip}</p>
                <h3 className="mt-1 truncate font-serif text-xl">{trip.name}</h3>
                <p className="mt-1 text-sm text-sky">
                  {tt("from")} ${trip.priceFromUsd}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
