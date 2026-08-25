import type { Metadata } from "next";
import { Fraunces, Outfit, Noto_Sans_SC, Noto_Sans_KR, Noto_Sans_Hebrew } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, rtlLocales, type Locale } from "@/i18n/routing";
import { fetchPublic } from "@/lib/api";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ContactDock } from "@/components/ContactDock";
import { TrustStrip } from "@/components/home/TrustStrip";
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
    return {
      title: {
        default: data.settings.siteTitle,
        template: `%s · ${data.settings.siteTitle}`,
      },
      description: data.settings.tagline,
      icons: data.settings.faviconUrl
        ? [{ url: data.settings.faviconUrl }]
        : [{ url: "/logo.png" }],
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
              <TrustStrip />
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
