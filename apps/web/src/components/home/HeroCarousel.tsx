"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { WAVES } from "@/components/ui/SceneMarks";
import { HomeBookBar } from "@/components/home/HomeBookBar";
import type { Trip } from "@/lib/api";

export function HeroCarousel({ trips }: { trips: Trip[] }) {
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
    <section className="relative min-h-[62svh] overflow-hidden bg-ink md:min-h-[58svh] lg:min-h-[64svh]">
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

      <div className="absolute inset-0 z-20 flex flex-col items-center px-5 pt-[14%] pb-[11vh] text-center text-snow md:pt-[12%]">
        <p className="text-[10px] uppercase tracking-[0.22em] text-snow/70 sm:text-xs sm:tracking-[0.28em]">
          {t("kicker")}
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl font-serif text-[clamp(1.85rem,4.6vw,3.6rem)] leading-[1.08] font-normal text-snow">
          {t("headline")}
        </h1>
        <div className="mt-5 w-full max-w-5xl md:mt-6">
          <HomeBookBar trips={trips} />
        </div>
      </div>

      <svg className="hero-wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden>
        <path fill="var(--ivory)" d={WAVES} />
      </svg>
    </section>
  );
}
