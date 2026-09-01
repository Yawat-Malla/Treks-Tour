import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { fetchBlog } from "@/lib/api";
import { PageHero } from "@/components/ui/PageHero";
import { siteCopy } from "@/lib/site-copy";

function formatDate(iso: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("blogs");
  const data = await fetchBlog(slug, locale);
  if (!data) notFound();
  const { post, posts } = data;
  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <PageHero kicker={formatDate(post.publishedAt, locale)} title={post.title} lede={post.excerpt} image={post.heroImageUrl} tall />
      <article className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
          {post.body.split(/\n\n+/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        {others.length > 0 && (
          <aside className="mt-16 border-t border-ink/10 pt-10">
            <p className="text-xs uppercase tracking-[0.22em] text-sky">{siteCopy(data.settings, "blogs.kicker", () => t("kicker"))}</p>
            <ul className="mt-4 space-y-3">
              {others.map((p) => (
                <li key={p.id}>
                  <Link href={`/blog/${p.slug}`} className="font-serif text-xl hover:text-sky">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/blog" className="mt-6 inline-block text-sm text-sky underline-offset-4 hover:underline">
              {siteCopy(data.settings, "blogs.all", () => t("all"))}
            </Link>
          </aside>
        )}
      </article>
    </>
  );
}
