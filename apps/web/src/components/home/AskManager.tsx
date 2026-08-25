import { getLocale, getTranslations } from "next-intl/server";
import type { SiteSettings } from "@/lib/api";
import type { Locale } from "@/i18n/routing";
import { contactPrefill, whatsappHref } from "@/lib/contacts";
import { MessageCircle, Mail } from "lucide-react";

/** Logo-inspired range: a few peaks, flat base — not a repeating sawtooth. */
function AskHorizon() {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[7.5rem] w-full sm:h-36"
      viewBox="0 0 1440 180"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden
    >
      <path
        fill="var(--sky)"
        fillOpacity="0.18"
        d="M0 180V118L168 72l112 48 196-88 148 64 220-96 156 70 240-78 200 62V180H0Z"
      />
      <path
        fill="var(--sky)"
        fillOpacity="0.1"
        d="M0 180V138l220 8 180-54 160 40 250-70 190 48 220-42 220 36V180H0Z"
      />
    </svg>
  );
}

export async function AskManager({ settings }: { settings: SiteSettings }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("ask");
  const wa = whatsappHref(settings, contactPrefill(locale, settings.siteTitle));
  const mail = `mailto:${settings.email}?subject=${encodeURIComponent(settings.siteTitle)}`;

  return (
    <section className="relative isolate overflow-hidden bg-ink text-snow">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_0%,color-mix(in_srgb,var(--sky)_28%,transparent),transparent_55%),linear-gradient(165deg,color-mix(in_srgb,var(--sky)_12%,var(--ink))_0%,var(--ink)_48%,var(--ink)_100%)]"
        aria-hidden
      />
      <AskHorizon />

      <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-10 px-5 py-16 sm:flex-row sm:items-end sm:py-20 lg:px-8">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.22em] text-sky">{t("kicker")}</p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">{t("title")}</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-snow/75">{t("body")}</p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <a
            href={wa}
            className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-sky px-6 py-3.5 text-sm font-medium text-snow transition hover:bg-sky/90"
          >
            <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
            {t("whatsapp")}
          </a>
          <a
            href={mail}
            className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-snow/25 bg-snow/5 px-6 py-3.5 text-sm font-medium text-snow backdrop-blur-sm transition hover:border-snow/40 hover:bg-snow/10"
          >
            <Mail className="h-4 w-4 shrink-0" aria-hidden />
            {t("email")}
          </a>
        </div>
      </div>
    </section>
  );
}
