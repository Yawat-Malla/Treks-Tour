import { DEFAULT_ASSOCIATIONS, DEFAULT_CHIPS, type AssociationLogo, type ChipCard } from "@/cms/page-catalog";
import type { SiteSettings } from "@/lib/api";
import { chipHref } from "@/lib/regions";

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
  const chips = settings.chips?.length ? settings.chips : DEFAULT_CHIPS;
  return chips.map((chip) => ({ ...chip, href: chipHref(chip.id) }));
}

export function siteAssociations(settings: SiteSettings): AssociationLogo[] {
  return settings.associations?.length ? settings.associations : DEFAULT_ASSOCIATIONS;
}
