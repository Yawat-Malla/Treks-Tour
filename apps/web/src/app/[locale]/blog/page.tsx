import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { fetchPublic } from "@/lib/api";
import { PageHero } from "@/components/ui/PageHero";
import { FilmImage } from "@/components/ui/FilmImage";

function formatDate(iso: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

export default async function BlogIndexPage() {
  const locale = await getLocale();
  const t = await getTranslations("blogs");
  const { posts } = await fetchPublic(locale);
  const hero = posts[0]?.heroImageUrl || "/heroes/hero-poster.jpg";

  return (
    <>
      <PageHero kicker={t("kicker")} title={t("title")} image={hero} />
      <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block overflow-hidden rounded-2xl bg-snow shadow-[var(--shadow)] ring-1 ring-ink/6">
              <div className="relative aspect-[16/10]">
                <FilmImage src={post.heroImageUrl} className="absolute inset-0" />
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-sky">{formatDate(post.publishedAt, locale)}</p>
                <h2 className="mt-2 font-serif text-2xl group-hover:text-sky">{post.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
