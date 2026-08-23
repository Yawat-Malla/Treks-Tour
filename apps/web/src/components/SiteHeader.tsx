import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { SiteSettings } from "@/lib/api";
import { BrandMark } from "./BrandMark";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Search, Heart, User } from "lucide-react";

export async function SiteHeader({ settings }: { settings: SiteSettings }) {
  const t = await getTranslations("nav");

  const links = [
    { href: "/treks" as const, label: t("treks") },
    { href: "/rafting" as const, label: t("rafting") },
    { href: "/plan" as const, label: t("plan") },
    { href: "/about" as const, label: t("about") },
    { href: "/contact" as const, label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-ink/8 bg-snow/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
        <Link href="/" className="shrink-0 text-ink">
          <BrandMark settings={settings} />
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-ink-soft lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition hover:text-sky">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <a href="#" className="hidden rounded-full p-2 text-ink-soft hover:bg-ivory hover:text-sky sm:inline-flex" aria-label={t("search")}>
            <Search className="h-4 w-4" />
          </a>
          <a href="#" className="hidden rounded-full p-2 text-ink-soft hover:bg-ivory hover:text-sky sm:inline-flex" aria-label={t("wishlist")}>
            <Heart className="h-4 w-4" />
          </a>
          <a href="#" className="hidden rounded-full p-2 text-ink-soft hover:bg-ivory hover:text-sky sm:inline-flex" aria-label={t("account")}>
            <User className="h-4 w-4" />
          </a>
          <LanguageSwitcher />
          <Link
            href="/book"
            className="whitespace-nowrap rounded-2xl bg-ink px-3 py-2 text-sm font-medium text-snow shadow-[0_8px_24px_rgba(11,31,58,0.22)] transition hover:bg-moss-deep sm:px-4"
          >
            <span className="sm:hidden">{t("bookShort")}</span>
            <span className="hidden sm:inline">{t("book")}</span>
          </Link>
        </div>
      </div>
      <nav className="flex items-center gap-6 overflow-x-auto border-t border-ink/6 px-5 py-2 text-sm text-ink-soft lg:hidden">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="shrink-0 py-1">
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
