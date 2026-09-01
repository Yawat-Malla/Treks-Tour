import { getLocale, getTranslations } from "next-intl/server";
import { fetchPublic } from "@/lib/api";
import { ContactActions } from "@/components/ContactActions";
import { FaqList } from "@/components/home/FaqList";
import { PageHero } from "@/components/ui/PageHero";
import { siteCopy } from "@/lib/site-copy";

export default async function ContactPage() {
  const t = await getTranslations();
  const { settings, faqs } = await fetchPublic(await getLocale());
  const c = (key: string) => siteCopy(settings, key, () => t(key));

  return (
    <>
      <PageHero
        kicker={c("contact.kicker")}
        title={c("contact.title")}
        lede={c("contact.lede")}
        image={settings.heroPosterUrl || "/heroes/hero-poster.jpg"}
      />
      <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <p className="text-sm text-ink-soft">
          {settings.address} · {c("contact.hours")}
        </p>
        <ContactActions settings={settings} />
        {faqs.length > 0 && (
          <div className="mt-20">
            <FaqList items={faqs} kicker={c("faq.kicker")} title={c("faq.title")} />
          </div>
        )}
      </div>
    </>
  );
}
