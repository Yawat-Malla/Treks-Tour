import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Trek } from "@/lib/api";

export async function TrekCard({ trek }: { trek: Trek }) {
  const t = await getTranslations("trek");
  return (
    <Link
      href={`/treks/${trek.slug}`}
      className="group block overflow-hidden rounded-[1.6rem] bg-snow shadow-[0_16px_40px_rgba(27,25,21,0.08)] ring-1 ring-ink/6 transition hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(27,25,21,0.12)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={trek.heroImageUrl}
          alt=""
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
        <p className="absolute bottom-3 start-4 text-xs text-snow/90">
          {t("days", { count: trek.durationDays })} · {trek.difficultyLabel}
        </p>
      </div>
      <div className="space-y-2 p-5">
        <h3 className="font-serif text-2xl leading-tight">{trek.name}</h3>
        <p className="text-sm leading-relaxed text-ink-soft">{trek.summary}</p>
        <p className="pt-2 text-sm font-medium text-sky">
          {t("from")} ${trek.priceFromUsd}
        </p>
      </div>
    </Link>
  );
}
