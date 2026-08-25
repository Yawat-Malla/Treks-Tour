"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight, Mountain, Waves } from "lucide-react";
import type { Trip } from "@/lib/api";
import { tripHref } from "@/lib/api";
import { FilmImage } from "@/components/ui/FilmImage";

export function HeroTripRail({ treks, rafting }: { treks: Trip[]; rafting: Trip[] }) {
  const t = useTranslations("bookBar");
  const days = useTranslations("trek");
  const [kind, setKind] = useState<"trek" | "rafting">("trek");
  const pool = kind === "trek" ? treks : rafting;
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollTo({ left: rtl ? el.scrollWidth : 0 });
  }, [kind]);

  function scrollByDir(dir: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    const delta = (rtl ? -dir : dir) * Math.min(el.clientWidth * 0.7, 300);
    el.scrollBy({ left: delta, behavior: "smooth" });
  }

  if (!treks.length && !rafting.length) return null;

  return (
    <div className="relative z-20 mx-auto -mt-12 max-w-6xl px-5 md:-mt-16 lg:-mt-[4.5rem] lg:px-8">
      <div className="rounded-2xl bg-snow/80 p-4 shadow-[var(--shadow)] ring-1 ring-ink/8 backdrop-blur-md sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setKind("trek")}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm ${
                kind === "trek" ? "bg-moss text-snow" : "bg-ivory text-ink-soft"
              }`}
            >
              <Mountain className="h-4 w-4" />
              {t("trek")}
            </button>
            {rafting.length > 0 && (
              <button
                type="button"
                onClick={() => setKind("rafting")}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm ${
                  kind === "rafting" ? "bg-moss text-snow" : "bg-ivory text-ink-soft"
                }`}
              >
                <Waves className="h-4 w-4" />
                {t("raft")}
              </button>
            )}
          </div>
          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              onClick={() => scrollByDir(-1)}
              className="grid h-9 w-9 place-items-center rounded-full bg-ivory text-ink ring-1 ring-ink/10 transition hover:bg-snow"
              aria-label={t("prev")}
            >
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => scrollByDir(1)}
              className="grid h-9 w-9 place-items-center rounded-full bg-ivory text-ink ring-1 ring-ink/10 transition hover:bg-snow"
              aria-label={t("next")}
            >
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto pb-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {pool.map((trip) => (
            <Link
              key={trip.id}
              href={tripHref(trip)}
              className="group relative w-[min(78vw,16.5rem)] shrink-0 snap-start overflow-hidden rounded-2xl"
            >
              <div className="relative aspect-[16/10]">
                <FilmImage src={trip.heroImageUrl} className="absolute inset-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3.5">
                  <p className="font-serif text-lg leading-tight text-snow">{trip.name}</p>
                  <p className="mt-0.5 text-xs text-snow/85">{days("days", { count: trip.durationDays })}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
