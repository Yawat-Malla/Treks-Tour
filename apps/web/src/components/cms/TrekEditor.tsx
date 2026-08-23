"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cmsFetch, uploadFile } from "@/lib/cms";

const admin = process.env.NEXT_PUBLIC_ADMIN_PATH || "studio-7f3a";
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
  const [locale, setLocale] = useState<(typeof locales)[number]>("en");
  const [busy, setBusy] = useState(false);
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
    kind: "trek" as "trek" | "rafting",
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
      setForm({ ...trek, translations });
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
    const method = isNew ? "POST" : "PATCH";
    const path = isNew ? "/cms/treks" : `/cms/treks/${id}`;
    const saved = await cmsFetch(path, { method, body: JSON.stringify(form) });
    router.push(`/${admin}/treks/${saved.id}`);
    setBusy(false);
  }

  async function remove() {
    if (!confirm("Delete this trek?")) return;
    await cmsFetch(`/cms/treks/${id}`, { method: "DELETE" });
    router.push(`/${admin}/treks`);
  }

  async function hero(file?: File) {
    if (!file) return;
    const { url } = await uploadFile(file);
    setForm((f) => ({ ...f, heroImageUrl: url }));
  }

  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="font-serif text-4xl">{isNew ? "New trip" : tr.name || "Edit trip"}</h1>
      <label className="block">
        <span className="text-sm text-ink-soft">Kind</span>
        <select
          className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3"
          value={form.kind}
          onChange={(e) => setForm({ ...form, kind: e.target.value as "trek" | "rafting" })}
        >
          <option value="trek">Trek</option>
          <option value="rafting">Rafting</option>
        </select>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="text-sm text-ink-soft">Slug</span>
          <input className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </label>
        <label>
          <span className="text-sm text-ink-soft">Days</span>
          <input type="number" className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3" value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: Number(e.target.value) })} />
        </label>
        <label>
          <span className="text-sm text-ink-soft">Max altitude (m)</span>
          <input type="number" className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3" value={form.maxAltitudeM} onChange={(e) => setForm({ ...form, maxAltitudeM: Number(e.target.value) })} />
        </label>
        <label>
          <span className="text-sm text-ink-soft">Price from USD</span>
          <input type="number" className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3" value={form.priceFromUsd} onChange={(e) => setForm({ ...form, priceFromUsd: Number(e.target.value) })} />
        </label>
      </div>
      <label className="block text-sm">
        Hero image URL or upload
        <input className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3" value={form.heroImageUrl} onChange={(e) => setForm({ ...form, heroImageUrl: e.target.value })} />
        <input type="file" accept="image/*" className="mt-2" onChange={(e) => hero(e.target.files?.[0])} />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
        Featured on home
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
        Published
      </label>
      {form.kind === "rafting" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <label>
            <span className="text-sm text-ink-soft">River</span>
            <input className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3" value={form.river} onChange={(e) => setForm({ ...form, river: e.target.value })} />
          </label>
          <label>
            <span className="text-sm text-ink-soft">Grade</span>
            <input className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} />
          </label>
          <label>
            <span className="text-sm text-ink-soft">Min age</span>
            <input type="number" className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3" value={form.minAge} onChange={(e) => setForm({ ...form, minAge: Number(e.target.value) })} />
          </label>
        </div>
      )}
      <label className="block">
        <span className="text-sm text-ink-soft">Inclusions (one per line)</span>
        <textarea
          className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3"
          rows={4}
          value={form.inclusions.join("\n")}
          onChange={(e) => setForm({ ...form, inclusions: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
        />
      </label>
      <label className="block">
        <span className="text-sm text-ink-soft">Exclusions (one per line)</span>
        <textarea
          className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3"
          rows={3}
          value={form.exclusions.join("\n")}
          onChange={(e) => setForm({ ...form, exclusions: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
        />
      </label>
      <div className="flex gap-2">
        {locales.map((l) => (
          <button key={l} type="button" onClick={() => setLocale(l)} className={`rounded-full px-3 py-1 text-sm ${locale === l ? "bg-moss text-snow" : "bg-snow"}`}>
            {l}
          </button>
        ))}
      </div>
      <label className="block">
        <span className="text-sm text-ink-soft">Name</span>
        <input className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3" value={tr.name} onChange={(e) => patchTr({ name: e.target.value })} />
      </label>
      <label className="block">
        <span className="text-sm text-ink-soft">Summary</span>
        <textarea className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3" value={tr.summary} onChange={(e) => patchTr({ summary: e.target.value })} />
      </label>
      <label className="block">
        <span className="text-sm text-ink-soft">Description</span>
        <textarea rows={6} className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3" value={tr.description} onChange={(e) => patchTr({ description: e.target.value })} />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label>
          <span className="text-sm text-ink-soft">Season label</span>
          <input className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3" value={tr.seasonLabel} onChange={(e) => patchTr({ seasonLabel: e.target.value })} />
        </label>
        <label>
          <span className="text-sm text-ink-soft">Difficulty label</span>
          <input className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3" value={tr.difficultyLabel} onChange={(e) => patchTr({ difficultyLabel: e.target.value })} />
        </label>
      </div>
      <div>
        <p className="text-sm text-ink-soft">Itinerary</p>
        {tr.itinerary.map((day, i) => (
          <div key={i} className="mt-3 grid gap-2 rounded-2xl bg-snow p-3 ring-1 ring-ink/8">
            <input
              className="rounded-xl border border-ink/10 px-3 py-2"
              placeholder="Title"
              value={day.title}
              onChange={(e) => {
                const itinerary = tr.itinerary.map((d, idx) => (idx === i ? { ...d, title: e.target.value } : d));
                patchTr({ itinerary });
              }}
            />
            <textarea
              className="rounded-xl border border-ink/10 px-3 py-2"
              placeholder="Body"
              value={day.body}
              onChange={(e) => {
                const itinerary = tr.itinerary.map((d, idx) => (idx === i ? { ...d, body: e.target.value } : d));
                patchTr({ itinerary });
              }}
            />
          </div>
        ))}
        <button
          type="button"
          className="mt-2 text-sm text-moss"
          onClick={() => patchTr({ itinerary: [...tr.itinerary, { day: tr.itinerary.length + 1, title: "", body: "" }] })}
        >
          Add day
        </button>
      </div>
      <div className="flex gap-3">
        <button type="button" disabled={busy} onClick={save} className="rounded-full bg-copper px-6 py-2.5 text-snow">
          Save trek
        </button>
        {!isNew && (
          <button type="button" onClick={remove} className="text-sm text-ink-soft">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
