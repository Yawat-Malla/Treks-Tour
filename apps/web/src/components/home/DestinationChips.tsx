"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { FilmImage } from "@/components/ui/FilmImage";
import { fillCopy } from "@/lib/site-copy";
import type { ChipCard } from "@/cms/page-catalog";

type TabId = "destinations" | "activities" | "difficulty";

export function DestinationChips({
  chips,
  labels,
}: {
  chips: ChipCard[];
  labels: {
    destinations: string;
    activities: string;
    difficulty: string;
    trips: string;
    titles: Record<string, string>;
  };
}) {
  const [activeTab, setActiveTab] = useState<TabId>("destinations");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const tabsData = useMemo(
    () => ({
      destinations: chips.filter((c) => c.tab === "destinations"),
      activities: chips.filter((c) => c.tab === "activities"),
      difficulty: chips.filter((c) => c.tab === "difficulty"),
    }),
    [chips],
  );

  const checkScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const isRtl = getComputedStyle(el).direction === "rtl";
    const maxScroll = el.scrollWidth - el.clientWidth;
    const currentScroll = Math.abs(el.scrollLeft);

    setCanScrollLeft(isRtl ? currentScroll < maxScroll - 5 : currentScroll > 5);
    setCanScrollRight(isRtl ? currentScroll > 5 : currentScroll < maxScroll - 5);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: 0 });
    checkScroll();
  }, [activeTab]);

  const scroll = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const isRtl = getComputedStyle(el).direction === "rtl";
    const delta = (isRtl ? -dir : dir) * (el.clientWidth * 0.7);
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  const currentCards = tabsData[activeTab];

  return (
    <div className="relative mt-5 w-full rounded-3xl bg-snow/85 p-4 shadow-[0_16px_48px_rgba(11,31,58,0.25)] ring-1 ring-snow/60 backdrop-blur-md sm:p-5 md:p-6 dark:bg-ink/80 dark:ring-snow/10">
      <div className="mb-4 flex items-center gap-6 border-b border-ink/10 pb-3 sm:gap-8 dark:border-snow/10">
        {(["destinations", "activities", "difficulty"] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative -mb-[13px] pb-3 text-xs font-bold tracking-[0.14em] uppercase transition sm:text-sm ${
                isActive
                  ? "border-b-2 border-ink text-ink dark:border-snow dark:text-snow"
                  : "text-ink-soft/75 hover:text-ink dark:text-snow/60 dark:hover:text-snow"
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      <div className="relative">
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="absolute -left-2 top-1/2 z-30 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-ink text-snow shadow-xl ring-2 ring-snow/40 transition hover:bg-sky sm:-left-3.5 sm:h-11 sm:w-11 dark:bg-river"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
          </button>
        )}

        <div
          ref={scrollerRef}
          onScroll={checkScroll}
          className="flex gap-3.5 overflow-x-auto pb-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4"
        >
          {currentCards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="group relative aspect-[3/4] w-[142px] shrink-0 snap-start overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl sm:w-[168px] md:w-[180px]"
            >
              <FilmImage
                src={card.image}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35" />
              <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-black/45 px-2.5 py-0.5 text-[10px] font-medium text-white shadow-sm ring-1 ring-white/20 backdrop-blur-md sm:left-3 sm:top-3 sm:text-[11px]">
                {fillCopy(labels.trips, { count: card.count })}
              </span>
              <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-2 p-3 sm:p-3.5">
                <p className="font-sans text-xs font-semibold leading-snug text-white drop-shadow-sm sm:text-sm">
                  {labels.titles[card.titleKey] || card.titleKey}
                </p>
                <ArrowRight className="h-4 w-4 shrink-0 text-white/90 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180" />
              </div>
            </Link>
          ))}
        </div>

        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll(1)}
            className="absolute -right-2 top-1/2 z-30 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-ink text-snow shadow-xl ring-2 ring-snow/40 transition hover:bg-sky sm:-right-3.5 sm:h-11 sm:w-11 dark:bg-river"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 rtl:rotate-180" />
          </button>
        )}
      </div>
    </div>
  );
}
