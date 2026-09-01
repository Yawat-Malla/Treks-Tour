import { DEFAULT_ASSOCIATIONS, DEFAULT_CHIPS, type AssociationLogo, type ChipCard } from "@/cms/page-catalog";
import type { SiteSettings } from "@/lib/api";

const COLUMN_KEYS: Record<string, keyof Pick<SiteSettings, "tagline" | "heroHeadline" | "heroSubhead" | "introTitle" | "introBody" | "aboutTitle" | "aboutBody">> = {
  tagline: "tagline",
  "hero.headline": "heroHeadline",
  "hero.lede": "heroSubhead",
  "intro.title": "introTitle",
  "intro.body": "introBody",
  "about.title": "aboutTitle",
  "about.body": "aboutBody",
};

export function siteCopy(settings: SiteSettings, key: string, fallback: string | (() => string) = ""): string {
  const fromPages = settings.pages?.[key];
  const col = COLUMN_KEYS[key];
  const colValue = col ? settings[col] : "";
  const source = fromPages ? "pages" : colValue ? "column" : "fallback";
  // #region agent log
  fetch("http://127.0.0.1:7250/ingest/4f909da6-e362-4dd0-8c11-1048ad8b271f", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "4acaf2" },
    body: JSON.stringify({
      sessionId: "4acaf2",
      runId: "post-fix",
      hypothesisId: "A",
      location: "site-copy.ts:siteCopy",
      message: "siteCopy lookup",
      data: {
        key,
        hasPages: Boolean(fromPages),
        hasColumn: Boolean(colValue),
        source,
        willCallT: source === "fallback" && typeof fallback === "function",
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  if (fromPages) return fromPages;
  if (colValue) return colValue;
  return typeof fallback === "function" ? fallback() : fallback;
}

export function fillCopy(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, name: string) =>
    vars[name] === undefined || vars[name] === null ? `{${name}}` : String(vars[name]),
  );
}

export function siteChips(settings: SiteSettings): ChipCard[] {
  return settings.chips?.length ? settings.chips : DEFAULT_CHIPS;
}

export function siteAssociations(settings: SiteSettings): AssociationLogo[] {
  return settings.associations?.length ? settings.associations : DEFAULT_ASSOCIATIONS;
}
