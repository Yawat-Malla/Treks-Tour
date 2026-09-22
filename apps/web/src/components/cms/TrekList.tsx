"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { adminPath } from "@/cms/studio-nav";
import { cmsFetch } from "@/lib/cms";
import { tripHref } from "@/lib/api";
import {
  matchesQuery,
  StudioCount,
  StudioEmpty,
  StudioFilters,
  StudioPageHeader,
  StudioSearch,
  StudioStatus,
} from "./studio-ui";
import { RidesChrome } from "./RidesChrome";

type TrekRow = {
  id: string;
  slug: string;
  kind: string;
  published: boolean;
  featured: boolean;
  priceFromUsd: number;
  heroImageUrl?: string | null;
  translations: { locale: string; name: string }[];
};

const KIND_LABEL: Record<string, string> = {
  trek: "Trek",
  rafting: "Rafting",
  activity: "Activity",
  safari: "Safari",
  ride: "Ride",
};

function tripName(row: TrekRow) {
  return row.translations.find((t) => t.locale === "en")?.name || row.slug;
}

export function TrekList({ forceKind }: { forceKind?: "ride" } = {}) {
  const ridesOnly = forceKind === "ride";
  const basePath = ridesOnly ? "rides" : "treks";
  const [rows, setRows] = useState<TrekRow[] | null>(null);
  const [q, setQ] = useState("");
  const [kind, setKind] = useState(ridesOnly ? "ride" : "all");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    cmsFetch("/cms/treks").then(setRows);
  }, []);

  const searched = useMemo(() => {
    if (!rows) return [];
    const pool = ridesOnly ? rows.filter((r) => r.kind === "ride") : rows;
    return pool.filter((row) => matchesQuery(q, tripName(row), row.slug, KIND_LABEL[row.kind], row.kind));
  }, [rows, q, ridesOnly]);

  const filtered = useMemo(() => {
    return searched.filter((row) => {
      if (!ridesOnly && kind !== "all" && row.kind !== kind) return false;
      if (status === "live" && !row.published) return false;
      if (status === "hidden" && row.published) return false;
      if (status === "home" && !row.featured) return false;
      return true;
    });
  }, [searched, kind, status, ridesOnly]);

  if (!rows) return <p className="text-lg text-ink-soft">{ridesOnly ? "Loading rides…" : "Loading trips…"}</p>;

  const kindCounts = {
    all: searched.length,
    trek: searched.filter((r) => r.kind === "trek").length,
    rafting: searched.filter((r) => r.kind === "rafting").length,
    activity: searched.filter((r) => r.kind === "activity").length,
    safari: searched.filter((r) => r.kind === "safari").length,
    ride: searched.filter((r) => r.kind === "ride").length,
  };

  const totalPool = ridesOnly ? rows.filter((r) => r.kind === "ride").length : rows.length;

  return (
    <div className="max-w-3xl">
      <StudioPageHeader
        title={ridesOnly ? "Rides" : "Trips"}
        hint={
          ridesOnly
            ? "Motorcycle packages guests can book, plus the /rides page banner and words."
            : "All trip kinds — treks, rafting, activities, and safaris. Motorcycle rides live under Rides."
        }
        action={
          <Link href={`/${adminPath}/${basePath}/new`} className="studio-btn studio-btn-primary">
            {ridesOnly ? "New ride" : "Add a trip"}
          </Link>
        }
      />
      {ridesOnly ? <RidesChrome /> : null}
      <div className="mb-6 space-y-4">
        <StudioSearch value={q} onChange={setQ} placeholder={ridesOnly ? "Find a ride by name" : "Find a trip by name"} />
        {!ridesOnly && (
          <StudioFilters
            label="Kind of trip"
            value={kind}
            onChange={setKind}
            options={[
              { id: "all", label: "All", count: kindCounts.all },
              { id: "trek", label: "Treks", count: kindCounts.trek },
              { id: "rafting", label: "Rafting", count: kindCounts.rafting },
              { id: "activity", label: "Activities", count: kindCounts.activity },
              { id: "safari", label: "Safaris", count: kindCounts.safari },
              { id: "ride", label: "Rides", count: kindCounts.ride },
            ]}
          />
        )}
        <StudioFilters
          label="On the website"
          value={status}
          onChange={setStatus}
          options={[
            { id: "all", label: "All" },
            { id: "live", label: "Live" },
            { id: "hidden", label: "Hidden" },
            { id: "home", label: "On the homepage" },
          ]}
        />
        <StudioCount shown={filtered.length} total={totalPool} word={ridesOnly ? "rides" : "trips"} />
      </div>
      {filtered.length === 0 ? (
        <StudioEmpty>
          {q.trim() || (!ridesOnly && kind !== "all") || status !== "all"
            ? ridesOnly
              ? "No rides match that search. Clear the box or tap All."
              : "No trips match that search. Clear the box or tap All."
            : ridesOnly
              ? "No rides yet. Tap New ride."
              : "No trips yet. Tap Add a trip."}
        </StudioEmpty>
      ) : (
        <ul className="grid gap-3">
          {filtered.map((row) => (
            <li key={row.id}>
              <div className="studio-card flex min-h-20 items-center gap-4 p-3">
                <Link href={`/${adminPath}/${basePath}/${row.id}`} className="flex min-w-0 flex-1 items-center gap-4">
                  {row.heroImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={row.heroImageUrl} alt="" className="h-16 w-20 shrink-0 rounded-xl object-cover" />
                  ) : (
                    <span className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl bg-sky/10 text-sm text-sky">
                      No photo
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-lg font-semibold text-ink">{tripName(row)}</span>
                    <span className="text-[15px] text-ink-soft">
                      {ridesOnly ? "Ride" : KIND_LABEL[row.kind] || row.kind} · from ${row.priceFromUsd}
                      {row.featured ? " · homepage" : ""}
                    </span>
                  </span>
                  <StudioStatus live={row.published} />
                </Link>
                {row.published && row.slug ? (
                  <a
                    href={tripHref({ kind: row.kind as "trek" | "rafting" | "activity" | "safari" | "ride", slug: row.slug })}
                    target="_blank"
                    rel="noreferrer"
                    className="studio-btn studio-btn-ghost shrink-0 px-4 text-[15px]"
                  >
                    See
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
