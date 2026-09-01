import { getLocale, getTranslations } from "next-intl/server";
import { fetchPublic, type Trip } from "@/lib/api";
import { TripCard } from "@/components/trip/TripCard";
import { PageHero } from "@/components/ui/PageHero";
import { siteCopy } from "@/lib/site-copy";

export async function ListingPage({
  kind,
}: {
  kind: "trek" | "rafting" | "activity" | "safari";
}) {
  const locale = await getLocale();
  const t = await getTranslations("featured");
  const data = await fetchPublic(locale);
  const { settings } = data;
  const c = (key: string, fb: string) => siteCopy(settings, `featured.${key}`, fb);
  const trips: Trip[] =
    kind === "trek" ? data.treks : kind === "rafting" ? data.rafting : kind === "activity" ? data.activities : data.safaris;
  const copy = {
    trek: { kicker: c("kicker", t("kicker")), title: c("title", t("title")), lede: undefined as string | undefined },
    rafting: { kicker: c("raftKicker", t("raftKicker")), title: c("raftTitle", t("raftTitle")), lede: c("raftLede", t("raftLede")) },
    activity: {
      kicker: c("activityKicker", t("activityKicker")),
      title: c("activityTitle", t("activityTitle")),
      lede: c("activityLede", t("activityLede")),
    },
    safari: { kicker: c("safariKicker", t("safariKicker")), title: c("safariTitle", t("safariTitle")), lede: c("safariLede", t("safariLede")) },
  }[kind];
  const hero = trips[0]?.heroImageUrl || settings.heroPosterUrl || "/heroes/hero-poster.jpg";

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
