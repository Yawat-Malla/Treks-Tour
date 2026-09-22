import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteSettings } from "@/lib/api";

function embedSrc(settings: SiteSettings) {
  const placeId = settings.googlePlaceId?.trim();
  const embedKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY?.trim();
  if (embedKey && placeId) {
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(embedKey)}&q=place_id:${encodeURIComponent(placeId)}&zoom=16`;
  }
  const lat = settings.geoLat;
  const lng = settings.geoLng;
  if (typeof lat === "number" && typeof lng === "number") {
    return `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  }
  if (settings.googleBusinessUrl) {
    const q = encodeURIComponent(settings.googleBusinessUrl);
    return `https://maps.google.com/maps?q=${q}&output=embed`;
  }
  return null;
}

export async function GoogleMapBand({ settings }: { settings: SiteSettings }) {
  const t = await getTranslations("googleMap");
  const src = embedSrc(settings);
  const mapsHref =
    settings.googleBusinessUrl ||
    (typeof settings.geoLat === "number" && typeof settings.geoLng === "number"
      ? `https://www.google.com/maps?q=${settings.geoLat},${settings.geoLng}`
      : null);

  if (!src && !mapsHref) return null;

  return (
    <section className="bg-ivory py-16">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-sky">{t("kicker")}</p>
          <h2 className="mt-3 font-serif text-4xl text-ink">{t("title")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-ink-soft">{t("lede")}</p>
        </Reveal>
        {src ? (
          <div className="mt-10 overflow-hidden rounded-2xl ring-1 ring-ink/10 shadow-[var(--shadow)]">
            <iframe
              title={t("iframeTitle")}
              src={src}
              className="h-[min(420px,70vh)] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        ) : null}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-ink-soft">
          <p>{settings.address}</p>
          {mapsHref ? (
            <a href={mapsHref} target="_blank" rel="noreferrer" className="font-medium text-sky hover:underline">
              {t("openMaps")}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
