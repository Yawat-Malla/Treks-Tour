import { getLocale, getTranslations } from "next-intl/server";
import { fetchPublic } from "@/lib/api";
import { TripCard } from "@/components/trip/TripCard";

export default async function RaftingPage() {
  const locale = await getLocale();
  const t = await getTranslations("featured");
  const { rafting } = await fetchPublic(locale);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-river">{t("raftKicker")}</p>
      <h1 className="mt-3 font-serif text-5xl">{t("raftTitle")}</h1>
      <p className="mt-4 max-w-2xl text-ink-soft">{t("raftLede")}</p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {rafting.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  );
}
