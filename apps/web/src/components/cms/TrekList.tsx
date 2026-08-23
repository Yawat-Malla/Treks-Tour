"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cmsFetch } from "@/lib/cms";

const admin = process.env.NEXT_PUBLIC_ADMIN_PATH || "studio-7f3a";

type TrekRow = {
  id: string;
  slug: string;
  kind: string;
  published: boolean;
  featured: boolean;
  priceFromUsd: number;
  translations: { locale: string; name: string }[];
};

export function TrekList() {
  const [rows, setRows] = useState<TrekRow[] | null>(null);

  useEffect(() => {
    cmsFetch("/cms/treks").then(setRows);
  }, []);

  if (!rows) return <p>Loading…</p>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-4xl">Trips</h1>
        <Link href={`/${admin}/treks/new`} className="rounded-full bg-copper px-4 py-2 text-sm text-snow">
          New trip
        </Link>
      </div>
      <ul className="mt-8 divide-y divide-ink/10 rounded-2xl bg-snow ring-1 ring-ink/8">
        {rows.map((row) => (
          <li key={row.id}>
            <Link href={`/${admin}/treks/${row.id}`} className="flex items-center justify-between px-5 py-4 hover:bg-ivory">
              <span>
                {row.translations.find((t) => t.locale === "en")?.name || row.slug}
                <span className="ms-2 text-xs text-ink-soft">{row.slug}</span>
              </span>
              <span className="text-xs text-ink-soft">
                {row.kind} · {row.published ? "Live" : "Hidden"} · ${row.priceFromUsd}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
