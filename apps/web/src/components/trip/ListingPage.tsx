import { getLocale, getTranslations } from "next-intl/server";
import { fetchPublic, type Trip } from "@/lib/api";
import { TripCard } from "@/components/trip/TripCard";
import { PageHero } from "@/components/ui/PageHero";

export async function ListingPage({
  kind,
}: {
  kind: "trek" | "rafting" | "activity" | "safari";
}) {
  const locale = await getLocale();
  const t = await getTranslations("featured");
  const data = await fetchPublic(locale);
  const trips: Trip[] =
    kind === "trek" ? data.treks : kind === "rafting" ? data.rafting : kind === "activity" ? data.activities : data.safaris;
  const copy = {
    trek: { kicker: t("kicker"), title: t("title"), lede: undefined as string | undefined },
    rafting: { kicker: t("raftKicker"), title: t("raftTitle"), lede: t("raftLede") },
    activity: { kicker: t("activityKicker"), title: t("activityTitle"), lede: t("activityLede") },
    safari: { kicker: t("safariKicker"), title: t("safariTitle"), lede: t("safariLede") },
  }[kind];
  const hero = trips[0]?.heroImageUrl || "/heroes/hero-poster.jpg";

  return (
    <>
      <PageHero kicker={copy.kicker} title={copy.title} lede={copy.lede} image={hero} />
      <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>
    </>
  );
}
