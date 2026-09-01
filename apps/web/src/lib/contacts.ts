import type { Locale } from "@/i18n/routing";
import type { SiteSettings } from "@/lib/api";

export type Channel = {
  id: "wechat" | "whatsapp" | "viber" | "email";
  href?: string;
  kind: "link" | "wechat";
};

export function digits(value: string) {
  return (value || "").replace(/[^\d]/g, "");
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

export function whatsappHref(settings: Pick<SiteSettings, "whatsapp">, text = "") {
  const n = digits(settings.whatsapp);
  if (!n) return "";
  return text ? `https://wa.me/${n}?text=${text}` : `https://wa.me/${n}`;
}

export function viberHref(settings: Pick<SiteSettings, "viber">) {
  const n = digits(settings.viber);
  if (!n) return "";
  return `viber://chat?number=%2B${n}`;
}

export function emailHref(settings: Pick<SiteSettings, "email" | "siteTitle">, text = "") {
  const email = (settings.email || "").trim();
  if (!email) return "";
  const subject = encodeURIComponent(settings.siteTitle || "");
  if (!text) return `mailto:${email}?subject=${subject}`;
  return `mailto:${email}?subject=${subject}&body=${text}`;
}

export function orderedChannels(locale: Locale, settings: SiteSettings, text: string): Channel[] {
  const channels: Channel[] = [];
  const wa = whatsappHref(settings, text);
  const viber = viberHref(settings);
  const email = emailHref(settings, text);
  const wechat = (settings.wechatId || "").trim();

  const rest: Channel[] = [];
  if (wa) rest.push({ id: "whatsapp", href: wa, kind: "link" });
  if (viber) rest.push({ id: "viber", href: viber, kind: "link" });
  if (email) rest.push({ id: "email", href: email, kind: "link" });

  if (locale === "zh") {
    if (wechat) channels.push({ id: "wechat", kind: "wechat" });
    channels.push(...rest);
    return channels;
  }
  if (rest[0]) channels.push(rest[0]);
  if (wechat) channels.push({ id: "wechat", kind: "wechat" });
  channels.push(...rest.slice(1));
  return channels;
}
