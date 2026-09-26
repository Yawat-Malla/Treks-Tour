"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import type { SiteSettings } from "@/lib/api";
import type { Locale } from "@/i18n/routing";
import { contactPrefill, orderedChannels, viberDeepLink } from "@/lib/contacts";
import { WeChatModal } from "./WeChatModal";

export function ContactActions({ settings }: { settings: SiteSettings }) {
  const t = useTranslations("contact");
  const locale = useLocale() as Locale;
  const [wechat, setWechat] = useState(false);
  const channels = orderedChannels(locale, settings, contactPrefill(locale, settings.siteTitle));
  const viberApp = viberDeepLink(settings);

  return (
    <>
      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {channels.map((ch) =>
          ch.kind === "wechat" ? (
            <button
              key={ch.id}
              type="button"
              onClick={() => setWechat(true)}
              className="rounded-2xl bg-snow p-5 text-start ring-1 ring-ink/10 transition hover:ring-copper"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-copper">{t("wechat")}</p>
              <p className="mt-2 font-serif text-2xl">{settings.wechatId}</p>
            </button>
          ) : (
            <a
              key={ch.id}
              href={ch.href}
              target={ch.id === "whatsapp" || ch.id === "viber" ? "_blank" : undefined}
              rel={ch.id === "whatsapp" || ch.id === "viber" ? "noopener noreferrer" : undefined}
              className="rounded-2xl bg-snow p-5 ring-1 ring-ink/10 transition hover:ring-copper"
              onClick={(e) => {
                if (!ch.href) return;
                if (ch.id === "email") {
                  e.preventDefault();
                  window.location.href = ch.href;
                  return;
                }
                if (ch.id === "viber" && viberApp) {
                  e.preventDefault();
                  const start = Date.now();
                  window.location.href = viberApp;
                  window.setTimeout(() => {
                    if (document.visibilityState === "visible" && Date.now() - start < 2000) {
                      window.location.assign(ch.href!);
                    }
                  }, 700);
                }
              }}
            >
              <p className="text-xs uppercase tracking-[0.18em] text-copper">{t(ch.id)}</p>
              <p className="mt-2 font-serif text-2xl">
                {ch.id === "email" ? settings.email : ch.id === "whatsapp" ? settings.whatsapp : settings.viber}
              </p>
            </a>
          ),
        )}
      </div>
      {wechat && <WeChatModal settings={settings} onClose={() => setWechat(false)} />}
    </>
  );
}
