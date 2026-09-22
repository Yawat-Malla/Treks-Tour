"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminPath, type StudioLocale } from "@/cms/studio-nav";
import { cmsFetch } from "@/lib/cms";
import {
  StudioCard,
  StudioField,
  StudioLocaleTabs,
  StudioSaveBar,
  StudioUpload,
  StudioViewSite,
} from "./studio-ui";

const locales = ["en", "zh", "ko", "he"] as const;

type Translation = {
  locale: (typeof locales)[number];
  tagline: string;
  heroHeadline: string;
  heroSubhead: string;
  introTitle: string;
  introBody: string;
  aboutTitle: string;
  aboutBody: string;
  pages: Record<string, string>;
};

function asPages(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).filter(([, v]) => typeof v === "string") as [string, string][],
  );
}

const LISTING_KEYS = ["featured.rideKicker", "featured.rideTitle", "featured.rideLede"] as const;
const LISTING_LABELS: Record<(typeof LISTING_KEYS)[number], string> = {
  "featured.rideKicker": "Small line above the title",
  "featured.rideTitle": "Big title on /rides",
  "featured.rideLede": "Intro under the title",
};

/** Listing hero photo + /rides words — stays on Rides so editors are not hunting in Website words. */
export function RidesChrome() {
  const [locale, setLocale] = useState<StudioLocale>("en");
  const [rows, setRows] = useState<Translation[] | null>(null);
  const [ridesHeroUrl, setRidesHeroUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    cmsFetch("/cms/settings").then((s) => {
      setRidesHeroUrl(s.ridesHeroUrl ?? null);
      setRows(
        locales.map((l) => {
          const found = s.translations.find((t: Translation) => t.locale === l);
          return {
            locale: l,
            tagline: found?.tagline ?? "",
            heroHeadline: found?.heroHeadline ?? "",
            heroSubhead: found?.heroSubhead ?? "",
            introTitle: found?.introTitle ?? "",
            introBody: found?.introBody ?? "",
            aboutTitle: found?.aboutTitle ?? "",
            aboutBody: found?.aboutBody ?? "",
            pages: asPages(found?.pages),
          };
        }),
      );
    });
  }, []);

  const row = rows?.find((r) => r.locale === locale);

  function setPage(key: string, value: string) {
    setRows((prev) =>
      prev
        ? prev.map((r) => (r.locale === locale ? { ...r, pages: { ...r.pages, [key]: value } } : r))
        : prev,
    );
  }

  async function save() {
    if (!rows) return;
    setBusy(true);
    setSaved("");
    await cmsFetch("/cms/settings", {
      method: "PATCH",
      body: JSON.stringify({
        ridesHeroUrl,
        translations: rows.map((r) => ({
          locale: r.locale,
          tagline: r.tagline,
          heroHeadline: r.heroHeadline,
          heroSubhead: r.heroSubhead,
          introTitle: r.introTitle,
          introBody: r.introBody,
          aboutTitle: r.aboutTitle,
          aboutBody: r.aboutBody,
          pages: r.pages,
        })),
      }),
    });
    setBusy(false);
    setSaved("Saved. Guests see this on /rides.");
  }

  if (!rows || !row) {
    return (
      <StudioCard className="mb-8">
        <p className="text-[15px] text-ink-soft">Loading rides page…</p>
      </StudioCard>
    );
  }

  return (
    <StudioCard className="mb-8 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl">Rides page</h2>
          <p className="mt-1 text-[15px] text-ink-soft">
            Banner photo and words on /rides — separate from any single ride’s gallery.
          </p>
        </div>
        <StudioViewSite href="/rides" />
      </div>
      <StudioUpload
        label="Listing banner photo"
        help="Shown at the top of /rides. If empty, the first ride’s photo is used."
        preview={ridesHeroUrl}
        onUrl={(url) => setRidesHeroUrl(url)}
      />
      <StudioLocaleTabs value={locale} onChange={setLocale} />
      {LISTING_KEYS.map((key) => (
        <StudioField key={key} label={LISTING_LABELS[key]}>
          {key.endsWith("Lede") ? (
            <textarea
              className="studio-input"
              rows={3}
              value={row.pages[key] ?? ""}
              onChange={(e) => setPage(key, e.target.value)}
            />
          ) : (
            <input
              className="studio-input"
              value={row.pages[key] ?? ""}
              onChange={(e) => setPage(key, e.target.value)}
            />
          )}
        </StudioField>
      ))}
      <p className="text-[15px] text-ink-soft">
        Homepage ride band words and Plan-page ride copy live under{" "}
        <Link href={`/${adminPath}/pages`} className="text-sky underline-offset-2 hover:underline">
          Website words & photos → Rides page
        </Link>
        .
      </p>
      <StudioSaveBar onSave={save} busy={busy} saved={saved} />
    </StudioCard>
  );
}
