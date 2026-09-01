"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminPath, type StudioLocale } from "@/cms/studio-nav";
import { cmsFetch, uploadFile } from "@/lib/cms";
import { tripHref } from "@/lib/api";
import {
  StudioCard,
  StudioCheck,
  StudioField,
  StudioLocaleTabs,
  StudioPageHeader,
  StudioSaveBar,
  StudioUpload,
  StudioViewSite,
} from "./studio-ui";

const locales = ["en", "zh", "ko", "he"] as const;

type Itin = { day: number; title: string; body: string };
type Tr = {
  locale: (typeof locales)[number];
  name: string;
  summary: string;
  description: string;
  itinerary: Itin[];
  seasonLabel: string;
  difficultyLabel: string;
};

const emptyTr = (locale: (typeof locales)[number]): Tr => ({
  locale,
  name: "",
  summary: "",
  description: "",
  itinerary: [{ day: 1, title: "", body: "" }],
  seasonLabel: "",
  difficultyLabel: "",
});

export function TrekEditor({ id }: { id: string }) {
  const isNew = id === "new";
  const router = useRouter();
  const [locale, setLocale] = useState<StudioLocale>("en");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState("");
  const [form, setForm] = useState({
    slug: "",
    durationDays: 7,
    difficulty: "moderate",
    maxAltitudeM: 4000,
    priceFromUsd: 800,
    season: "Mar–May, Sep–Nov",
    heroImageUrl: "",
    gallery: [] as string[],
    featured: false,
    published: true,
    sortOrder: 10,
    kind: "trek" as "trek" | "rafting" | "activity" | "safari",
    inclusions: [] as string[],
    exclusions: [] as string[],
    bestMonths: [3, 4, 5, 9, 10, 11] as number[],
    river: "",
    grade: "",
    minAge: 0,
    altitudeProfile: [] as { d: number; m: number }[],
    translations: locales.map(emptyTr),
  });

  useEffect(() => {
    if (isNew) return;
    cmsFetch(`/cms/treks/${id}`).then((trek) => {
      const translations = locales.map((l) => {
        const found = trek.translations.find((t: Tr) => t.locale === l);
        return found
          ? { ...found, itinerary: Array.isArray(found.itinerary) ? found.itinerary : emptyTr(l).itinerary }
          : emptyTr(l);
      });
      setForm({
        slug: trek.slug,
        durationDays: trek.durationDays,
        difficulty: trek.difficulty,
        maxAltitudeM: trek.maxAltitudeM,
        priceFromUsd: trek.priceFromUsd,
        season: trek.season,
        heroImageUrl: trek.heroImageUrl,
        gallery: trek.gallery || [],
        featured: Boolean(trek.featured),
        published: trek.published !== false,
        sortOrder: trek.sortOrder ?? 10,
        kind: trek.kind,
        inclusions: trek.inclusions || [],
        exclusions: trek.exclusions || [],
        bestMonths: trek.bestMonths || [],
        river: trek.river || "",
        grade: trek.grade || "",
        minAge: trek.minAge || 0,
        altitudeProfile: Array.isArray(trek.altitudeProfile) ? trek.altitudeProfile : [],
        translations,
      });
    });
  }, [id, isNew]);

  const tr = form.translations.find((t) => t.locale === locale)!;

  function patchTr(partial: Partial<Tr>) {
    setForm((f) => ({
      ...f,
      translations: f.translations.map((t) => (t.locale === locale ? { ...t, ...partial } : t)),
    }));
  }

  async function save() {
    setBusy(true);
    setSaved("");
    const method = isNew ? "POST" : "PATCH";
    const path = isNew ? "/cms/treks" : `/cms/treks/${id}`;
    const savedTrek = await cmsFetch(path, {
      method,
      body: JSON.stringify({
        slug: form.slug,
        durationDays: form.durationDays,
        difficulty: form.difficulty,
        maxAltitudeM: form.maxAltitudeM,
        priceFromUsd: form.priceFromUsd,
        season: form.season,
        heroImageUrl: form.heroImageUrl,
        gallery: form.gallery,
        featured: form.featured,
        published: form.published,
        sortOrder: form.sortOrder,
        kind: form.kind,
        inclusions: form.inclusions,
        exclusions: form.exclusions,
        bestMonths: form.bestMonths,
        river: form.river || null,
        grade: form.grade || null,
        minAge: form.minAge || null,
        altitudeProfile: form.altitudeProfile,
        translations: form.translations,
      }),
    });
    setBusy(false);
    setSaved("Saved just now. Guests will see this on the website.");
    router.push(`/${adminPath}/treks/${savedTrek.id}`);
  }

  async function remove() {
    if (!confirm("Delete this trip? This cannot be undone.")) return;
    await cmsFetch(`/cms/treks/${id}`, { method: "DELETE" });
    router.push(`/${adminPath}/treks`);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <StudioPageHeader
        title={isNew ? "Add a trip" : tr.name || "Edit trip"}
        hint="Photos first, then prices, then the words in each language."
        action={
          !isNew && form.published && form.slug ? (
            <StudioViewSite href={tripHref({ kind: form.kind, slug: form.slug })} />
          ) : undefined
        }
      />

      <StudioCard className="space-y-5">
        <h2 className="font-serif text-2xl">Photos</h2>
        <StudioUpload
          label="Main photo"
          help="The big picture on the trip page."
          preview={form.heroImageUrl || null}
          onUrl={(url) => setForm((f) => ({ ...f, heroImageUrl: url }))}
        />
        <div>
          <p className="text-base font-semibold text-ink">More photos</p>
          <p className="mt-0.5 text-[15px] text-ink-soft">Shown in a row under the main photo.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {form.gallery.map((url, i) => (
              <div key={`${url}-${i}`} className="relative overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-28 w-full object-cover" />
                <button
                  type="button"
                  className="studio-btn studio-btn-ghost absolute right-2 top-2 min-h-10 px-3 text-sm"
                  onClick={() => setForm((f) => ({ ...f, gallery: f.gallery.filter((_, idx) => idx !== i) }))}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <label className="studio-btn studio-btn-ghost mt-3 cursor-pointer">
            Add photos
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                const urls: string[] = [];
                for (const file of files) {
                  const { url } = await uploadFile(file);
                  urls.push(url);
                }
                if (urls.length) setForm((f) => ({ ...f, gallery: [...f.gallery, ...urls] }));
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </StudioCard>

      <StudioCard className="space-y-5">
        <h2 className="font-serif text-2xl">Kind, days & price</h2>
        <StudioField label="What kind of trip">
          <select
            className="studio-input"
            value={form.kind}
            onChange={(e) => setForm({ ...form, kind: e.target.value as "trek" | "rafting" | "activity" | "safari" })}
          >
            <option value="trek">Trek</option>
            <option value="rafting">Rafting</option>
            <option value="activity">Activity</option>
            <option value="safari">Safari</option>
          </select>
        </StudioField>
        <StudioField
          label="Web address name"
          help="Short English name in the link, like annapurna-base-camp. No spaces."
        >
          <input className="studio-input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </StudioField>
        <div className="grid gap-4 sm:grid-cols-2">
          <StudioField label="Days">
            <input
              type="number"
              className="studio-input"
              value={form.durationDays}
              onChange={(e) => setForm({ ...form, durationDays: Number(e.target.value) })}
            />
          </StudioField>
          <StudioField label="Price from (US dollars)">
            <input
              type="number"
              className="studio-input"
              value={form.priceFromUsd}
              onChange={(e) => setForm({ ...form, priceFromUsd: Number(e.target.value) })}
            />
          </StudioField>
          <StudioField label="Highest point (metres)">
            <input
              type="number"
              className="studio-input"
              value={form.maxAltitudeM}
              onChange={(e) => setForm({ ...form, maxAltitudeM: Number(e.target.value) })}
            />
          </StudioField>
          <StudioField label="How hard it is">
            <select
              className="studio-input"
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            >
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="challenging">Challenging</option>
            </select>
          </StudioField>
          <StudioField label="Season (English, for staff)">
            <input className="studio-input" value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })} />
          </StudioField>
          <StudioField label="Order on the list" help="Smaller numbers show first.">
            <input
              type="number"
              className="studio-input"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
            />
          </StudioField>
        </div>
        <fieldset>
          <legend className="text-base font-semibold text-ink">Best months</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((label, i) => {
              const month = i + 1;
              const on = form.bestMonths.includes(month);
              return (
                <label
                  key={label}
                  className={`studio-btn min-h-12 cursor-pointer px-4 ${on ? "studio-btn-primary" : "studio-btn-ghost"}`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={on}
                    onChange={() =>
                      setForm((f) => ({
                        ...f,
                        bestMonths: on ? f.bestMonths.filter((m) => m !== month) : [...f.bestMonths, month].sort((a, b) => a - b),
                      }))
                    }
                  />
                  {label}
                </label>
              );
            })}
          </div>
        </fieldset>
        <StudioCheck checked={form.featured} onChange={(v) => setForm({ ...form, featured: v })}>
          Show on the homepage
        </StudioCheck>
        <StudioCheck checked={form.published} onChange={(v) => setForm({ ...form, published: v })}>
          Live on the website
        </StudioCheck>
        {form.kind === "rafting" && (
          <div className="grid gap-4 sm:grid-cols-3">
            <StudioField label="River">
              <input className="studio-input" value={form.river} onChange={(e) => setForm({ ...form, river: e.target.value })} />
            </StudioField>
            <StudioField label="Grade">
              <input className="studio-input" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} />
            </StudioField>
            <StudioField label="Youngest age">
              <input
                type="number"
                className="studio-input"
                value={form.minAge}
                onChange={(e) => setForm({ ...form, minAge: Number(e.target.value) })}
              />
            </StudioField>
          </div>
        )}
        <StudioField label="What is included" help="One item per line.">
          <textarea
            className="studio-input"
            rows={4}
            value={form.inclusions.join("\n")}
            onChange={(e) => setForm({ ...form, inclusions: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
          />
        </StudioField>
        <StudioField label="What is not included" help="One item per line.">
          <textarea
            className="studio-input"
            rows={3}
            value={form.exclusions.join("\n")}
            onChange={(e) => setForm({ ...form, exclusions: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
          />
        </StudioField>
      </StudioCard>

      <StudioCard className="space-y-5">
        <h2 className="font-serif text-2xl">Words guests read</h2>
        <StudioLocaleTabs value={locale} onChange={setLocale} />
        <StudioField label="Trip name">
          <input className="studio-input" value={tr.name} onChange={(e) => patchTr({ name: e.target.value })} />
        </StudioField>
        <StudioField label="Short summary">
          <textarea className="studio-input" value={tr.summary} onChange={(e) => patchTr({ summary: e.target.value })} />
        </StudioField>
        <StudioField label="Full story">
          <textarea rows={6} className="studio-input" value={tr.description} onChange={(e) => patchTr({ description: e.target.value })} />
        </StudioField>
        <div className="grid grid-cols-2 gap-4">
          <StudioField label="Season, in this language">
            <input className="studio-input" value={tr.seasonLabel} onChange={(e) => patchTr({ seasonLabel: e.target.value })} />
          </StudioField>
          <StudioField label="Difficulty, in this language">
            <input className="studio-input" value={tr.difficultyLabel} onChange={(e) => patchTr({ difficultyLabel: e.target.value })} />
          </StudioField>
        </div>
        <div>
          <p className="text-base font-semibold text-ink">Day by day</p>
          {tr.itinerary.map((day, i) => (
            <div key={i} className="mt-3 space-y-2 rounded-2xl bg-[#F4F8FF] p-4">
              <StudioField label={`Day ${i + 1} title`}>
                <input
                  className="studio-input"
                  value={day.title}
                  onChange={(e) => {
                    const itinerary = tr.itinerary.map((d, idx) => (idx === i ? { ...d, title: e.target.value } : d));
                    patchTr({ itinerary });
                  }}
                />
              </StudioField>
              <StudioField label="What happens that day">
                <textarea
                  className="studio-input"
                  value={day.body}
                  onChange={(e) => {
                    const itinerary = tr.itinerary.map((d, idx) => (idx === i ? { ...d, body: e.target.value } : d));
                    patchTr({ itinerary });
                  }}
                />
              </StudioField>
            </div>
          ))}
          <button
            type="button"
            className="studio-btn studio-btn-ghost mt-3"
            onClick={() => patchTr({ itinerary: [...tr.itinerary, { day: tr.itinerary.length + 1, title: "", body: "" }] })}
          >
            Add a day
          </button>
        </div>
      </StudioCard>

      <StudioSaveBar
        onSave={save}
        busy={busy}
        saved={saved}
        extra={
          !isNew ? (
            <button type="button" onClick={remove} className="studio-btn studio-btn-danger">
              Delete trip
            </button>
          ) : null
        }
      />
    </div>
  );
}
