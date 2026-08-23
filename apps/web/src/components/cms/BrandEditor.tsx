"use client";

import { useEffect, useState } from "react";
import { cmsFetch, uploadFile } from "@/lib/cms";

type Settings = {
  siteTitle: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  whatsapp: string;
  viber: string;
  email: string;
  wechatId: string;
  wechatQrUrl: string | null;
  address: string;
  phone: string;
  trekkerCount: number;
  yearsGuiding: number;
};

export function BrandEditor() {
  const [s, setS] = useState<Settings | null>(null);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    cmsFetch("/cms/settings").then(setS);
  }, []);

  if (!s) return <p>Loading…</p>;

  function patch<K extends keyof Settings>(key: K, value: Settings[K]) {
    setS((prev) => prev && { ...prev, [key]: value });
  }

  async function save() {
    await cmsFetch("/cms/settings", { method: "PATCH", body: JSON.stringify(s) });
    setSaved("Saved. Title and logo update on the public site within a minute.");
  }

  async function onFile(key: "logoUrl" | "faviconUrl" | "wechatQrUrl", file?: File) {
    if (!file) return;
    const { url } = await uploadFile(file);
    patch(key, url);
  }

  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="font-serif text-4xl">Brand & contact</h1>
      <p className="text-sm text-ink-soft">
        Site title and logo appear in the header, browser tab, and share preview. Contact channels power WhatsApp, Viber, email and WeChat across the site.
      </p>
      <label className="block">
        <span className="text-sm text-ink-soft">Site title</span>
        <input
          className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3"
          value={s.siteTitle}
          onChange={(e) => patch("siteTitle", e.target.value)}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          Logo
          <input type="file" accept="image/*" className="mt-1 block w-full" onChange={(e) => onFile("logoUrl", e.target.files?.[0])} />
          {s.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.logoUrl} alt="" className="mt-2 h-12" />
          )}
        </label>
        <label className="block text-sm">
          Favicon
          <input type="file" accept="image/*" className="mt-1 block w-full" onChange={(e) => onFile("faviconUrl", e.target.files?.[0])} />
        </label>
      </div>
      {(
        [
          ["whatsapp", "WhatsApp number (country code, no +)"],
          ["viber", "Viber number"],
          ["email", "Email"],
          ["wechatId", "WeChat ID"],
          ["phone", "Phone (display)"],
          ["address", "Address"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="block">
          <span className="text-sm text-ink-soft">{label}</span>
          <input
            className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3"
            value={s[key]}
            onChange={(e) => patch(key, e.target.value)}
          />
        </label>
      ))}
      <label className="block text-sm">
        WeChat QR
        <input type="file" accept="image/*" className="mt-1 block w-full" onChange={(e) => onFile("wechatQrUrl", e.target.files?.[0])} />
        {s.wechatQrUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.wechatQrUrl} alt="" className="mt-2 h-28" />
        )}
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label>
          <span className="text-sm text-ink-soft">Walkers guided</span>
          <input
            type="number"
            className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3"
            value={s.trekkerCount}
            onChange={(e) => patch("trekkerCount", Number(e.target.value))}
          />
        </label>
        <label>
          <span className="text-sm text-ink-soft">Years guiding</span>
          <input
            type="number"
            className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3"
            value={s.yearsGuiding}
            onChange={(e) => patch("yearsGuiding", Number(e.target.value))}
          />
        </label>
      </div>
      <button type="button" onClick={save} className="rounded-full bg-copper px-6 py-2.5 text-snow">
        Save brand
      </button>
      {saved && <p className="text-sm text-moss">{saved}</p>}
    </div>
  );
}
