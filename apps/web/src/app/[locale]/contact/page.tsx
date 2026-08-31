import { getLocale, getTranslations } from "next-intl/server";
import { fetchPublic } from "@/lib/api";
import type { Locale } from "@/i18n/routing";
import { ContactActions } from "@/components/ContactActions";
import { FaqList } from "@/components/home/FaqList";
import { PageHero } from "@/components/ui/PageHero";

export default async function ContactPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();
  const { settings, faqs } = await fetchPublic(locale);

  return (
    <>
      <PageHero kicker={t("contact.kicker")} title={t("contact.title")} lede={t("contact.lede")} image="/heroes/hero-poster.jpg" />
      <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <p className="text-sm text-ink-soft">
          {settings.address} · {t("contact.hours")}
        </p>
        <ContactActions settings={settings} />
        {faqs.length > 0 && (
          <div className="mt-20">
            <FaqList items={faqs} kicker={t("faq.kicker")} title={t("faq.title")} />
          </div>
        )}
      </div>
    </>
  );
}
