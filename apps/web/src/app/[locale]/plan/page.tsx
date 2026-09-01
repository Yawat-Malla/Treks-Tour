import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { fetchPublic } from "@/lib/api";
import { SeasonStrip } from "@/components/home/SeasonStrip";
import { TripCard } from "@/components/trip/TripCard";
import { PokharaMap } from "@/components/home/PokharaMap";
import { PageHero } from "@/components/ui/PageHero";
import { siteCopy } from "@/lib/site-copy";

export default async function PlanPage() {
  const locale = await getLocale();
  const t = await getTranslations("plan");
  const { settings, treks, rafting, activities, safaris, trips } = await fetchPublic(locale);
  const c = (key: string) => siteCopy(settings, `plan.${key}`, () => t(key));
  const hero = treks[0]?.heroImageUrl || settings.heroPosterUrl || "/heroes/hero-poster.jpg";

  return (
    <>
      <PageHero kicker={c("kicker")} title={c("title")} lede={c("lede")} image={hero} />
      <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <div>
          <SeasonStrip />
        </div>

        <section className="mt-16">
          <PokharaMap trips={trips} />
        </section>

        <section className="mt-20">
          <h2 className="font-serif text-4xl">{c("whoTitle")}</h2>
          <p className="mt-3 max-w-2xl text-ink-soft">{c("whoLede")}</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {treks.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>

        <section className="mt-20">
          <h2 className="font-serif text-4xl">{c("riverTitle")}</h2>
          <p className="mt-3 max-w-2xl text-ink-soft">{c("riverLede")}</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {rafting.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>

        {activities.length > 0 && (
          <section className="mt-20">
            <h2 className="font-serif text-4xl">{c("activityTitle")}</h2>
            <p className="mt-3 max-w-2xl text-ink-soft">{c("activityLede")}</p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {activities.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </section>
        )}

        {safaris.length > 0 && (
          <section className="mt-20">
            <h2 className="font-serif text-4xl">{c("safariTitle")}</h2>
            <p className="mt-3 max-w-2xl text-ink-soft">{c("safariLede")}</p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {safaris.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-20 grid gap-8 rounded-2xl bg-snow p-8 ring-1 ring-ink/8 md:grid-cols-2 md:p-12">
          <div>
            <h2 className="font-serif text-3xl">{c("groupTitle")}</h2>
            <p className="mt-4 leading-relaxed text-ink-soft">{c("groupBody")}</p>
          </div>
          <div>
            <h2 className="font-serif text-3xl">{c("privateTitle")}</h2>
            <p className="mt-4 leading-relaxed text-ink-soft">{c("privateBody")}</p>
          </div>
        </section>

        <p className="mt-12 text-sm text-ink-soft">
          {c("prepareCue")}{" "}
          <Link href="/prepare" className="text-sky underline-offset-4 hover:underline">
            {c("prepareLink")}
          </Link>
        </p>
      </div>
    </>
  );
}
