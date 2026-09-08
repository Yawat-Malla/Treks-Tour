"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import type { SiteSettings } from "@/lib/api";
import { BrandMark } from "./BrandMark";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Search } from "lucide-react";

function isOverlayPath(pathname: string) {
  if (pathname === "/") return true;
  return ["/treks", "/rafting", "/activities", "/safaris", "/about", "/plan", "/prepare", "/contact", "/blog"].some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const overlay = isOverlayPath(pathname);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.chrome = overlay ? "overlay" : "solid";
    return () => {
      delete document.documentElement.dataset.chrome;
    };
  }, [overlay]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const links = [
    { href: "/treks" as const, label: t("treks") },
    { href: "/rafting" as const, label: t("rafting") },
    { href: "/activities" as const, label: t("activities") },
    { href: "/safaris" as const, label: t("safaris") },
    { href: "/blog" as const, label: t("blog") },
    { href: "/plan" as const, label: t("plan") },
    { href: "/about" as const, label: t("about") },
    { href: "/contact" as const, label: t("contact") },
  ];

  return (
    <header
      data-tone="solid"
      className={`site-header fixed inset-x-0 top-0 z-50 text-ink transition-shadow duration-300 ${
        scrolled ? "shadow-[0_10px_28px_color-mix(in_srgb,var(--ink)_12%,transparent)]" : ""
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
        <Link href="/" className="shrink-0">
          <BrandMark settings={settings} />
        </Link>
        <nav className="hidden items-center gap-3.5 text-base font-medium text-ink-soft lg:flex xl:gap-5 xl:text-[17px]">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition hover:text-pine">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/#search"
            className="hidden rounded-full p-2 text-ink-soft hover:bg-pine/12 hover:text-pine sm:inline-flex"
            aria-label={t("search")}
          >
            <Search className="h-5 w-5" />
          </Link>
          <LanguageSwitcher />
          <Link
            href="/book"
            className="whitespace-nowrap rounded-full bg-pine px-3.5 py-2 text-base font-medium text-ink ring-1 ring-gold/35 shadow-[0_8px_20px_color-mix(in_srgb,var(--pine)_28%,transparent)] transition hover:bg-pine-deep sm:px-4"
          >
            <span className="sm:hidden">{t("bookShort")}</span>
            <span className="hidden sm:inline">{t("book")}</span>
          </Link>
        </div>
      </div>
      <nav className="flex items-center gap-5 overflow-x-auto border-t border-pine/15 px-5 py-2 text-base text-ink-soft lg:hidden">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="shrink-0 py-1 hover:text-pine">
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
