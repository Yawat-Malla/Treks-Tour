import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/ui/PageHero";

export default async function PreparePage() {
  const t = await getTranslations("prepare");
  const blocks = ["permits", "packing", "fitness", "river"] as const;

  return (
    <>
      <PageHero kicker={t("kicker")} title={t("title")} lede={t("lede")} image="/heroes/hero-poster.jpg" />
      <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <div className="space-y-14">
          {blocks.map((key) => (
            <section key={key}>
              <h2 className="font-serif text-3xl">{t(`${key}Title`)}</h2>
              <p className="mt-4 leading-relaxed text-ink-soft">{t(`${key}Body`)}</p>
            </section>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-ink p-8 text-snow">
          <h2 className="font-serif text-3xl">{t("ctaTitle")}</h2>
          <p className="mt-3 text-sm text-snow/75">{t("ctaBody")}</p>
          <Link href="/book" className="mt-6 inline-block rounded-full bg-snow px-6 py-3 text-sm text-ink hover:bg-ivory">
            {t("cta")}
          </Link>
        </div>
      </div>
    </>
  );
}
