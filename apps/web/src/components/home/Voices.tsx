"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import type { Testimonial } from "@/lib/api";

function initials(attribution: string) {
  const words = attribution
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function Stars() {
  return (
    <div className="flex gap-0.5 text-gold" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4 fill-current">
          <path d="M10 1.6 12.4 7l6 .5-4.6 4 1.4 5.9L10 14.6 4.8 17.4l1.4-5.9L1.6 7.5l6-.5L10 1.6Z" />
        </svg>
      ))}
    </div>
  );
}

function VoiceCard({ item }: { item: Testimonial }) {
  return (
    <blockquote className="flex h-full flex-col rounded-2xl bg-snow p-8 shadow-[var(--shadow)] ring-1 ring-ink/8 sm:p-10">
      <span className="font-serif text-6xl leading-none text-sky/35" aria-hidden>
        “
      </span>
      <Stars />
      <p className="mt-4 flex-1 font-serif text-xl leading-snug text-ink sm:text-2xl">“{item.quote}”</p>
      <footer className="mt-8 flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-river text-sm font-semibold tracking-wide text-snow">
          {initials(item.attribution)}
        </span>
        <cite className="text-sm not-italic text-ink-soft">{item.attribution}</cite>
      </footer>
    </blockquote>
  );
}

export function Voices({ items }: { items: Testimonial[] }) {
  const t = useTranslations("voices");
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(items.length / 2));
  const slice = items.slice(page * 2, page * 2 + 2);

  return (
    <section className="bg-ivory py-20">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <p className="text-center text-xs uppercase tracking-[0.22em] text-sky">{t("kicker")}</p>
          <h2 className="mt-3 text-center font-serif text-4xl">{t("title")}</h2>
        </Reveal>
        <div className="mt-12 grid items-stretch gap-6 sm:grid-cols-2">
          {slice.map((v) => (
            <VoiceCard key={v.id} item={v} />
          ))}
        </div>
        {pages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setPage((p) => (p - 1 + pages) % pages)}
              className="rounded-full px-4 py-2 text-sm text-ink ring-1 ring-ink/12 hover:bg-snow"
              aria-label={t("prev")}
            >
              <span aria-hidden className="inline-block rtl:rotate-180">
                ←
              </span>
            </button>
            <span className="text-xs text-ink-soft">
              {page + 1} / {pages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => (p + 1) % pages)}
              className="rounded-full px-4 py-2 text-sm text-ink ring-1 ring-ink/12 hover:bg-snow"
              aria-label={t("next")}
            >
              <span aria-hidden className="inline-block rtl:rotate-180">
                →
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
