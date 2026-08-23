import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function PreparePage() {
  const t = await getTranslations("prepare");
  const blocks = ["permits", "packing", "fitness", "river"] as const;

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-copper">{t("kicker")}</p>
      <h1 className="mt-3 font-serif text-5xl sm:text-6xl">{t("title")}</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-soft">{t("lede")}</p>

      <div className="mt-14 space-y-14">
        {blocks.map((key) => (
          <section key={key}>
            <h2 className="font-serif text-3xl">{t(`${key}Title`)}</h2>
            <p className="mt-4 leading-relaxed text-ink-soft">{t(`${key}Body`)}</p>
          </section>
        ))}
      </div>

      <div className="mt-16 rounded-[1.6rem] bg-moss-deep p-8 text-snow">
        <h2 className="font-serif text-3xl">{t("ctaTitle")}</h2>
        <p className="mt-3 text-sm text-snow/75">{t("ctaBody")}</p>
        <Link href="/book" className="mt-6 inline-block rounded-full bg-copper px-6 py-3 text-sm hover:bg-copper-deep">
          {t("cta")}
        </Link>
      </div>
    </div>
  );
}
