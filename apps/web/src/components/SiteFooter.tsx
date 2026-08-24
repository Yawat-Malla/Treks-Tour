import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { SiteSettings } from "@/lib/api";
import { BrandMark } from "./BrandMark";
import { Phone, Mail, MapPin } from "lucide-react";

export async function SiteFooter({ settings }: { settings: SiteSettings }) {
  const t = await getTranslations();

  return (
    <footer className="bg-ivory text-ink">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <BrandMark settings={{ ...settings, logoUrl: null }} />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">{t("footer.blurb")}</p>
          <div className="mt-4 flex gap-2">
            <span className="h-8 w-8 rounded-full ring-1 ring-ink/15" aria-hidden />
            <span className="h-8 w-8 rounded-full ring-1 ring-ink/15" aria-hidden />
            <span className="h-8 w-8 rounded-full ring-1 ring-ink/15" aria-hidden />
          </div>
        </div>
        <nav className="flex flex-col gap-2 text-sm">
          <p className="font-semibold">{t("footer.company")}</p>
          <Link href="/about" className="text-ink-soft hover:text-sky">
            {t("nav.about")}
          </Link>
          <Link href="/plan" className="text-ink-soft hover:text-sky">
            {t("nav.plan")}
          </Link>
          <Link href="/prepare" className="text-ink-soft hover:text-sky">
            {t("nav.prepare")}
          </Link>
          <Link href="/contact" className="text-ink-soft hover:text-sky">
            {t("nav.contact")}
          </Link>
        </nav>
        <nav className="flex flex-col gap-2 text-sm">
          <p className="font-semibold">{t("footer.support")}</p>
          <Link href="/contact" className="text-ink-soft hover:text-sky">
            {t("nav.contact")}
          </Link>
          <Link href="/privacy" className="text-ink-soft hover:text-sky">
            {t("footer.privacy")}
          </Link>
          <Link href="/terms" className="text-ink-soft hover:text-sky">
            {t("footer.terms")}
          </Link>
        </nav>
        <div className="flex flex-col gap-3 text-sm">
          <p className="font-semibold">{t("footer.topTrips")}</p>
          <Link href="/treks" className="text-ink-soft hover:text-sky">
            {t("nav.treks")}
          </Link>
          <Link href="/rafting" className="text-ink-soft hover:text-sky">
            {t("nav.rafting")}
          </Link>
          <p className="mt-2 inline-flex items-start gap-2 text-ink-soft">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky" />
            {settings.address}
          </p>
          <p className="inline-flex items-center gap-2 text-ink-soft">
            <Phone className="h-4 w-4 text-sky" />
            {settings.phone}
          </p>
          <p className="inline-flex items-center gap-2 text-ink-soft">
            <Mail className="h-4 w-4 text-sky" />
            {settings.email}
          </p>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-ink/8 px-5 py-5 text-xs text-ink-soft lg:px-8">
        <span>
          {settings.siteTitle} · {t("footer.rights")}
        </span>
        <span className="flex gap-4">
          <Link href="/privacy">{t("footer.privacy")}</Link>
          <Link href="/terms">{t("footer.terms")}</Link>
        </span>
      </div>
    </footer>
  );
}
