"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const t = useTranslations("lang");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{t("label")}</span>
      <select
        value={locale}
        onChange={(e) => router.replace(pathname, { locale: e.target.value as Locale })}
        className="cursor-pointer appearance-none rounded-full border border-ink/10 bg-snow/80 py-1.5 pe-8 ps-3 text-sm text-ink-soft outline-none transition hover:border-ink/25"
      >
        {locales.map((code) => (
          <option key={code} value={code}>
            {t(code)}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-e-2.5 text-[10px] text-ink-soft">▾</span>
    </label>
  );
}
