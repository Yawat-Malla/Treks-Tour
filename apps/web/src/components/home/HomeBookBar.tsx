"use client";

import { useRouter } from "@/i18n/navigation";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { Trip } from "@/lib/api";
import { Mountain, Waves, Zap, Trees, MapPin, Calendar, Users } from "lucide-react";

type Kind = Trip["kind"];

export function HomeBookBar({ trips }: { trips: Trip[] }) {
  const t = useTranslations("bookBar");
  const tb = useTranslations("book");
  const router = useRouter();
  const [kind, setKind] = useState<Kind>("trek");
  const pool = useMemo(() => trips.filter((x) => x.kind === kind), [trips, kind]);
  const [slug, setSlug] = useState(pool[0]?.slug || "");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState(2);

  function chooseKind(next: Kind) {
    setKind(next);
    const first = trips.find((x) => x.kind === next);
    setSlug(first?.slug || "");
  }

  function go(e: React.FormEvent) {
    e.preventDefault();
    if (!slug || !date) return;
    router.push(`/book?trip=${slug}&kind=${kind}&date=${date}&people=${people}`);
  }

  const field =
    "mt-1 w-full rounded-xl border border-ink/10 bg-ivory px-3 py-2 text-sm md:px-3.5";

  const kinds: { id: Kind; label: string; icon: typeof Mountain }[] = [
    { id: "trek", label: t("trek"), icon: Mountain },
    { id: "rafting", label: t("raft"), icon: Waves },
    { id: "activity", label: t("activity"), icon: Zap },
    { id: "safari", label: t("safari"), icon: Trees },
  ];

  return (
    <form
      onSubmit={go}
      className="rounded-2xl bg-snow/80 p-3 text-start text-ink shadow-[var(--shadow)] ring-1 ring-ink/8 backdrop-blur-md sm:p-3.5"
    >
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-[auto_1.4fr_1fr_0.55fr_auto] md:items-end md:gap-3">
        <div className="col-span-2 flex flex-wrap gap-1.5 md:col-span-1 md:pb-0.5">
          {kinds.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => chooseKind(id)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-medium sm:text-sm ${
                kind === id ? "bg-moss text-snow" : "bg-ivory text-ink-soft"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
        <label className="col-span-2 block min-w-0 md:col-span-1">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-ink-soft">
            <MapPin className="h-3.5 w-3.5 text-sky" />
            {t("trip")}
          </span>
          <select className={field} value={slug} onChange={(e) => setSlug(e.target.value)}>
            {pool.map((tr) => (
              <option key={tr.id} value={tr.slug}>
                {tr.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-ink-soft">
            <Calendar className="h-3.5 w-3.5 text-sky" />
            {tb("start")}
          </span>
          <input
            type="date"
            required
            className={field}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-ink-soft">
            <Users className="h-3.5 w-3.5 text-sky" />
            {tb("group")}
          </span>
          <input
            type="number"
            min={1}
            max={20}
            className={field}
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
          />
        </label>
        <button
          type="submit"
          disabled={!date || !slug}
          className="col-span-2 w-full rounded-xl bg-ink px-6 py-2.5 text-sm font-medium text-snow hover:bg-moss-deep disabled:opacity-40 md:col-span-1 md:w-auto"
        >
          {t("continue")}
        </button>
      </div>
    </form>
  );
}
