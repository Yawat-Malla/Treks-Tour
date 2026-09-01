import { Link } from "@/i18n/navigation";
import { FilmImage } from "@/components/ui/FilmImage";
import { WAVES } from "@/components/ui/SceneMarks";
import { Clock, Mountain } from "lucide-react";
import type { Trip } from "@/lib/api";
import { tripHref } from "@/lib/api";

export function TrekCtaBanner({ trip, daysLabel, bookNow }: { trip: Trip; daysLabel: string; bookNow: string }) {
  const meta = trip.grade || trip.difficultyLabel;

  return (
    <section className="relative overflow-hidden bg-ink py-24">
      <FilmImage src={trip.heroImageUrl} className="absolute inset-0" />
      <div className="absolute inset-0 bg-ink/45" />
      <div className="relative z-10 mx-auto max-w-3xl px-5 text-center text-snow">
        <h2 className="font-serif text-4xl sm:text-6xl">{trip.name}</h2>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-6 text-sm text-snow/85">
          <span className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {daysLabel}
          </span>
          <span className="inline-flex items-center gap-2">
            <Mountain className="h-4 w-4" />
            {meta}
          </span>
        </div>
        <Link
          href={tripHref(trip)}
          className="mt-8 inline-block rounded-full bg-ink px-8 py-3 text-sm font-medium text-snow ring-1 ring-snow/20 hover:bg-moss-deep"
        >
          {bookNow}
        </Link>
      </div>
      <svg className="hero-wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden>
        <path fill="var(--ivory)" d={WAVES} />
      </svg>
    </section>
  );
}
