"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

const SLIDES = [
  {
    id: "annapurna",
    word: "word1",
    caption: "caption1",
    pin: "pin1",
    bg: "https://images.unsplash.com/photo-1681018755651-f3fc6f340c37?auto=format&fit=crop&w=2400&h=1400&q=80",
    cutout: "/heroes/cutout-annapurna.png",
  },
  {
    id: "whitewater",
    word: "word2",
    caption: "caption2",
    pin: "pin2",
    bg: "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=2400&q=80",
    cutout: "/heroes/cutout-whitewater.png",
  },
  {
    id: "lakeside",
    word: "word3",
    caption: "caption3",
    pin: "pin3",
    bg: "https://images.unsplash.com/photo-1706187975952-33765f844667?auto=format&fit=crop&w=2400&q=80",
    cutout: "/heroes/cutout-lakeside.png",
  },
] as const;

export function HeroCarousel() {
  const t = useTranslations("carousel");
  const locale = useLocale();
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cutHidden, setCutHidden] = useState<Record<string, boolean>>({});
  const touchX = useRef<number | null>(null);

  const go = useCallback((next: number) => {
    setIndex((next + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (reduce || paused) return;
    const id = window.setInterval(() => go(index + 1), 2200);
    return () => window.clearInterval(id);
  }, [index, paused, reduce, go]);

  const slide = SLIDES[index];

  return (
    <section
      className="relative min-h-[72svh] overflow-hidden bg-ink md:min-h-[85svh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
      onTouchStart={(e) => {
        touchX.current = e.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchX.current;
        const end = e.changedTouches[0]?.clientX;
        touchX.current = null;
        if (start == null || end == null) return;
        const delta = end - start;
        if (Math.abs(delta) < 48) return;
        const rtl = locale === "he";
        const swipeNext = rtl ? delta > 0 : delta < 0;
        go(index + (swipeNext ? 1 : -1));
      }}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={`film absolute inset-0 h-full w-full ${reduce ? "" : "kenburns"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slide.bg} alt="" className="h-full w-full object-cover object-center" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-ink/15 to-ink/10 sm:from-ink/75 sm:via-ink/25 sm:to-ink/20" />
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 flex items-start justify-center px-4 pt-[18vh] sm:items-center sm:pt-16 sm:pb-[18vh]">
        <AnimatePresence mode="wait">
          <motion.h1
            key={`${slide.id}-word`}
            className="hero-word z-10 text-center"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {t(slide.word)}
          </motion.h1>
        </AnimatePresence>
      </div>

      {!cutHidden[slide.id] && (
        <AnimatePresence mode="wait">
          <motion.img
            key={`${slide.id}-cut`}
            src={slide.cutout}
            alt=""
            className="hero-cutout pointer-events-none absolute bottom-[8%] left-1/2 z-20 h-[30%] w-auto max-w-[min(70vw,520px)] -translate-x-1/2 object-contain object-bottom sm:h-[36%] lg:h-[40%]"
            initial={reduce ? false : { opacity: 0, y: "8%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: "4%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onError={() => setCutHidden((s) => ({ ...s, [slide.id]: true }))}
          />
        </AnimatePresence>
      )}

      <div className="absolute inset-x-0 bottom-24 z-30 px-5 text-center text-snow sm:bottom-32 lg:bottom-40">
        <p className="text-[10px] uppercase tracking-[0.22em] text-snow/70 sm:text-xs sm:tracking-[0.28em]">{t("kicker")}</p>
        <p className="mx-auto mt-2 max-w-lg text-xs text-snow/85 sm:mt-3 sm:text-base">{t(slide.caption)}</p>
        <p className="mt-1 hidden text-xs text-snow/55 sm:mt-2 sm:block">{t(slide.pin)}</p>
      </div>

      <nav
        className="absolute start-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 sm:flex lg:start-8"
        aria-label={t("slides")}
      >
        <span className="h-10 w-px bg-snow/30" />
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => go(i)}
            className={`font-sans text-xs tracking-[0.18em] ${i === index ? "text-snow" : "text-snow/40 hover:text-snow/70"}`}
            aria-current={i === index ? "true" : undefined}
          >
            {String(i + 1).padStart(2, "0")}
          </button>
        ))}
        <span className="h-10 w-px bg-snow/30" />
      </nav>

      <div className="absolute inset-x-0 bottom-8 z-30 flex justify-center gap-2 sm:hidden">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={t(s.word)}
            onClick={() => go(i)}
            className={`h-1.5 rounded-full ${i === index ? "w-6 bg-snow" : "w-1.5 bg-snow/40"}`}
          />
        ))}
      </div>
    </section>
  );
}
