"use client";

import { useEffect, useState, type ReactNode } from "react";
import { WAVES } from "@/components/ui/SceneMarks";
import { HomeBookBar } from "@/components/home/HomeBookBar";
import type { Trip } from "@/lib/api";

export function HeroCarousel({
  trips,
  children,
  kicker,
  headline,
  posterUrl,
  videoUrl,
}: {
  trips: Trip[];
  children?: ReactNode;
  kicker: string;
  headline: string;
  posterUrl?: string | null;
  videoUrl?: string | null;
}) {
  const [canPlay, setCanPlay] = useState(false);
  const poster = posterUrl || "/heroes/hero-poster.jpg";
  const video = videoUrl || "/heroes/hero.mp4";

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
      <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
      {canPlay && video && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
        >
          <source src={video} type="video/mp4" />
        </video>
      )}

      <div className="hero-vignette absolute inset-0" />

      <div className="relative z-20 mx-auto flex min-h-[82svh] w-full max-w-6xl flex-col justify-end px-5 pb-8 pt-28 md:min-h-[88svh] lg:px-8">
        <div className="flex flex-col items-center text-center text-snow">
          <p className="text-[10px] uppercase tracking-[0.22em] text-snow/70 sm:text-xs sm:tracking-[0.28em]">
            {kicker}
          </p>
          <h1 className="mx-auto mt-3 max-w-3xl whitespace-pre-line font-serif text-[clamp(1.85rem,4.6vw,3.6rem)] leading-[1.08] font-normal text-snow">
            {headline}
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
