import { getLocale, getTranslations } from "next-intl/server";
import { fetchPublic } from "@/lib/api";
import { PageHero } from "@/components/ui/PageHero";
import { siteCopy } from "@/lib/site-copy";

export default async function AboutPage() {
  const locale = await getLocale();
  const t = await getTranslations("about");
  const { settings } = await fetchPublic(locale);
  const c = (key: string) => siteCopy(settings, `about.${key}`, () => t(key));
  const blocks = ["base", "guides", "licenses", "local"] as const;

  return (
    <>
      <PageHero
        kicker={c("kicker")}
        title={c("title")}
        image={settings.aboutHeroUrl || "https://images.unsplash.com/photo-1706187975952-33765f844667?auto=format&fit=crop&w=2000&q=80"}
        tall
      />
      <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <p className="text-lg leading-relaxed text-ink-soft">{c("body")}</p>
        <div className="mt-14 grid gap-10 sm:grid-cols-2">
          {blocks.map((key) => (
            <section key={key}>
              <h2 className="font-serif text-2xl">{c(`${key}Title`)}</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{c(`${key}Body`)}</p>
            </section>
          ))}
        </div>
        <p className="mt-12 text-sm text-ink-soft">
          {settings.address}
          <br />
          {settings.phone}
        </p>
      </div>
    </>
  );
}
