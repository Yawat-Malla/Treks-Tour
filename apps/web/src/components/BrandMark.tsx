import type { SiteSettings } from "@/lib/api";

export function BrandMark({
  settings,
  className = "",
}: {
  settings: SiteSettings;
  className?: string;
}) {
  if (settings.logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={settings.logoUrl} alt={settings.siteTitle} className={`h-9 w-auto ${className}`} />
    );
  }
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-8 w-8 text-moss group-[.text-snow]:text-snow" aria-hidden>
        <path
          fill="currentColor"
          d="M20 4 4 34h8l8-14 8 14h8L20 4zm0 18-3 6h6l-3-6z"
        />
      </svg>
      <span className="font-serif text-[1.15rem] font-medium tracking-tight">{settings.siteTitle}</span>
    </span>
  );
}
