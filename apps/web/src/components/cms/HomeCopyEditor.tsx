"use client";

import { useEffect, useState } from "react";
import { cmsFetch } from "@/lib/cms";

const locales = ["en", "zh", "ko", "he"] as const;

type Translation = {
  locale: string;
  tagline: string;
  heroHeadline: string;
  heroSubhead: string;
  introTitle: string;
  introBody: string;
  aboutTitle: string;
  aboutBody: string;
};

export function HomeCopyEditor() {
  const [locale, setLocale] = useState<(typeof locales)[number]>("en");
  const [rows, setRows] = useState<Translation[] | null>(null);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    cmsFetch("/cms/settings").then((s) => setRows(s.translations));
  }, []);

  if (!rows) return <p>Loading…</p>;
  const current = rows.find((r) => r.locale === locale)!;

  function patch(partial: Partial<Translation>) {
    setRows((all) => all!.map((r) => (r.locale === locale ? { ...r, ...partial } : r)));
  }

  async function save() {
    await cmsFetch("/cms/settings", { method: "PATCH", body: JSON.stringify({ translations: rows }) });
    setSaved("Saved. The public site will refresh within a minute.");
  }

  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="font-serif text-4xl">Home & about copy</h1>
      <div className="flex gap-2">
        {locales.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            className={`rounded-full px-3 py-1 text-sm ${locale === l ? "bg-moss text-snow" : "bg-snow"}`}
          >
            {l}
          </button>
        ))}
      </div>
      {(
        [
          ["tagline", "Tagline"],
          ["heroHeadline", "Hero headline"],
          ["heroSubhead", "Hero subhead"],
          ["introTitle", "Intro title"],
          ["introBody", "Intro body"],
          ["aboutTitle", "About title"],
          ["aboutBody", "About body"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="block">
          <span className="text-sm text-ink-soft">{label}</span>
          {key.includes("Body") || key.includes("head") || key.includes("Headline") ? (
            <textarea
              rows={key.includes("Body") ? 6 : 3}
              className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3"
              value={current[key]}
              onChange={(e) => patch({ [key]: e.target.value })}
            />
          ) : (
            <input
              className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3"
              value={current[key]}
              onChange={(e) => patch({ [key]: e.target.value })}
            />
          )}
        </label>
      ))}
      <button type="button" onClick={save} className="rounded-full bg-copper px-6 py-2.5 text-snow">
        Save copy
      </button>
      {saved && <p className="text-sm text-moss">{saved}</p>}
    </div>
  );
}
