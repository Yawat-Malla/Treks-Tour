"use client";

import { useEffect, useMemo, useState } from "react";
import { type StudioLocale } from "@/cms/studio-nav";
import { cmsFetch } from "@/lib/cms";
import {
  matchesQuery,
  StudioCard,
  StudioCount,
  StudioEmpty,
  StudioField,
  StudioLocaleTabs,
  StudioPageHeader,
  StudioSaveBar,
  StudioSearch,
} from "./studio-ui";

const locales = ["en", "zh", "ko", "he"] as const;

type Tr = { locale: (typeof locales)[number]; question: string; answer: string };
type FaqRow = { id: string; sortOrder: number; translations: Tr[] };

const emptyTr = (locale: (typeof locales)[number]): Tr => ({ locale, question: "", answer: "" });

export function FaqsEditor() {
  const [rows, setRows] = useState<FaqRow[] | null>(null);
  const [locale, setLocale] = useState<StudioLocale>("en");
  const [saved, setSaved] = useState("");
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");

  async function load() {
    const list = await cmsFetch("/cms/faqs");
    setRows(
      list.map((row: FaqRow) => ({
        ...row,
        translations: locales.map((l) => row.translations.find((t) => t.locale === l) || emptyTr(l)),
      })),
    );
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!rows) return [];
    return rows.filter((row) => {
      const tr = row.translations.find((t) => t.locale === locale);
      return matchesQuery(q, tr?.question, tr?.answer);
    });
  }, [rows, q, locale]);

  if (!rows) return <p className="text-lg text-ink-soft">Loading questions…</p>;
  const list = rows;

  function patch(id: string, partial: Partial<Tr>) {
    setRows((all) =>
      all!.map((row) =>
        row.id === id
          ? {
              ...row,
              translations: row.translations.map((t) => (t.locale === locale ? { ...t, ...partial } : t)),
            }
          : row,
      ),
    );
  }

  function move(id: string, dir: -1 | 1) {
    setRows((all) => {
      const copy = [...all!];
      const i = copy.findIndex((r) => r.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= copy.length) return copy;
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy.map((r, idx) => ({ ...r, sortOrder: (idx + 1) * 10 }));
    });
  }

  async function saveAll() {
    setBusy(true);
    setSaved("");
    await Promise.all(
      list.map((row) =>
        cmsFetch(`/cms/faqs/${row.id}`, {
          method: "PATCH",
          body: JSON.stringify({ sortOrder: row.sortOrder, translations: row.translations }),
        }),
      ),
    );
    setBusy(false);
    setSaved("Saved just now. Guests will see this on the website.");
  }

  async function add() {
    const created = await cmsFetch("/cms/faqs", {
      method: "POST",
      body: JSON.stringify({
        sortOrder: (list[list.length - 1]?.sortOrder ?? 0) + 10,
        translations: locales.map(emptyTr),
      }),
    });
    setRows((all) => [...all!, { ...created, translations: locales.map((l) => created.translations.find((t: Tr) => t.locale === l) || emptyTr(l)) }]);
  }

  async function remove(id: string) {
    if (!confirm("Delete this question? This cannot be undone.")) return;
    await cmsFetch(`/cms/faqs/${id}`, { method: "DELETE" });
    setRows((all) => all!.filter((r) => r.id !== id));
  }

  return (
    <div className="max-w-2xl space-y-6">
      <StudioPageHeader
        title="Questions"
        hint="The questions and answers on the homepage. Switch language, then type. Use Move up and Move down to change the order."
        action={
          <button type="button" onClick={add} className="studio-btn studio-btn-ghost">
            Add a question
          </button>
        }
      />
      <StudioLocaleTabs value={locale} onChange={setLocale} />
      <StudioSearch value={q} onChange={setQ} placeholder="Find a question" />
      <StudioCount shown={filtered.length} total={rows.length} word="questions" />
      {filtered.length === 0 ? (
        <StudioEmpty>{q.trim() ? "No questions match that search." : "No questions yet. Tap Add a question."}</StudioEmpty>
      ) : (
        filtered.map((row) => {
          const i = rows.findIndex((r) => r.id === row.id);
          const tr = row.translations.find((t) => t.locale === locale)!;
          return (
            <StudioCard key={row.id} className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <button type="button" className="studio-btn studio-btn-ghost" disabled={i <= 0} onClick={() => move(row.id, -1)}>
                  Move up
                </button>
                <button type="button" className="studio-btn studio-btn-ghost" disabled={i >= rows.length - 1} onClick={() => move(row.id, 1)}>
                  Move down
                </button>
              </div>
              <StudioField label={`Question ${i + 1}`}>
                <input className="studio-input" value={tr.question} onChange={(e) => patch(row.id, { question: e.target.value })} />
              </StudioField>
              <StudioField label="Answer">
                <textarea rows={4} className="studio-input" value={tr.answer} onChange={(e) => patch(row.id, { answer: e.target.value })} />
              </StudioField>
              <button type="button" onClick={() => remove(row.id)} className="studio-btn studio-btn-danger">
                Delete this question
              </button>
            </StudioCard>
          );
        })
      )}
      <StudioSaveBar onSave={saveAll} busy={busy} saved={saved} />
    </div>
  );
}
