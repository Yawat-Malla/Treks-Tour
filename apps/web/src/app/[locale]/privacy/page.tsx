import { getLocale, getTranslations } from "next-intl/server";
import { fetchPublic } from "@/lib/api";
import { siteCopy } from "@/lib/site-copy";

export default async function PrivacyPage() {
  const locale = await getLocale();
  const t = await getTranslations("legal");
  const { settings } = await fetchPublic(locale);
  return (
    <div className="mx-auto max-w-2xl px-5 py-20 lg:px-8">
      <h1 className="font-serif text-5xl">{siteCopy(settings, "legal.privacyTitle", () => t("privacyTitle"))}</h1>
      <p className="mt-8 leading-relaxed text-ink-soft">{siteCopy(settings, "legal.privacyBody", () => t("privacyBody"))}</p>
    </div>
  );
}
