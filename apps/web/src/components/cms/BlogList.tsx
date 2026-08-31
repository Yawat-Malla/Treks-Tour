"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cmsFetch } from "@/lib/cms";

const admin = process.env.NEXT_PUBLIC_ADMIN_PATH || "studio-7f3a";

type Row = {
  id: string;
  slug: string;
  published: boolean;
  featured: boolean;
  translations: { locale: string; title: string }[];
};

export function BlogList() {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    cmsFetch("/cms/blog").then(setRows);
  }, []);

  if (!rows) return <p>Loading…</p>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-4xl">Blog</h1>
        <Link href={`/${admin}/blog/new`} className="rounded-full bg-ink px-4 py-2 text-sm text-snow">
          New post
        </Link>
      </div>
      <ul className="mt-8 divide-y divide-ink/10 rounded-2xl bg-snow ring-1 ring-ink/8">
        {rows.map((row) => (
          <li key={row.id}>
            <Link href={`/${admin}/blog/${row.id}`} className="flex items-center justify-between px-5 py-4 hover:bg-ivory">
              <span>
                {row.translations.find((t) => t.locale === "en")?.title || row.slug}
                <span className="ms-2 text-xs text-ink-soft">{row.slug}</span>
              </span>
              <span className="text-xs text-ink-soft">
                {row.featured ? "Featured · " : ""}
                {row.published ? "Live" : "Hidden"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
