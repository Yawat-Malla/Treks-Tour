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
};

function tripName(row: TrekRow) {
  return row.translations.find((t) => t.locale === "en")?.name || row.slug;
}

export function TrekList() {
  const [rows, setRows] = useState<TrekRow[] | null>(null);
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("all");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    cmsFetch("/cms/treks").then(setRows);
  }, []);

  const searched = useMemo(() => {
    if (!rows) return [];
    return rows.filter((row) => matchesQuery(q, tripName(row), row.slug, KIND_LABEL[row.kind], row.kind));
  }, [rows, q]);

  const filtered = useMemo(() => {
    return searched.filter((row) => {
      if (kind !== "all" && row.kind !== kind) return false;
      if (status === "live" && !row.published) return false;
      if (status === "hidden" && row.published) return false;
      if (status === "home" && !row.featured) return false;
      return true;
    });
  }, [searched, kind, status]);

  if (!rows) return <p className="text-lg text-ink-soft">Loading trips…</p>;

  const kindCounts = {
    all: searched.length,
    trek: searched.filter((r) => r.kind === "trek").length,
    rafting: searched.filter((r) => r.kind === "rafting").length,
    activity: searched.filter((r) => r.kind === "activity").length,
    safari: searched.filter((r) => r.kind === "safari").length,
  };

  return (
    <div className="max-w-3xl">
      <StudioPageHeader
        title="Trips"
        hint="Treks, rafting, activities, and safaris guests can book."
        action={
          <Link href={`/${adminPath}/treks/new`} className="studio-btn studio-btn-primary">
            Add a trip
          </Link>
        }
      />
      <div className="mb-6 space-y-4">
        <StudioSearch value={q} onChange={setQ} placeholder="Find a trip by name" />
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
          ]}
        />
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
        <StudioCount shown={filtered.length} total={rows.length} word="trips" />
      </div>
      {filtered.length === 0 ? (
        <StudioEmpty>
          {q.trim() || kind !== "all" || status !== "all"
            ? "No trips match that search. Clear the box or tap All."
            : "No trips yet. Tap Add a trip."}
        </StudioEmpty>
      ) : (
        <ul className="grid gap-3">
          {filtered.map((row) => (
            <li key={row.id}>
              <div className="studio-card flex min-h-20 items-center gap-4 p-3">
                <Link href={`/${adminPath}/treks/${row.id}`} className="flex min-w-0 flex-1 items-center gap-4">
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
                      {KIND_LABEL[row.kind] || row.kind} · from ${row.priceFromUsd}
                      {row.featured ? " · homepage" : ""}
                    </span>
                  </span>
                  <StudioStatus live={row.published} />
                </Link>
                {row.published && row.slug ? (
                  <a
                    href={tripHref({ kind: row.kind as "trek" | "rafting" | "activity" | "safari", slug: row.slug })}
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
