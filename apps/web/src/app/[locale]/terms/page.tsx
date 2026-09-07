import { getLocale, getTranslations } from "next-intl/server";
import { fetchPublic } from "@/lib/api";
import { siteCopy } from "@/lib/site-copy";
import { publicMetadata } from "@/lib/page-metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { settings } = await fetchPublic(locale);
  return publicMetadata(
    locale,
    "/terms",
    siteCopy(settings, "legal.termsTitle", "Terms | Upper Path Treks"),
    siteCopy(settings, "legal.termsBody", "Booking terms for guided treks from Pokhara.").slice(0, 160),
  );
}

export default async function TermsPage() {
  const locale = await getLocale();
  const t = await getTranslations("legal");
  const { settings } = await fetchPublic(locale);
  return (
    <div className="mx-auto max-w-2xl px-5 py-20 lg:px-8">
      <h1 className="font-serif text-5xl">{siteCopy(settings, "legal.termsTitle", () => t("termsTitle"))}</h1>
      <p className="mt-8 leading-relaxed text-ink-soft">{siteCopy(settings, "legal.termsBody", () => t("termsBody"))}</p>
    </div>
  );
}
