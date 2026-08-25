import { getLocale, getTranslations } from "next-intl/server";
import { fetchPublic } from "@/lib/api";
import { FilmImage } from "@/components/ui/FilmImage";

export default async function AboutPage() {
  const locale = await getLocale();
  const t = await getTranslations("about");
  const { settings } = await fetchPublic(locale);
  const blocks = ["base", "guides", "licenses", "local"] as const;

  return (
    <div>
      <section className="relative h-[50vh] min-h-[320px]">
        <FilmImage
          src="https://images.unsplash.com/photo-1706187975952-33765f844667?auto=format&fit=crop&w=2000&q=80"
          className="absolute inset-0"
          kenburns
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ivory via-ink/20 to-transparent" />
      </section>
      <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <p className="text-xs uppercase tracking-[0.22em] text-copper">{t("kicker")}</p>
        <h1 className="mt-4 font-serif text-5xl">{settings.aboutTitle}</h1>
        <p className="mt-8 text-lg leading-relaxed text-ink-soft">{settings.aboutBody}</p>
        <div className="mt-14 space-y-12">
          {blocks.map((key) => (
            <section key={key}>
              <h2 className="font-serif text-3xl">{t(`${key}Title`)}</h2>
              <p className="mt-4 leading-relaxed text-ink-soft">{t(`${key}Body`)}</p>
            </section>
          ))}
        </div>
        <p className="mt-12 text-sm text-ink-soft">
          {settings.address}
          <br />
          {settings.phone}
        </p>
      </div>
    </div>
  );
}
