import { getLocale, getTranslations } from "next-intl/server";
import { fetchPublic } from "@/lib/api";
import { TripCard } from "@/components/trip/TripCard";

export default async function ActivitiesPage() {
  const locale = await getLocale();
  const t = await getTranslations("featured");
  const { activities } = await fetchPublic(locale);

  return (
    <div className="wash-sky">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <p className="text-xs uppercase tracking-[0.22em] text-copper">{t("activityKicker")}</p>
        <h1 className="mt-3 font-serif text-5xl">{t("activityTitle")}</h1>
        <p className="mt-4 max-w-2xl text-ink-soft">{t("activityLede")}</p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {activities.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>
    </div>
  );
}
