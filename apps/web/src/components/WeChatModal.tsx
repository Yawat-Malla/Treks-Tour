"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import type { SiteSettings } from "@/lib/api";

export function WeChatModal({
  settings,
  onClose,
}: {
  settings: SiteSettings;
  onClose: () => void;
}) {
  const t = useTranslations("contact");
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(settings.wechatId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/50 p-5" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-3xl bg-snow p-6 text-ink shadow-[var(--shadow)]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs uppercase tracking-[0.18em] text-copper">{t("wechat")}</p>
        <p className="mt-2 font-serif text-2xl">{settings.wechatId}</p>
        <p className="mt-2 text-sm text-ink-soft">{t("wechatHint")}</p>
        {settings.wechatQrUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={settings.wechatQrUrl} alt="WeChat QR" className="mx-auto mt-4 h-44 w-44 rounded-xl object-cover" />
        )}
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={copy}
            className="flex-1 rounded-full bg-moss py-2.5 text-sm text-snow"
          >
            {copied ? t("wechatCopied") : t("wechatCopy")}
          </button>
          <button type="button" onClick={onClose} className="rounded-full px-4 text-sm text-ink-soft">
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
