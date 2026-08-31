"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { FilmImage } from "@/components/ui/FilmImage";
import type { Trip } from "@/lib/api";

type TabId = "destinations" | "activities" | "difficulty";

interface CardItem {
  id: string;
  titleKey: string;
  count: number;
  href: "/treks" | "/rafting" | "/activities" | "/safaris";
  image: string;
}

const FALLBACK_IMAGES = {
  everest: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80",
  annapurna: "https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=2000&q=80",
  langtang: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=2000&q=80",
  restricted: "https://images.unsplash.com/photo-1758701320941-89f86492c1ef?auto=format&fit=crop&w=2000&q=80",
  hiddenGems: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2000&q=80",
  allOther: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80",
  rafting: "https://images.pexels.com/photos/1732278/pexels-photo-1732278.jpeg?auto=compress&cs=tinysrgb&w=2000",
  air: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=2000&q=80",
  extreme: "https://images.unsplash.com/photo-1559677624-3c956f10d431?auto=format&fit=crop&w=2000&q=80",
  safaris: "https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=2000",
  zip: "https://images.unsplash.com/photo-1696940389431-b6a2f2e1b784?auto=format&fit=crop&w=2000&q=80",
  easy: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80",
  moderate: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=2000&q=80",
  challenging: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=2000&q=80",
};

export function DestinationChips({
  treks = [],
  rafting = [],
  activities = [],
  safaris = [],
}: {
  treks?: Trip[];
  rafting?: Trip[];
  activities?: Trip[];
  safaris?: Trip[];
}) {
  const t = useTranslations("heroTabs");
  const [activeTab, setActiveTab] = useState<TabId>("destinations");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Derive images from trips if available
  const findTripImg = (slugMatch: string, fallback: string) => {
    const matched = treks.find((tr) => tr.slug.toLowerCase().includes(slugMatch.toLowerCase()));
    return matched?.heroImageUrl || fallback;
  };

  const tabsData = useMemo<Record<TabId, CardItem[]>>(() => {
    const easyCount = treks.filter((tr) => tr.difficulty === "easy").length || 8;
    const modCount = treks.filter((tr) => tr.difficulty === "moderate").length || 9;
    const chalCount = treks.filter((tr) => tr.difficulty === "challenging").length || 7;

    return {
      destinations: [
        {
          id: "everest",
          titleKey: "everest",
          count: 3,
          href: "/treks",
          image: findTripImg("ebc", FALLBACK_IMAGES.everest),
        },
        {
          id: "annapurna",
          titleKey: "annapurna",
          count: 7,
          href: "/treks",
          image: findTripImg("abc", FALLBACK_IMAGES.annapurna),
        },
        {
          id: "langtang",
          titleKey: "langtang",
          count: 2,
          href: "/treks",
          image: findTripImg("langtang", FALLBACK_IMAGES.langtang),
        },
        {
          id: "restricted",
          titleKey: "restricted",
          count: 3,
          href: "/treks",
          image: findTripImg("mustang", FALLBACK_IMAGES.restricted),
        },
        {
          id: "hiddenGems",
          titleKey: "hiddenGems",
          count: 7,
          href: "/treks",
          image: findTripImg("panchase", FALLBACK_IMAGES.hiddenGems),
        },
        {
          id: "allOther",
          titleKey: "allOther",
          count: 9,
          href: "/treks",
          image: findTripImg("kanchenjunga", FALLBACK_IMAGES.allOther),
        },
      ],
      activities: [
        {
          id: "treks",
          titleKey: "treks",
          count: treks.length || 18,
          href: "/treks",
          image: treks[0]?.heroImageUrl || FALLBACK_IMAGES.annapurna,
        },
        {
          id: "rafting",
          titleKey: "rafting",
          count: rafting.length || 3,
          href: "/rafting",
          image: rafting[0]?.heroImageUrl || FALLBACK_IMAGES.rafting,
        },
        {
          id: "air",
          titleKey: "air",
          count: 2,
          href: "/activities",
          image: findTripImg("balloon", FALLBACK_IMAGES.air),
        },
        {
          id: "extreme",
          titleKey: "extreme",
          count: 4,
          href: "/activities",
          image: findTripImg("bungee", FALLBACK_IMAGES.extreme),
        },
        {
          id: "safaris",
          titleKey: "safaris",
          count: safaris.length || 3,
          href: "/safaris",
          image: safaris[0]?.heroImageUrl || FALLBACK_IMAGES.safaris,
        },
        {
          id: "zip",
          titleKey: "zip",
          count: 3,
          href: "/activities",
          image: findTripImg("zip", FALLBACK_IMAGES.zip),
        },
      ],
      difficulty: [
        {
          id: "easy",
          titleKey: "easy",
          count: easyCount,
          href: "/treks",
          image: findTripImg("sarangkot", FALLBACK_IMAGES.easy),
        },
        {
          id: "moderate",
          titleKey: "moderate",
          count: modCount,
          href: "/treks",
          image: findTripImg("mardi", FALLBACK_IMAGES.moderate),
        },
        {
          id: "challenging",
          titleKey: "challenging",
          count: chalCount,
          href: "/treks",
          image: findTripImg("circuit", FALLBACK_IMAGES.challenging),
        },
      ],
    };
  }, [treks, rafting, activities, safaris]);

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
      {/* Top Tabs Header */}
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
              {t(tab)}
            </button>
          );
        })}
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow Button */}
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

        {/* Scrollable Track */}
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
              {/* Background Image */}
              <FilmImage
                src={card.image}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35" />

              {/* Top-Left Trips Badge */}
              <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-black/45 px-2.5 py-0.5 text-[10px] font-medium text-white shadow-sm ring-1 ring-white/20 backdrop-blur-md sm:left-3 sm:top-3 sm:text-[11px]">
                {t("trips", { count: card.count })}
              </span>

              {/* Bottom Title & Arrow */}
              <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-2 p-3 sm:p-3.5">
                <p className="font-sans text-xs font-semibold leading-snug text-white drop-shadow-sm sm:text-sm">
                  {t(card.titleKey)}
                </p>
                <ArrowRight className="h-4 w-4 shrink-0 text-white/90 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180" />
              </div>
            </Link>
          ))}
        </div>

        {/* Right Arrow Button */}
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
