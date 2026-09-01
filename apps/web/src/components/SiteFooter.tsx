import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { SiteSettings } from "@/lib/api";
import { siteCopy } from "@/lib/site-copy";
import { BrandMark } from "./BrandMark";
import { FooterRidge } from "./ui/SceneMarks";
import { Phone, Mail, MapPin } from "lucide-react";

export async function SiteFooter({ settings }: { settings: SiteSettings }) {
  const t = await getTranslations();

  return (
    <footer className="relative bg-ivory text-snow">
      <FooterRidge />
      <div className="bg-ink">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <BrandMark settings={settings} inverted />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-snow/65">{siteCopy(settings, "footer.blurb", () => t("footer.blurb"))}</p>
            <p className="mt-4 inline-flex items-start gap-2 text-sm text-snow/65">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-river" />
              {settings.address}
            </p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-snow/65">
              <Phone className="h-4 w-4 text-river" />
              {settings.phone}
            </p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-snow/65">
              <Mail className="h-4 w-4 text-river" />
              {settings.email}
            </p>
          </div>
          <nav className="flex flex-col gap-2 text-sm">
            <p className="font-semibold text-snow">{t("footer.company")}</p>
            <Link href="/about" className="text-snow/65 hover:text-snow">
              {t("nav.about")}
            </Link>
            <Link href="/plan" className="text-snow/65 hover:text-snow">
              {t("nav.plan")}
            </Link>
            <Link href="/prepare" className="text-snow/65 hover:text-snow">
              {t("nav.prepare")}
            </Link>
            <Link href="/contact" className="text-snow/65 hover:text-snow">
              {t("nav.contact")}
            </Link>
            <Link href="/blog" className="text-snow/65 hover:text-snow">
              {t("nav.blog")}
            </Link>
          </nav>
          <nav className="flex flex-col gap-2 text-sm">
            <p className="font-semibold text-snow">{t("footer.services")}</p>
            <Link href="/book" className="text-snow/65 hover:text-snow">
              {t("nav.book")}
            </Link>
            <Link href="/contact" className="text-snow/65 hover:text-snow">
              {t("nav.contact")}
            </Link>
            <Link href="/privacy" className="text-snow/65 hover:text-snow">
              {t("footer.privacy")}
            </Link>
            <Link href="/terms" className="text-snow/65 hover:text-snow">
              {t("footer.terms")}
            </Link>
          </nav>
          <div className="flex flex-col gap-2 text-sm">
            <p className="font-semibold text-snow">{t("footer.experiences")}</p>
            <Link href="/treks" className="text-snow/65 hover:text-snow">
              {t("nav.treks")}
            </Link>
            <Link href="/rafting" className="text-snow/65 hover:text-snow">
              {t("nav.rafting")}
            </Link>
            <Link href="/activities" className="text-snow/65 hover:text-snow">
              {t("nav.activities")}
            </Link>
            <Link href="/safaris" className="text-snow/65 hover:text-snow">
              {t("nav.safaris")}
            </Link>
          </div>
        </div>
        <div className="border-t border-snow/10 bg-[#071525]">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs text-snow/55 lg:px-8">
            <span>
              {settings.siteTitle} · {t("footer.rights")}
            </span>
            <span className="flex gap-4">
              <Link href="/privacy">{t("footer.privacy")}</Link>
              <Link href="/terms">{t("footer.terms")}</Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
