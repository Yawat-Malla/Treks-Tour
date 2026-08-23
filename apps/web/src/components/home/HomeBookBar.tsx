"use client";

import { useRouter } from "@/i18n/navigation";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { Trip } from "@/lib/api";
import { Mountain, Waves, MapPin, Calendar, Users } from "lucide-react";

export function HomeBookBar({ trips }: { trips: Trip[] }) {
  const t = useTranslations("bookBar");
  const tb = useTranslations("book");
  const router = useRouter();
  const [kind, setKind] = useState<"trek" | "rafting">("trek");
  const pool = useMemo(() => trips.filter((x) => x.kind === kind), [trips, kind]);
  const [slug, setSlug] = useState(pool[0]?.slug || "");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState(2);

  function chooseKind(next: "trek" | "rafting") {
    setKind(next);
    const first = trips.find((x) => x.kind === next);
    setSlug(first?.slug || "");
  }

  function go(e: React.FormEvent) {
    e.preventDefault();
    if (!slug || !date) return;
    router.push(`/book?trip=${slug}&kind=${kind}&date=${date}&people=${people}`);
  }

  return (
    <div className="relative z-30 mx-auto -mt-12 max-w-6xl px-5 lg:-mt-16 lg:px-8">
      <form onSubmit={go} className="rounded-2xl bg-snow p-4 shadow-[var(--shadow)] ring-1 ring-ink/8 sm:p-5">
        <div className="mb-4 flex gap-2">
          {(["trek", "rafting"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => chooseKind(k)}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm ${
                kind === k ? "bg-moss text-snow" : "bg-ivory text-ink-soft"
              }`}
            >
              {k === "trek" ? <Mountain className="h-4 w-4" /> : <Waves className="h-4 w-4" />}
              {k === "trek" ? t("trek") : t("raft")}
            </button>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_0.7fr_auto] md:items-end">
          <label className="block">
            <span className="inline-flex items-center gap-1.5 text-xs text-ink-soft">
              <MapPin className="h-3.5 w-3.5 text-sky" />
              {t("trip")}
            </span>
            <select
              className="mt-1 w-full rounded-2xl border border-ink/10 bg-ivory px-4 py-3 text-sm"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            >
              {pool.map((tr) => (
                <option key={tr.id} value={tr.slug}>
                  {tr.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="inline-flex items-center gap-1.5 text-xs text-ink-soft">
              <Calendar className="h-3.5 w-3.5 text-sky" />
              {tb("start")}
            </span>
            <input
              type="date"
              required
              className="mt-1 w-full rounded-2xl border border-ink/10 bg-ivory px-4 py-3 text-sm"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="inline-flex items-center gap-1.5 text-xs text-ink-soft">
              <Users className="h-3.5 w-3.5 text-sky" />
              {tb("group")}
            </span>
            <input
              type="number"
              min={1}
              max={20}
              className="mt-1 w-full rounded-2xl border border-ink/10 bg-ivory px-4 py-3 text-sm"
              value={people}
              onChange={(e) => setPeople(Number(e.target.value))}
            />
          </label>
          <button
            type="submit"
            disabled={!date || !slug}
            className="w-full rounded-2xl bg-ink px-8 py-3 text-sm font-medium text-snow hover:bg-moss-deep disabled:opacity-40 md:w-auto"
          >
            {t("continue")}
          </button>
        </div>
      </form>
    </div>
  );
}
