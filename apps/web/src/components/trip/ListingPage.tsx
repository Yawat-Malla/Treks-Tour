import { getLocale, getTranslations } from "next-intl/server";
import { fetchPublic, tripHref, type Trip } from "@/lib/api";
import { TripCard } from "@/components/trip/TripCard";
import { PageHero } from "@/components/ui/PageHero";
import { siteCopy } from "@/lib/site-copy";
import { Link } from "@/i18n/navigation";
import { REGION_LABEL, regionToPath } from "@/lib/regions";

export async function ListingPage({
  kind,
}: {
  kind: "trek" | "rafting" | "activity" | "safari";
}) {
  const locale = await getLocale();
  const t = await getTranslations("featured");
  const trekT = await getTranslations("trek");
  const data = await fetchPublic(locale);
  const { settings } = data;
  const c = (key: string, fb: string) => siteCopy(settings, `featured.${key}`, fb);
  const trips: Trip[] =
    kind === "trek" ? data.treks : kind === "rafting" ? data.rafting : kind === "activity" ? data.activities : data.safaris;
  const copy = {
    trek: {
      kicker: c("trekKicker", t("trekKicker")),
      title: c("trekTitle", t("trekTitle")),
      lede: c("trekLede", t("trekLede")),
    },
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
        {kind === "trek" && trips.length > 0 && (
          <div className="mb-14 overflow-x-auto rounded-2xl bg-snow ring-1 ring-ink/8">
            <table className="min-w-full text-left text-sm">
              <caption className="sr-only">{copy.title}</caption>
              <thead className="border-b border-ink/10 text-xs uppercase tracking-[0.12em] text-ink-soft">
                <tr>
                  <th className="px-4 py-3 font-medium">{trekT("compareName")}</th>
                  <th className="px-4 py-3 font-medium">{trekT("compareDays")}</th>
                  <th className="px-4 py-3 font-medium">{trekT("compareAltitude")}</th>
                  <th className="px-4 py-3 font-medium">{trekT("difficulty")}</th>
                  <th className="px-4 py-3 font-medium">{trekT("from")}</th>
                  <th className="px-4 py-3 font-medium">{trekT("compareRegion")}</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip) => (
                  <tr key={trip.id} className="border-b border-ink/6 last:border-0">
                    <td className="px-4 py-3">
                      <Link href={tripHref(trip)} className="font-medium text-sky hover:underline">
                        {trip.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{trip.durationDays}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{trip.maxAltitudeM ? `${trip.maxAltitudeM} m` : "—"}</td>
                    <td className="px-4 py-3">{trip.difficultyLabel}</td>
                    <td className="px-4 py-3 whitespace-nowrap">${trip.priceFromUsd}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {regionToPath(trip.region) ? (
                        <Link href={regionToPath(trip.region)!} className="text-sky hover:underline">
                          {REGION_LABEL[trip.region]}
                        </Link>
                      ) : (
                        REGION_LABEL[trip.region]
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
        {kind === "trek" && (
          <p className="mt-10 text-sm text-ink-soft">
            <Link href="/destinations/annapurna" className="text-sky hover:underline">
              Annapurna
            </Link>
            {" · "}
            <Link href="/destinations/everest" className="text-sky hover:underline">
              Everest
            </Link>
            {" · "}
            <Link href="/destinations/langtang" className="text-sky hover:underline">
              Langtang
            </Link>
            {" · "}
            <Link href="/destinations/restricted" className="text-sky hover:underline">
              Restricted areas
            </Link>
            {" · "}
            <Link href="/destinations/hidden-gems" className="text-sky hover:underline">
              Quieter ridges
            </Link>
          </p>
        )}
      </div>
    </>
  );
}
