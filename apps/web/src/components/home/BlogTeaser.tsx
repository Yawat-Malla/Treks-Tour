import { Link } from "@/i18n/navigation";
import { FilmImage } from "@/components/ui/FilmImage";
import type { BlogPost } from "@/lib/api";

function formatDate(iso: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

export function BlogTeaser({
  posts,
  locale,
  kicker,
  title,
  all,
}: {
  posts: BlogPost[];
  locale: string;
  kicker: string;
  title: string;
  all: string;
}) {
  if (posts.length === 0) return null;
  const featured = posts.find((p) => p.featured) || posts[0];
  const rest = posts.filter((p) => p.id !== featured.id).slice(0, 3);

  return (
    <section className="bg-ivory py-20">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <p className="text-center text-xs uppercase tracking-[0.22em] text-sky">{kicker}</p>
        <h2 className="mt-3 text-center font-serif text-4xl">{title}</h2>
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <Link href={`/blog/${featured.slug}`} className="group block">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
              <FilmImage src={featured.heroImageUrl} className="absolute inset-0" />
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.16em] text-sky">{formatDate(featured.publishedAt, locale)}</p>
            <h3 className="mt-2 font-serif text-3xl group-hover:text-sky">{featured.title}</h3>
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-soft">{featured.excerpt}</p>
          </Link>
          <div className="divide-y divide-ink/10">
            {rest.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="block py-5 first:pt-0 hover:text-sky">
                <p className="text-xs text-ink-soft">{formatDate(p.publishedAt, locale)}</p>
                <h3 className="mt-1 font-serif text-xl leading-snug">{p.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{p.excerpt}</p>
              </Link>
            ))}
            <Link href="/blog" className="mt-4 inline-block pt-4 text-sm text-sky underline-offset-4 hover:underline">
              {all}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
