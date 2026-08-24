import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { fetchPublic } from "@/lib/api";
import { contactPrefill, whatsappHref } from "@/lib/contacts";
import type { Locale } from "@/i18n/routing";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; email?: string; kind?: string }>;
}) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("success");
  const { ref, email, kind } = await searchParams;
  const { settings, rafting } = await fetchPublic(locale);
  const wa = whatsappHref(
    settings,
    contactPrefill(locale, settings.siteTitle) + (ref ? ` (${ref})` : ""),
  );
  const kali = rafting.find((x) => x.slug === "kaligandaki-1-day") || rafting[0];
  const showRaft = kind !== "rafting" && kali;

  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center lg:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-copper">{t("kicker")}</p>
      <h1 className="mt-4 font-serif text-5xl">{t("title")}</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-soft">
        {t("body", { ref: ref || "—", email: email || settings.email })}
      </p>
      <a
        href={wa}
        className="mt-10 inline-block rounded-full bg-copper px-8 py-3 text-sm text-snow hover:bg-copper-deep"
      >
        {t("next")}
      </a>
      {showRaft && (
        <div className="mt-16 rounded-[1.6rem] bg-snow p-8 text-start ring-1 ring-ink/8">
          <p className="text-xs uppercase tracking-[0.16em] text-river">{t("raftKicker")}</p>
          <h2 className="mt-2 font-serif text-3xl">{t("raftTitle")}</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{t("raftBody")}</p>
          <Link
            href={`/rafting/${kali.slug}`}
            className="mt-5 inline-block text-sm text-moss underline-offset-4 hover:underline"
          >
            {t("raftCta")}
          </Link>
        </div>
      )}
    </div>
  );
}
