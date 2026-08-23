import { getTranslations } from "next-intl/server";

export default async function PrivacyPage() {
  const t = await getTranslations("legal");
  return (
    <div className="mx-auto max-w-2xl px-5 py-20 lg:px-8">
      <h1 className="font-serif text-5xl">{t("privacyTitle")}</h1>
      <p className="mt-8 leading-relaxed text-ink-soft">{t("privacyBody")}</p>
    </div>
  );
}
