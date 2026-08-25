import type { SiteSettings } from "@/lib/api";

/** Official wordmark in `apps/web/public/logo.png`. */
export const DEFAULT_LOGO_URL = "/logo.png";

export function BrandMark({
  settings,
  className = "",
}: {
  settings: SiteSettings;
  className?: string;
}) {
  const src = settings.logoUrl?.trim() || DEFAULT_LOGO_URL;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={settings.siteTitle}
      className={`h-11 w-auto object-contain object-left sm:h-12 ${className}`}
    />
  );
}
