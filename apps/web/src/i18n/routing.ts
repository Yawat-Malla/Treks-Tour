import { defineRouting } from "next-intl/routing";

export const locales = ["en", "zh", "ko", "he"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export const rtlLocales: Locale[] = ["he"];
