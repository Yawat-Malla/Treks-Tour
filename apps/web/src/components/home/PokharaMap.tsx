"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { Trip } from "@/lib/api";

const PokharaMapCanvas = dynamic(() => import("./PokharaMapCanvas"), {
  ssr: false,
  loading: () => <div className="h-[min(70vh,520px)] animate-pulse rounded-2xl bg-ivory-deep" />,
});

export function PokharaMap({ trips }: { trips: Trip[] }) {
  const t = useTranslations("map");
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-sky">{t("kicker")}</p>
      <h2 className="mt-3 font-serif text-4xl sm:text-5xl">{t("title")}</h2>
      <p className="mt-3 max-w-xl text-sm text-ink-soft">{t("hint")}</p>
      <div className="mt-8 h-[min(70vh,520px)] overflow-hidden rounded-2xl shadow-[var(--shadow)] ring-1 ring-ink/8">
        <PokharaMapCanvas trips={trips} />
      </div>
    </div>
  );
}
