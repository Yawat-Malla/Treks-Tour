"use client";

import { useRouter } from "@/i18n/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { Trip } from "@/lib/api";
import { tripHref } from "@/lib/api";
import { KindMark, type KindId } from "@/components/ui/KindMarks";
import { MapPin, Calendar, Users, Search } from "lucide-react";

type Kind = Trip["kind"];

const glass =
  "bg-snow/92 text-ink shadow-[0_18px_50px_rgba(11,31,58,0.28)] ring-1 ring-snow/40 backdrop-blur-md";

export function HomeBookBar({ trips }: { trips: Trip[] }) {
  const t = useTranslations("bookBar");
  const tb = useTranslations("book");
  const router = useRouter();
  const [kind, setKind] = useState<Kind>("trek");
  const pool = useMemo(() => trips.filter((x) => x.kind === kind), [trips, kind]);
  const [slug, setSlug] = useState(pool[0]?.slug || "");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState(2);
  const selected = useMemo(() => trips.find((x) => x.slug === slug), [trips, slug]);
  const name = selected?.name || "";
  const [typed, setTyped] = useState(name);
  const [caret, setCaret] = useState(false);
  const [halted, setHalted] = useState(false);

  function haltTypewriter() {
    setHalted(true);
    setCaret(false);
    setTyped(selected?.name || name);
  }

  useEffect(() => {
    if (halted) {
      setTyped(selected?.name || name);
      setCaret(false);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(name);
      setCaret(false);
      return;
    }

    const list = pool.length > 0 ? pool : trips;
    if (list.length === 0) return;

    setCaret(true);
    let isCancelled = false;
    let timeoutId: number | undefined;

    let currentIdx = list.findIndex((x) => x.slug === slug);
    if (currentIdx === -1) currentIdx = 0;

    let charIdx = 0;
    let isDeleting = false;

    function step() {
      if (isCancelled) return;

      const currentTrip = list[currentIdx % list.length];
      const targetText = currentTrip?.name || "";

      if (!isDeleting) {
        charIdx += 1;
        const nextText = targetText.slice(0, charIdx);
        setTyped(nextText);
        setSlug(currentTrip.slug);

        if (charIdx >= targetText.length) {
          isDeleting = true;
          timeoutId = window.setTimeout(step, 2200);
          return;
        }
        timeoutId = window.setTimeout(step, 65);
      } else {
        charIdx -= 1;
        const nextText = targetText.slice(0, Math.max(0, charIdx));
        setTyped(nextText);

        if (charIdx <= 0) {
          isDeleting = false;
          currentIdx = (currentIdx + 1) % list.length;
          timeoutId = window.setTimeout(step, 350);
          return;
        }
        timeoutId = window.setTimeout(step, 32);
      }
    }

    timeoutId = window.setTimeout(step, 200);

    return () => {
      isCancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [halted, pool, trips]);

  function pickTrip(next: string) {
    const trip = trips.find((x) => x.slug === next);
    if (!trip) return;
    setSlug(trip.slug);
    setKind(trip.kind);
  }

  function chooseKind(next: Kind) {
    setKind(next);
    const current = trips.find((x) => x.slug === slug);
    if (current?.kind === next) return;
    const first = trips.find((x) => x.kind === next);
    setSlug(first?.slug || "");
  }

  function search(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    router.push(tripHref(selected));
  }

  function go(e: React.FormEvent) {
    e.preventDefault();
    if (!slug || !date) return;
    router.push(`/book?trip=${slug}&kind=${kind}&date=${date}&people=${people}`);
  }

  const kinds: { id: KindId; label: string }[] = [
    { id: "trek", label: t("trek") },
    { id: "rafting", label: t("raft") },
    { id: "activity", label: t("activity") },
    { id: "safari", label: t("safari") },
  ];

  const field =
    "mt-1 w-full rounded-xl border-0 bg-ivory px-3 py-2.5 text-sm text-ink outline-none ring-1 ring-ink/8 focus:ring-2 focus:ring-sky/40";

  return (
    <div className="flex w-full flex-col gap-4">
      <form
        id="search"
        onSubmit={search}
        className={`flex w-full items-center gap-2 rounded-full p-1.5 ps-5 text-start ${glass}`}
      >
        <Search className="h-4 w-4 shrink-0 text-ink-soft" aria-hidden />
        <label className="sr-only" htmlFor="hero-search-trip">
          {t("trip")}
        </label>
        <div className="relative min-w-0 flex-1">
          <select
            id="hero-search-trip"
            className={`w-full min-w-0 bg-transparent py-2 text-sm outline-none ${
              halted ? "text-ink" : "text-transparent"
            }`}
            value={slug}
            onMouseDown={haltTypewriter}
            onFocus={haltTypewriter}
            onChange={(e) => {
              haltTypewriter();
              pickTrip(e.target.value);
            }}
          >
            {trips.map((tr) => (
              <option key={tr.id} value={tr.slug} className="text-ink">
                {tr.name}
              </option>
            ))}
          </select>
          {!halted && (
            <span
              className="pointer-events-none absolute inset-0 flex items-center overflow-hidden text-start text-sm text-ink"
              aria-hidden
            >
              <span className="truncate">
                {typed}
                {caret && <span className="typewriter-caret" />}
              </span>
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={!slug}
          className="shrink-0 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-snow hover:bg-moss-deep disabled:opacity-40"
        >
          {t("search")}
        </button>
      </form>

      <form onSubmit={go} className={`w-full rounded-[1.75rem] p-4 text-start sm:p-5 ${glass}`}>
        <div className="flex flex-wrap gap-1.5">
          {kinds.map(({ id, label }) => {
            const on = kind === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => chooseKind(id)}
                className={`inline-flex items-center gap-2 rounded-full py-1 pe-3 ps-1 text-xs font-medium transition sm:text-sm ${
                  on ? "bg-ink text-snow" : "bg-transparent text-ink-soft ring-1 ring-ink/12 hover:bg-ivory"
                }`}
              >
                <span
                  className={`grid h-7 w-7 place-items-center rounded-full ${
                    on ? "bg-river text-snow" : "bg-ivory text-river ring-1 ring-ink/8"
                  }`}
                >
                  <KindMark kind={id} className="h-4 w-4" />
                </span>
                {label}
              </button>
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-[1.5fr_1fr_0.55fr_auto] md:items-end">
          <label className="col-span-2 block min-w-0 md:col-span-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-soft">
              <MapPin className="h-3.5 w-3.5 text-sky" />
              {t("trip")}
            </span>
            <select className={field} value={slug} onChange={(e) => pickTrip(e.target.value)}>
              {pool.map((tr) => (
                <option key={tr.id} value={tr.slug}>
                  {tr.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-soft">
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
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-soft">
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
            className="col-span-2 w-full rounded-full bg-ink px-7 py-2.5 text-sm font-medium text-snow hover:bg-moss-deep disabled:opacity-40 md:col-span-1 md:w-auto md:self-end"
          >
            {t("continue")}
          </button>
        </div>
      </form>
    </div>
  );
}
