"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_ASSOCIATIONS,
  DEFAULT_CHIPS,
  PAGE_CATALOG,
  type AssociationLogo,
  type ChipCard,
  type CopyGroup,
} from "@/cms/page-catalog";
import { type StudioLocale } from "@/cms/studio-nav";
import { cmsFetch } from "@/lib/cms";
import {
  matchesQuery,
  StudioCard,
  StudioField,
  StudioLocaleTabs,
  StudioPageHeader,
  StudioSaveBar,
  StudioSearch,
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

function mergeRow(tr: Translation): Translation {
  const pages = {
    tagline: tr.tagline,
    "hero.headline": tr.heroHeadline,
    "hero.lede": tr.heroSubhead,
    "intro.title": tr.introTitle,
    "intro.body": tr.introBody,
    "about.title": tr.aboutTitle,
    "about.body": tr.aboutBody,
    ...asPages(tr.pages),
  };
  return { ...tr, pages };
}

function chipsFrom(value: unknown): ChipCard[] {
  return Array.isArray(value) && value.length ? (value as ChipCard[]) : DEFAULT_CHIPS;
}

function logosFrom(value: unknown): AssociationLogo[] {
  return Array.isArray(value) && value.length ? (value as AssociationLogo[]) : DEFAULT_ASSOCIATIONS;
}

function chipName(chip: ChipCard) {
  return chip.id.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

export function PagesEditor() {
  const [locale, setLocale] = useState<StudioLocale>("en");
  const [groupId, setGroupId] = useState(PAGE_CATALOG[0].id);
  const [rows, setRows] = useState<Translation[] | null>(null);
  const [heroPosterUrl, setHeroPosterUrl] = useState<string | null>(null);
  const [heroVideoUrl, setHeroVideoUrl] = useState<string | null>(null);
  const [aboutHeroUrl, setAboutHeroUrl] = useState<string | null>(null);
  const [associations, setAssociations] = useState<AssociationLogo[]>(DEFAULT_ASSOCIATIONS);
  const [chips, setChips] = useState<ChipCard[]>(DEFAULT_CHIPS);
  const [saved, setSaved] = useState("");
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");
  const [highlightKey, setHighlightKey] = useState("");

  useEffect(() => {
    cmsFetch("/cms/settings").then((s) => {
      setRows(
        locales.map((l) => {
          const found = s.translations.find((t: Translation) => t.locale === l);
          return mergeRow(
            found || {
              locale: l,
              tagline: "",
              heroHeadline: "",
              heroSubhead: "",
              introTitle: "",
              introBody: "",
              aboutTitle: "",
              aboutBody: "",
              pages: {},
            },
          );
        }),
      );
      setHeroPosterUrl(s.heroPosterUrl ?? null);
      setHeroVideoUrl(s.heroVideoUrl ?? null);
      setAboutHeroUrl(s.aboutHeroUrl ?? null);
      setAssociations(logosFrom(s.associations));
      setChips(chipsFrom(s.chips));
    });
  }, []);

  useEffect(() => {
    const section = new URLSearchParams(window.location.search).get("section");
    if (section && PAGE_CATALOG.some((g) => g.id === section)) setGroupId(section);
  }, []);

  useEffect(() => {
    if (!highlightKey) return;
    const el = document.getElementById(`studio-field-${highlightKey}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightKey, groupId]);

  if (!rows) return <p className="text-lg text-ink-soft">Loading website words…</p>;
  const current = rows.find((r) => r.locale === locale)!;
  const group = PAGE_CATALOG.find((g) => g.id === groupId) as CopyGroup;
  const translations = rows;
  const hits = q.trim()
    ? PAGE_CATALOG.flatMap((g) =>
        g.fields
          .filter((f) => matchesQuery(q, g.label, g.help, f.label, f.help, current.pages[f.key]))
          .map((f) => ({ group: g, field: f })),
      ).slice(0, 8)
    : [];

  function patchPage(key: string, value: string) {
    setRows((all) =>
      all!.map((r) => (r.locale === locale ? { ...r, pages: { ...r.pages, [key]: value } } : r)),
    );
  }

  async function save() {
    setBusy(true);
    setSaved("");
    const payload = translations.map((r) => {
      const pages = r.pages;
      return {
        locale: r.locale,
        tagline: pages.tagline ?? r.tagline,
        heroHeadline: pages["hero.headline"] ?? r.heroHeadline,
        heroSubhead: pages["hero.lede"] ?? r.heroSubhead,
        introTitle: pages["intro.title"] ?? r.introTitle,
        introBody: pages["intro.body"] ?? r.introBody,
        aboutTitle: pages["about.title"] ?? r.aboutTitle,
        aboutBody: pages["about.body"] ?? r.aboutBody,
        pages,
      };
    });
    await cmsFetch("/cms/settings", {
      method: "PATCH",
      body: JSON.stringify({
        heroPosterUrl,
        heroVideoUrl,
        aboutHeroUrl,
        associations,
        chips,
        translations: payload,
      }),
    });
    setBusy(false);
    setSaved("Saved just now. Guests will see this on the website.");
  }

  return (
    <div className="max-w-5xl">
      <StudioPageHeader
        title="Website words & photos"
        hint="Pick one page on the left. Change the words. Press Save changes at the bottom — it stays on screen as you scroll."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <StudioViewSite href="/" />
            <StudioLocaleTabs value={locale} onChange={setLocale} />
          </div>
        }
      />

      <div className="mb-6 max-w-xl">
        <StudioSearch value={q} onChange={setQ} placeholder="Find a title or a sentence — try WhatsApp or About" />
        {q.trim() && (
          <ul className="studio-card mt-2 p-2">
            {hits.length === 0 && <li className="px-4 py-3 text-base text-ink-soft">Nothing matches that search.</li>}
            {hits.map((hit) => (
              <li key={`${hit.group.id}-${hit.field.key}`}>
                <button
                  type="button"
                  className="block w-full min-h-12 rounded-xl px-4 py-3 text-start hover:bg-sky/10"
                  onClick={() => {
                    setGroupId(hit.group.id);
                    setHighlightKey(hit.field.key);
                    setQ("");
                  }}
                >
                  <span className="block text-base font-semibold text-ink">{hit.field.label}</span>
                  <span className="block text-[15px] text-ink-soft">{hit.group.label}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex flex-col gap-1 lg:sticky lg:top-6 lg:self-start">
          {PAGE_CATALOG.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGroupId(g.id)}
                className={`min-h-12 rounded-2xl px-4 py-3 text-start text-base font-medium ${
                  groupId === g.id ? "bg-sky text-white" : "bg-white text-ink hover:bg-sky/10"
                } ${q.trim() && hits.some((h) => h.group.id === g.id) && groupId !== g.id ? "ring-2 ring-gold" : ""}`}
            >
              {g.label}
            </button>
          ))}
        </nav>

        <div className="space-y-6">
          <p className="text-base text-ink-soft">{group.help}</p>

          {groupId === "home" && (
            <StudioCard className="space-y-5">
              <h2 className="font-serif text-2xl">Photos at the top of the homepage</h2>
              <StudioUpload
                label="Big background photo"
                help="Shown behind the title. Use a wide landscape picture."
                preview={heroPosterUrl}
                onUrl={setHeroPosterUrl}
              />
              <StudioUpload
                label="Optional video"
                help="Plays over the photo if you add one. Leave empty to keep the photo only."
                accept="video/*"
                preview={heroVideoUrl}
                onUrl={setHeroVideoUrl}
              />
              <div>
                <p className="text-base font-semibold text-ink">Partner logos</p>
                <p className="mt-0.5 text-[15px] text-ink-soft">The row of badges near the bottom of the homepage.</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {associations.map((logo, i) => (
                    <div key={i} className="rounded-2xl bg-[#F4F8FF] p-4">
                      <StudioField label="What this logo is" help="Read aloud for people who cannot see the picture.">
                        <input
                          className="studio-input"
                          value={logo.alt}
                          onChange={(e) =>
                            setAssociations((all) => all.map((row, idx) => (idx === i ? { ...row, alt: e.target.value } : row)))
                          }
                        />
                      </StudioField>
                      <div className="mt-3">
                        <StudioUpload
                          label="Logo picture"
                          preview={logo.url}
                          onUrl={(url) =>
                            setAssociations((all) => all.map((row, idx) => (idx === i ? { ...row, url } : row)))
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </StudioCard>
          )}

          {groupId === "about" && (
            <StudioCard>
              <StudioUpload
                label="Photo at the top of About"
                help="Same picture in every language."
                preview={aboutHeroUrl}
                onUrl={setAboutHeroUrl}
              />
            </StudioCard>
          )}

          {groupId === "chips" && (
            <StudioCard className="space-y-4">
              <h2 className="font-serif text-2xl">Sliding photo cards</h2>
              <p className="text-[15px] text-ink-soft">
                Names of the cards are the fields below. Pictures and trip counts are the same in every language.
              </p>
              <div className="grid gap-4">
                {chips.map((chip, i) => (
                  <div key={chip.id} className="grid gap-4 rounded-2xl bg-[#F4F8FF] p-4 sm:grid-cols-[1fr_8rem]">
                    <div>
                      <p className="text-lg font-semibold text-ink">{chipName(chip)}</p>
                      <StudioField label="How many trips" help="The number on the card.">
                        <input
                          type="number"
                          className="studio-input"
                          value={chip.count}
                          onChange={(e) =>
                            setChips((all) => all.map((row, idx) => (idx === i ? { ...row, count: Number(e.target.value) } : row)))
                          }
                        />
                      </StudioField>
                    </div>
                    <StudioUpload
                      label="Card photo"
                      preview={chip.image}
                      onUrl={(url) =>
                        setChips((all) => all.map((row, idx) => (idx === i ? { ...row, image: url } : row)))
                      }
                    />
                  </div>
                ))}
              </div>
            </StudioCard>
          )}

          {group.fields.map((field) => (
            <div
              key={field.key}
              id={`studio-field-${field.key}`}
              className={highlightKey === field.key ? "rounded-2xl ring-2 ring-sky p-3" : ""}
            >
              <StudioField label={field.label} help={field.help}>
                {field.kind === "long" ? (
                  <textarea
                    rows={field.key.includes("privacy") || field.key.includes("terms") || field.key.includes("body") ? 8 : 4}
                    className="studio-input"
                    value={current.pages[field.key] ?? ""}
                    onChange={(e) => patchPage(field.key, e.target.value)}
                  />
                ) : (
                  <input
                    className="studio-input"
                    value={current.pages[field.key] ?? ""}
                    onChange={(e) => patchPage(field.key, e.target.value)}
                  />
                )}
              </StudioField>
            </div>
          ))}

          <StudioSaveBar onSave={save} busy={busy} saved={saved} />
        </div>
      </div>
    </div>
  );
}
