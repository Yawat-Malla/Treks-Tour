import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { fetchPublic } from "@/lib/api";
import { PageHero } from "@/components/ui/PageHero";
import { siteCopy } from "@/lib/site-copy";

export default async function PreparePage() {
  const locale = await getLocale();
  const t = await getTranslations("prepare");
  const { settings } = await fetchPublic(locale);
  const c = (key: string) => siteCopy(settings, `prepare.${key}`, () => t(key));
  const blocks = ["permits", "packing", "fitness", "river"] as const;

  return (
    <>
      <PageHero
        kicker={c("kicker")}
        title={c("title")}
        lede={c("lede")}
        image={settings.heroPosterUrl || "/heroes/hero-poster.jpg"}
      />
      <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <div className="space-y-14">
          {blocks.map((key) => (
            <section key={key}>
              <h2 className="font-serif text-3xl">{c(`${key}Title`)}</h2>
              <p className="mt-4 leading-relaxed text-ink-soft">{c(`${key}Body`)}</p>
            </section>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-ink p-8 text-snow">
          <h2 className="font-serif text-3xl">{c("ctaTitle")}</h2>
          <p className="mt-3 text-sm text-snow/75">{c("ctaBody")}</p>
          <Link href="/book" className="mt-6 inline-block rounded-full bg-snow px-6 py-3 text-sm text-ink hover:bg-ivory">
            {c("cta")}
          </Link>
        </div>
      </div>
    </>
  );
}
