import { getLocale, getTranslations } from "next-intl/server";
import type { SiteSettings } from "@/lib/api";
import type { Locale } from "@/i18n/routing";
import { contactPrefill, whatsappHref } from "@/lib/contacts";
import { MessageCircle, Mail } from "lucide-react";

export async function AskManager({ settings }: { settings: SiteSettings }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("ask");
  const wa = whatsappHref(settings, contactPrefill(locale, settings.siteTitle));
  const mail = `mailto:${settings.email}?subject=${encodeURIComponent(settings.siteTitle)}`;

  return (
    <section className="bg-sky">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-14 sm:flex-row sm:items-center lg:px-8">
        <div className="text-snow">
          <p className="text-xs uppercase tracking-[0.2em] text-snow/80">{t("kicker")}</p>
          <h2 className="mt-2 font-serif text-4xl">{t("title")}</h2>
          <p className="mt-3 max-w-lg text-sm text-snow/85">{t("body")}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={wa} className="inline-flex items-center gap-2 rounded-2xl bg-ink px-5 py-3 text-sm font-medium text-snow hover:bg-moss-deep">
            <MessageCircle className="h-4 w-4" />
            {t("whatsapp")}
          </a>
          <a href={mail} className="inline-flex items-center gap-2 rounded-2xl bg-snow px-5 py-3 text-sm font-medium text-ink hover:bg-ivory">
            <Mail className="h-4 w-4" />
            {t("email")}
          </a>
        </div>
      </div>
    </section>
  );
}
