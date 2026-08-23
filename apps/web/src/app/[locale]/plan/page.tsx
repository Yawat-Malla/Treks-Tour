import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { fetchPublic } from "@/lib/api";
import { SeasonStrip } from "@/components/home/SeasonStrip";
import { TripCard } from "@/components/trip/TripCard";

export default async function PlanPage() {
  const locale = await getLocale();
  const t = await getTranslations("plan");
  const { treks, rafting } = await fetchPublic(locale);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-copper">{t("kicker")}</p>
      <h1 className="mt-3 max-w-3xl font-serif text-5xl sm:text-6xl">{t("title")}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{t("lede")}</p>

      <div className="mt-16">
        <SeasonStrip />
      </div>

      <section className="mt-20">
        <h2 className="font-serif text-4xl">{t("whoTitle")}</h2>
        <p className="mt-3 max-w-2xl text-ink-soft">{t("whoLede")}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {treks.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </section>

      <section className="mt-20">
        <h2 className="font-serif text-4xl">{t("riverTitle")}</h2>
        <p className="mt-3 max-w-2xl text-ink-soft">{t("riverLede")}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {rafting.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-8 rounded-[2rem] bg-snow p-8 ring-1 ring-ink/8 md:grid-cols-2 md:p-12">
        <div>
          <h2 className="font-serif text-3xl">{t("groupTitle")}</h2>
          <p className="mt-4 leading-relaxed text-ink-soft">{t("groupBody")}</p>
        </div>
        <div>
          <h2 className="font-serif text-3xl">{t("privateTitle")}</h2>
          <p className="mt-4 leading-relaxed text-ink-soft">{t("privateBody")}</p>
        </div>
      </section>

      <p className="mt-12 text-sm text-ink-soft">
        {t("prepareCue")}{" "}
        <Link href="/prepare" className="text-moss underline-offset-4 hover:underline">
          {t("prepareLink")}
        </Link>
      </p>
    </div>
  );
}
