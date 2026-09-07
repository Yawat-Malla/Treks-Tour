import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { fetchBlog, fetchPublic } from "@/lib/api";
import { PageHero } from "@/components/ui/PageHero";
import { siteCopy } from "@/lib/site-copy";
import { blogPostMetadata } from "@/lib/page-metadata";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { BlogBody } from "@/components/blog/BlogBody";
import { absoluteSiteUrl, absoluteUrl } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  return blogPostMetadata(locale, slug);
}

export async function generateStaticParams() {
  const data = await fetchPublic("en");
  return data.posts.map((p) => ({ slug: p.slug }));
}

function formatDate(iso: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(iso));
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
  const { post, posts, settings } = data;
  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const base = absoluteSiteUrl(settings);

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd(settings, post, locale),
          breadcrumbJsonLd([
            { name: "Home", url: absoluteUrl(locale, "/", base) },
            { name: siteCopy(settings, "blogs.title", () => t("title")), url: absoluteUrl(locale, "/blog", base) },
            { name: post.title, url: absoluteUrl(locale, `/blog/${post.slug}`, base) },
          ]),
        ]}
      />
      <PageHero kicker={formatDate(post.publishedAt, locale)} title={post.title} lede={post.excerpt} image={post.heroImageUrl} tall />
      <article className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <BlogBody body={post.body} />
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
