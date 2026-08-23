import { getLocale, getTranslations } from "next-intl/server";
import { fetchPublic } from "@/lib/api";
import type { Locale } from "@/i18n/routing";
import { ContactActions } from "@/components/ContactActions";
import { FaqList } from "@/components/home/FaqList";

export default async function ContactPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();
  const { settings, faqs } = await fetchPublic(locale);

  return (
    <div className="mx-auto max-w-3xl px-5 py-20 lg:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-copper">{t("contact.kicker")}</p>
      <h1 className="mt-4 font-serif text-5xl">{t("contact.title")}</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-soft">{t("contact.lede")}</p>
      <p className="mt-4 text-sm text-ink-soft">
        {settings.address} · {t("contact.hours")}
      </p>
      <ContactActions settings={settings} />
      {faqs.length > 0 && (
        <div className="mt-20">
          <FaqList items={faqs} kicker={t("faq.kicker")} title={t("faq.title")} />
        </div>
      )}
    </div>
  );
}
