import { getLocale, getTranslations } from "next-intl/server";
import { fetchPublic } from "@/lib/api";
import { TripCard } from "@/components/trip/TripCard";

export default async function TreksPage() {
  const locale = await getLocale();
  const t = await getTranslations("featured");
  const { treks } = await fetchPublic(locale);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-copper">{t("kicker")}</p>
      <h1 className="mt-3 font-serif text-5xl">{t("title")}</h1>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {treks.map((trek) => (
          <TripCard key={trek.id} trip={trek} />
        ))}
      </div>
    </div>
  );
}
