import type { Metadata } from "next";
import { Fraunces, Outfit, Noto_Sans_SC, Noto_Sans_KR, Noto_Sans_Hebrew } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, rtlLocales, type Locale } from "@/i18n/routing";
import { fetchPublic } from "@/lib/api";
import { siteCopy } from "@/lib/site-copy";
import { absoluteSiteUrl, languageAlternates, ogLocale } from "@/lib/seo";
import { organizationJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ContactDock } from "@/components/ContactDock";
import "../globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const notoSc = Noto_Sans_SC({
  variable: "--font-noto-sc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoKr = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoHe = Noto_Sans_Hebrew({
  variable: "--font-noto-he",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  try {
    const data = await fetchPublic(locale);
    const settings = data.settings;
    const base = absoluteSiteUrl(settings);
    const title = `${settings.siteTitle} | Guided treks from Pokhara, Nepal`;
    const description = siteCopy(settings, "meta.homeDescription", settings.tagline);
    const ogImage = settings.ogImageUrl || settings.heroPosterUrl || "/heroes/hero-poster.jpg";
    return {
      metadataBase: new URL(base),
      title: { default: title, template: "%s" },
      description,
      icons: settings.faviconUrl ? [{ url: settings.faviconUrl }] : [{ url: "/logo.png" }],
      verification: settings.googleSiteVerification ? { google: settings.googleSiteVerification } : undefined,
      alternates: {
        canonical: locale === "en" ? base : `${base}/${locale}`,
        languages: languageAlternates("/", base),
      },
      openGraph: {
        type: "website",
        locale: ogLocale(locale),
        siteName: settings.siteTitle,
        title,
        description,
        url: locale === "en" ? base : `${base}/${locale}`,
        images: [{ url: ogImage }],
      },
      twitter: { card: "summary_large_image", title, description, images: [ogImage] },
    };
  } catch {
    return { title: "Upper Path Treks And Tours" };
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const data = await fetchPublic(locale).catch(() => null);
  const dir = rtlLocales.includes(locale as Locale) ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${fraunces.variable} ${outfit.variable} ${notoSc.variable} ${notoKr.variable} ${notoHe.variable} h-full antialiased`}
    >
      <body className="grain min-h-full bg-ivory text-ink">
        <NextIntlClientProvider messages={messages}>
          {data ? (
            <>
              <JsonLd data={organizationJsonLd(data.settings, locale)} />
              <SiteHeader settings={data.settings} />
              <main className="flex-1">{children}</main>
              <SiteFooter settings={data.settings} />
              <ContactDock settings={data.settings} />
            </>
          ) : (
            <main className="px-6 py-24 text-center">The trail is quiet. Please try again in a moment.</main>
          )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
