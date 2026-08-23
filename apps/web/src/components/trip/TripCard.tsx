import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import type { Trip } from "@/lib/api";
import { tripHref } from "@/lib/api";
import { FilmImage } from "@/components/ui/FilmImage";

export async function TripCard({ trip, large = false, chip }: { trip: Trip; large?: boolean; chip?: string }) {
  const t = await getTranslations("trek");
  const river = trip.kind === "rafting";
  return (
    <Link
      href={tripHref(trip)}
      className={`group block overflow-hidden bg-snow shadow-[var(--shadow)] ring-1 ring-ink/6 transition hover:-translate-y-0.5 ${large ? "rounded-2xl" : "rounded-2xl"}`}
    >
      <div className={`relative overflow-hidden ${large ? "aspect-[16/11]" : "aspect-[4/3]"}`}>
        <FilmImage src={trip.heroImageUrl} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" />
        <p className="absolute top-3 start-3 rounded-2xl bg-snow/95 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-ink">
          {chip || (river ? t("raftTag") : t("trekTag"))}
        </p>
        <p className="absolute bottom-3 start-4 text-xs text-snow/90">
          {t("days", { count: trip.durationDays })} · {river ? trip.grade : trip.difficultyLabel}
        </p>
      </div>
      <div className="space-y-2 p-5">
        <h3 className={`font-serif leading-tight ${large ? "text-3xl" : "text-2xl"}`}>{trip.name}</h3>
        <p className="text-sm leading-relaxed text-ink-soft">{trip.summary}</p>
        <p className="pt-2 text-sm font-medium text-sky">
          {t("from")} ${trip.priceFromUsd}
        </p>
      </div>
    </Link>
  );
}
