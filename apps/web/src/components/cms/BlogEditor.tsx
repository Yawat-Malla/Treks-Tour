"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cmsFetch, uploadFile } from "@/lib/cms";

const admin = process.env.NEXT_PUBLIC_ADMIN_PATH || "studio-7f3a";
const locales = ["en", "zh", "ko", "he"] as const;

type Tr = {
  locale: (typeof locales)[number];
  title: string;
  excerpt: string;
  body: string;
};

const emptyTr = (locale: (typeof locales)[number]): Tr => ({
  locale,
  title: "",
  excerpt: "",
  body: "",
});

export function BlogEditor({ id }: { id: string }) {
  const isNew = id === "new";
  const router = useRouter();
  const [locale, setLocale] = useState<(typeof locales)[number]>("en");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    slug: "",
    heroImageUrl: "",
    featured: false,
    published: true,
    publishedAt: new Date().toISOString().slice(0, 10),
    sortOrder: 10,
    translations: locales.map(emptyTr),
  });

  useEffect(() => {
    if (isNew) return;
    cmsFetch(`/cms/blog/${id}`).then((post) => {
      const translations = locales.map((l) => {
        const found = post.translations.find((t: Tr) => t.locale === l);
        return found || emptyTr(l);
      });
      setForm({
        slug: post.slug,
        heroImageUrl: post.heroImageUrl,
        featured: post.featured,
        published: post.published,
        publishedAt: String(post.publishedAt).slice(0, 10),
        sortOrder: post.sortOrder,
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
    const method = isNew ? "POST" : "PATCH";
    const path = isNew ? "/cms/blog" : `/cms/blog/${id}`;
    const saved = await cmsFetch(path, { method, body: JSON.stringify(form) });
    router.push(`/${admin}/blog/${saved.id}`);
    setBusy(false);
  }

  async function remove() {
    if (!confirm("Delete this post?")) return;
    await cmsFetch(`/cms/blog/${id}`, { method: "DELETE" });
    router.push(`/${admin}/blog`);
  }

  async function hero(file?: File) {
    if (!file) return;
    const { url } = await uploadFile(file);
    setForm((f) => ({ ...f, heroImageUrl: url }));
  }

  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="font-serif text-4xl">{isNew ? "New post" : tr.title || "Edit post"}</h1>
      <label className="block">
        <span className="text-sm text-ink-soft">Slug</span>
        <input
          className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="text-sm text-ink-soft">Date</span>
          <input
            type="date"
            className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3"
            value={form.publishedAt}
            onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
          />
        </label>
        <label>
          <span className="text-sm text-ink-soft">Sort</span>
          <input
            type="number"
            className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
          />
        </label>
      </div>
      <label className="block">
        <span className="text-sm text-ink-soft">Hero image</span>
        <input type="file" accept="image/*" className="mt-1 block" onChange={(e) => hero(e.target.files?.[0])} />
        {form.heroImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.heroImageUrl} alt="" className="mt-3 h-32 w-full rounded-2xl object-cover" />
        ) : null}
        <input
          className="mt-2 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3 text-sm"
          placeholder="or paste a URL"
          value={form.heroImageUrl}
          onChange={(e) => setForm({ ...form, heroImageUrl: e.target.value })}
        />
      </label>
      <div className="flex gap-4 text-sm">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          Featured
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          Published
        </label>
      </div>
      <div className="flex gap-2">
        {locales.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            className={`rounded-full px-3 py-1 text-sm ${locale === l ? "bg-ink text-snow" : "bg-ivory text-ink-soft"}`}
          >
            {l}
          </button>
        ))}
      </div>
      <label className="block">
        <span className="text-sm text-ink-soft">Title</span>
        <input
          className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3"
          value={tr.title}
          onChange={(e) => patchTr({ title: e.target.value })}
        />
      </label>
      <label className="block">
        <span className="text-sm text-ink-soft">Excerpt</span>
        <textarea
          rows={3}
          className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3"
          value={tr.excerpt}
          onChange={(e) => patchTr({ excerpt: e.target.value })}
        />
      </label>
      <label className="block">
        <span className="text-sm text-ink-soft">Body</span>
        <textarea
          rows={12}
          className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3"
          value={tr.body}
          onChange={(e) => patchTr({ body: e.target.value })}
        />
      </label>
      <div className="flex gap-3">
        <button type="button" onClick={save} disabled={busy} className="rounded-full bg-ink px-6 py-3 text-snow">
          {busy ? "Saving…" : "Save"}
        </button>
        {!isNew && (
          <button type="button" onClick={remove} className="rounded-full px-6 py-3 text-ink-soft">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
