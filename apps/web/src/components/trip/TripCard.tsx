import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import type { Trip } from "@/lib/api";
import { tripHref } from "@/lib/api";
import { FilmImage } from "@/components/ui/FilmImage";
import { Clock, Mountain, DollarSign } from "lucide-react";

export async function TripCard({ trip, large = false, chip }: { trip: Trip; large?: boolean; chip?: string }) {
  const t = await getTranslations("trek");
  const tag =
    chip ||
    (trip.featured
      ? t("bestSeller")
      : trip.kind === "rafting"
        ? t("raftTag")
        : trip.kind === "activity"
          ? t("activityTag")
          : trip.kind === "safari"
            ? t("safariTag")
            : t("trekTag"));
  const meta =
    trip.kind === "rafting" || trip.kind === "activity"
      ? trip.grade || trip.difficultyLabel
      : trip.difficultyLabel;
  const gold = trip.featured && !chip;

  return (
    <Link
      href={tripHref(trip)}
      className="group block overflow-hidden rounded-2xl bg-snow shadow-[var(--shadow)] ring-1 ring-ink/6 transition hover:-translate-y-0.5"
    >
      <div className={`relative overflow-hidden ${large ? "aspect-[4/3]" : "aspect-[5/4]"}`}>
        <FilmImage src={trip.heroImageUrl} className="absolute inset-0" />
        <p
          className={`absolute top-3 end-3 rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
            gold ? "bg-gold text-ink" : "bg-snow/95 text-ink"
          }`}
        >
          {tag}
        </p>
      </div>
      <div className="space-y-3 p-5">
        <h3 className={`font-serif leading-tight ${large ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>{trip.name}</h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-sky" />
            {t("days", { count: trip.durationDays })}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Mountain className="h-3.5 w-3.5 text-sky" />
            {meta}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-sky" />
            {t("from")} ${trip.priceFromUsd}
          </span>
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-ink-soft">{trip.summary}</p>
      </div>
    </Link>
  );
}
