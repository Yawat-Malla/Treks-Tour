"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { WAVES } from "@/components/ui/SceneMarks";
import { HomeBookBar } from "@/components/home/HomeBookBar";
import type { Trip } from "@/lib/api";

export function HeroCarousel({ trips, children }: { trips: Trip[]; children?: ReactNode }) {
  // #region agent log
  fetch('http://127.0.0.1:7250/ingest/4f909da6-e362-4dd0-8c11-1048ad8b271f',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'894e04'},body:JSON.stringify({sessionId:'894e04',runId:'run1',hypothesisId:'H1_H2',location:'HeroCarousel.tsx:10',message:'HeroCarousel render',data:{isClient:typeof window!=='undefined',tripCount:trips?.length,hasChildren:Boolean(children)},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  const t = useTranslations("hero");
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setCanPlay(!media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <section className="relative min-h-[82svh] overflow-hidden bg-ink md:min-h-[88svh]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/heroes/hero-poster.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      {canPlay && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          poster="/heroes/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
        >
          <source src="/heroes/hero.mp4" type="video/mp4" />
        </video>
      )}

      <div className="hero-vignette absolute inset-0" />

      <div className="relative z-20 mx-auto flex min-h-[82svh] w-full max-w-6xl flex-col justify-end px-5 pb-8 pt-28 md:min-h-[88svh] lg:px-8">
        <div className="flex flex-col items-center text-center text-snow">
          <p className="text-[10px] uppercase tracking-[0.22em] text-snow/70 sm:text-xs sm:tracking-[0.28em]">
            {t("kicker")}
          </p>
          <h1 className="mx-auto mt-3 max-w-3xl font-serif text-[clamp(1.85rem,4.6vw,3.6rem)] leading-[1.08] font-normal text-snow">
            {t("headline")}
          </h1>
          <div className="mt-7 w-full">
            <HomeBookBar trips={trips} />
          </div>
        </div>
        {children}
      </div>

      <svg className="hero-wave z-10" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden>
        <path fill="var(--ivory)" d={WAVES} />
      </svg>
    </section>
  );
}
