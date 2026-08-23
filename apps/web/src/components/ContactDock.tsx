"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import type { SiteSettings } from "@/lib/api";
import type { Locale } from "@/i18n/routing";
import { contactPrefill, orderedChannels } from "@/lib/contacts";
import { WeChatModal } from "./WeChatModal";
import { MessageCircle } from "lucide-react";

function ChannelGlyph({ id }: { id: "whatsapp" | "viber" | "wechat" | "email" }) {
  const colors = {
    whatsapp: "bg-[#25D366]",
    viber: "bg-[#7360F2]",
    wechat: "bg-[#07C160]",
    email: "bg-sky",
  };
  const letters = { whatsapp: "W", viber: "V", wechat: "微", email: "@" };
  return (
    <span className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-snow shadow-lg ${colors[id]}`}>
      {letters[id]}
    </span>
  );
}

export function ContactDock({ settings }: { settings: SiteSettings }) {
  const t = useTranslations("contact");
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState(false);
  const [wechat, setWechat] = useState(false);
  const channels = orderedChannels(locale, settings, contactPrefill(locale, settings.siteTitle));

  return (
    <>
      <div className="fixed bottom-24 end-5 z-50 flex flex-col items-end gap-2 pb-[env(safe-area-inset-bottom)] md:bottom-8 md:end-8">
        {open && (
          <div className="mb-1 flex flex-col items-end gap-2">
            {channels.map((ch) =>
              ch.kind === "wechat" ? (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setWechat(true)}
                  className="transition hover:scale-105"
                  aria-label={t("wechat")}
                >
                  <ChannelGlyph id="wechat" />
                </button>
              ) : (
                <a
                  key={ch.id}
                  href={ch.href || "#"}
                  className="transition hover:scale-105"
                  aria-label={t(ch.id)}
                >
                  <ChannelGlyph id={ch.id} />
                </a>
              ),
            )}
          </div>
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-moss text-snow shadow-[0_12px_32px_rgba(47,111,237,0.4)] transition hover:bg-sky"
          aria-expanded={open}
          aria-label={t("dock")}
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>
      {wechat && <WeChatModal settings={settings} onClose={() => setWechat(false)} />}
    </>
  );
}
