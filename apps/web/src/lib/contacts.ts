import type { Locale } from "@/i18n/routing";
import type { SiteSettings } from "@/lib/api";

export type Channel = {
  id: "wechat" | "whatsapp" | "viber" | "email";
  href?: string;
  kind: "link" | "wechat";
};

function digits(value: string) {
  return value.replace(/[^\d]/g, "");
}

export function contactPrefill(locale: Locale, title: string) {
  const map: Record<Locale, string> = {
    en: `Hello — I would like to ask about ${title} treks from Pokhara.`,
    zh: `你好，我想咨询从博卡拉出发的${title}徒步。`,
    ko: `안녕하세요. 포카라에서 출발하는 ${title} 트레킹을 문의하고 싶습니다.`,
    he: `שלום, אשמח לשאול על טרקי ${title} מפוקרה.`,
  };
  return encodeURIComponent(map[locale]);
}

export function orderedChannels(locale: Locale, settings: SiteSettings, text: string): Channel[] {
  const wa = `https://wa.me/${digits(settings.whatsapp)}?text=${text}`;
  const viber = `viber://chat?number=%2B${digits(settings.viber)}`;
  const email = `mailto:${settings.email}?subject=${encodeURIComponent(settings.siteTitle)}&body=${text}`;
  const wechat: Channel = { id: "wechat", kind: "wechat" };
  const rest: Channel[] = [
    { id: "whatsapp", href: wa, kind: "link" },
    { id: "viber", href: viber, kind: "link" },
    { id: "email", href: email, kind: "link" },
  ];
  if (locale === "zh") return [wechat, ...rest];
  return [rest[0], wechat, rest[1], rest[2]];
}

export function whatsappHref(settings: SiteSettings, text: string) {
  return `https://wa.me/${digits(settings.whatsapp)}?text=${text}`;
}
