"use client";

import { useEffect, useState } from "react";
import { cmsFetch } from "@/lib/cms";
import { digits, emailHref, viberHref, whatsappHref } from "@/lib/contacts";
import {
  StudioCard,
  StudioCopy,
  StudioField,
  StudioPageHeader,
  StudioSaveBar,
  StudioUpload,
  StudioViewSite,
} from "./studio-ui";

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
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    cmsFetch("/cms/settings").then(setS);
  }, []);

  if (!s) return <p className="text-lg text-ink-soft">Loading name and phone…</p>;
  const settings = s;

  function patch<K extends keyof Settings>(key: K, value: Settings[K]) {
    setS((prev) => prev && { ...prev, [key]: value });
  }

  async function save() {
    setBusy(true);
    await cmsFetch("/cms/settings", {
      method: "PATCH",
      body: JSON.stringify({
        siteTitle: settings.siteTitle,
        logoUrl: settings.logoUrl,
        faviconUrl: settings.faviconUrl,
        whatsapp: settings.whatsapp,
        viber: settings.viber,
        email: settings.email,
        wechatId: settings.wechatId,
        wechatQrUrl: settings.wechatQrUrl,
        address: settings.address,
        phone: settings.phone,
        trekkerCount: settings.trekkerCount,
        yearsGuiding: settings.yearsGuiding,
      }),
    });
    setBusy(false);
    setSaved("Saved just now. Guests will see this on the website.");
  }

  const waUrl = whatsappHref(s);
  const vbUrl = viberHref(s);
  const mailUrl = emailHref(s);

  return (
    <div className="max-w-2xl space-y-6">
      <StudioPageHeader
        title="Name, logo & phone"
        hint="This is the company name, pictures, and the floating buttons guests tap to message you."
        action={<StudioViewSite href="/" />}
      />

      <StudioCard className="space-y-5">
        <StudioField label="Company name" help="Shown in the header and browser tab.">
          <input className="studio-input" value={s.siteTitle} onChange={(e) => patch("siteTitle", e.target.value)} />
        </StudioField>
        <div className="grid gap-6 sm:grid-cols-2">
          <StudioUpload label="Logo" help="The picture in the top corner of the website." preview={s.logoUrl} onUrl={(url) => patch("logoUrl", url)} />
          <StudioUpload
            label="Tiny tab icon"
            help="The small picture in the browser tab. Square works best."
            preview={s.faviconUrl}
            onUrl={(url) => patch("faviconUrl", url)}
          />
        </div>
      </StudioCard>

      <StudioCard className="space-y-5">
        <h2 className="font-serif text-2xl">Floating buttons</h2>
        <p className="text-[15px] text-ink-soft">Leave a box empty to hide that button. Guests tap these to chat with you.</p>

        <StudioField
          label="WhatsApp number"
          help="Country code and number, no plus sign. Example: 9779800000000"
        >
          <input className="studio-input" value={s.whatsapp} onChange={(e) => patch("whatsapp", e.target.value)} />
        </StudioField>
        <p className="flex flex-wrap items-center gap-2 text-[15px] text-ink-soft">
          <span>{waUrl ? `Opens ${waUrl}` : "Empty — WhatsApp button hidden"}</span>
          {waUrl ? <StudioCopy text={waUrl} label="Copy WhatsApp link" /> : null}
        </p>

        <StudioField label="Viber number" help="Same as WhatsApp: country code, no plus sign.">
          <input className="studio-input" value={s.viber} onChange={(e) => patch("viber", e.target.value)} />
        </StudioField>
        <p className="text-[15px] text-ink-soft">{vbUrl ? `Opens ${vbUrl}` : "Empty — Viber button hidden"}</p>

        <StudioField label="Email" help="Guests open a mail draft to this address.">
          <input className="studio-input" value={s.email} onChange={(e) => patch("email", e.target.value)} />
        </StudioField>
        <p className="flex flex-wrap items-center gap-2 text-[15px] text-ink-soft">
          <span>{mailUrl ? `Opens ${mailUrl}` : "Empty — Email button hidden"}</span>
          {s.email.trim() ? <StudioCopy text={s.email} label="Copy email" /> : null}
        </p>

        <StudioField label="WeChat ID" help="Guests copy this ID. WeChat is not a web link.">
          <input className="studio-input" value={s.wechatId} onChange={(e) => patch("wechatId", e.target.value)} />
        </StudioField>
        <p className="text-[15px] text-ink-soft">
          {s.wechatId.trim() ? "Opens a box so guests can copy the ID or scan the code." : "Empty — WeChat button hidden"}
        </p>
        <StudioUpload label="WeChat QR code" help="Optional picture guests can scan." preview={s.wechatQrUrl} onUrl={(url) => patch("wechatQrUrl", url)} />

        <StudioField label="Phone (shown on the site)" help="For the footer and About page. Does not open a chat.">
          <input className="studio-input" value={s.phone} onChange={(e) => patch("phone", e.target.value)} />
        </StudioField>
        <StudioField label="Address">
          <input className="studio-input" value={s.address} onChange={(e) => patch("address", e.target.value)} />
        </StudioField>
        <p className="text-[15px] text-ink-soft">
          Digits we will use: WhatsApp {digits(s.whatsapp) || "—"} · Viber {digits(s.viber) || "—"}
        </p>
      </StudioCard>

      <StudioCard className="grid gap-5 sm:grid-cols-2">
        <StudioField label="Walkers guided" help="The number on the homepage.">
          <input
            type="number"
            className="studio-input"
            value={s.trekkerCount}
            onChange={(e) => patch("trekkerCount", Number(e.target.value))}
          />
        </StudioField>
        <StudioField label="Years guiding">
          <input
            type="number"
            className="studio-input"
            value={s.yearsGuiding}
            onChange={(e) => patch("yearsGuiding", Number(e.target.value))}
          />
        </StudioField>
      </StudioCard>

      <StudioSaveBar onSave={save} busy={busy} saved={saved} />
    </div>
  );
}
