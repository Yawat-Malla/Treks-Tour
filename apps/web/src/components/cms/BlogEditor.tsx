"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminPath, type StudioLocale } from "@/cms/studio-nav";
import { cmsFetch } from "@/lib/cms";
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
  const [locale, setLocale] = useState<StudioLocale>("en");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState("");
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
    setSaved("");
    const method = isNew ? "POST" : "PATCH";
    const path = isNew ? "/cms/blog" : `/cms/blog/${id}`;
    const savedPost = await cmsFetch(path, { method, body: JSON.stringify(form) });
    setBusy(false);
    setSaved("Saved just now. Guests will see this on the website.");
    router.push(`/${adminPath}/blog/${savedPost.id}`);
  }

  async function remove() {
    if (!confirm("Delete this story? This cannot be undone.")) return;
    await cmsFetch(`/cms/blog/${id}`, { method: "DELETE" });
    router.push(`/${adminPath}/blog`);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <StudioPageHeader
        title={isNew ? "Add a story" : tr.title || "Edit story"}
        hint="A photo, then the words in each language."
        action={!isNew && form.published && form.slug ? <StudioViewSite href={`/blog/${form.slug}`} /> : undefined}
      />

      <StudioCard className="space-y-5">
        <StudioUpload
          label="Story photo"
          help="The picture at the top of the post."
          preview={form.heroImageUrl || null}
          onUrl={(url) => setForm((f) => ({ ...f, heroImageUrl: url }))}
        />
        <StudioField label="Web address name" help="Short English name in the link. No spaces.">
          <input className="studio-input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </StudioField>
        <div className="grid gap-4 sm:grid-cols-2">
          <StudioField label="Date">
            <input
              type="date"
              className="studio-input"
              value={form.publishedAt}
              onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
            />
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
        <StudioCheck checked={form.featured} onChange={(v) => setForm({ ...form, featured: v })}>
          Show on the homepage
        </StudioCheck>
        <StudioCheck checked={form.published} onChange={(v) => setForm({ ...form, published: v })}>
          Live on the website
        </StudioCheck>
      </StudioCard>

      <StudioCard className="space-y-5">
        <h2 className="font-serif text-2xl">Words guests read</h2>
        <StudioLocaleTabs value={locale} onChange={setLocale} />
        <StudioField label="Title">
          <input className="studio-input" value={tr.title} onChange={(e) => patchTr({ title: e.target.value })} />
        </StudioField>
        <StudioField label="Short teaser" help="One or two sentences on the blog list.">
          <textarea rows={3} className="studio-input" value={tr.excerpt} onChange={(e) => patchTr({ excerpt: e.target.value })} />
        </StudioField>
        <StudioField label="Full story">
          <textarea rows={12} className="studio-input" value={tr.body} onChange={(e) => patchTr({ body: e.target.value })} />
        </StudioField>
      </StudioCard>

      <StudioSaveBar
        onSave={save}
        busy={busy}
        saved={saved}
        extra={
          !isNew ? (
            <button type="button" onClick={remove} className="studio-btn studio-btn-danger">
              Delete story
            </button>
          ) : null
        }
      />
    </div>
  );
}
