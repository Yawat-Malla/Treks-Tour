"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { adminPath } from "@/cms/studio-nav";
import { cmsFetch } from "@/lib/cms";
import {
  matchesQuery,
  StudioCount,
  StudioEmpty,
  StudioFilters,
  StudioPageHeader,
  StudioSearch,
  StudioStatus,
} from "./studio-ui";

type Row = {
  id: string;
  slug: string;
  published: boolean;
  featured: boolean;
  translations: { locale: string; title: string }[];
};

function titleOf(row: Row) {
  return row.translations.find((t) => t.locale === "en")?.title || row.slug;
}

export function BlogList() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    cmsFetch("/cms/blog").then(setRows);
  }, []);

  const filtered = useMemo(() => {
    if (!rows) return [];
    return rows.filter((row) => {
      if (status === "live" && !row.published) return false;
      if (status === "hidden" && row.published) return false;
      if (status === "home" && !row.featured) return false;
      return matchesQuery(q, titleOf(row), row.slug);
    });
  }, [rows, q, status]);

  if (!rows) return <p className="text-lg text-ink-soft">Loading news…</p>;

  return (
    <div className="max-w-3xl">
      <StudioPageHeader
        title="News"
        hint="Stories on the blog. Guests read these after the homepage."
        action={
          <Link href={`/${adminPath}/blog/new`} className="studio-btn studio-btn-primary">
            Add a story
          </Link>
        }
      />
      <div className="mb-6 space-y-4">
        <StudioSearch value={q} onChange={setQ} placeholder="Find a story by title" />
        <StudioFilters
          label="On the website"
          value={status}
          onChange={setStatus}
          options={[
            { id: "all", label: "All", count: rows.length },
            { id: "live", label: "Live" },
            { id: "hidden", label: "Hidden" },
            { id: "home", label: "On the homepage" },
          ]}
        />
        <StudioCount shown={filtered.length} total={rows.length} word="stories" />
      </div>
      {filtered.length === 0 ? (
        <StudioEmpty>
          {q.trim() || status !== "all" ? "No stories match that search." : "No stories yet. Tap Add a story."}
        </StudioEmpty>
      ) : (
        <ul className="grid gap-3">
          {filtered.map((row) => (
            <li key={row.id}>
              <div className="studio-card flex min-h-20 items-center justify-between gap-4 p-5">
                <Link href={`/${adminPath}/blog/${row.id}`} className="min-w-0 flex-1">
                  <span className="block text-lg font-semibold text-ink">{titleOf(row)}</span>
                  {row.featured && <span className="text-[15px] text-sky">Shown on the homepage</span>}
                </Link>
                <div className="flex shrink-0 items-center gap-2">
                  <StudioStatus live={row.published} />
                  {row.published && row.slug ? (
                    <a href={`/blog/${row.slug}`} target="_blank" rel="noreferrer" className="studio-btn studio-btn-ghost px-4 text-[15px]">
                      See
                    </a>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
