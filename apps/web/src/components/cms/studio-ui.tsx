"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { LOCALE_LABELS, LOCALES, type StudioLocale } from "@/cms/studio-nav";
import { uploadFile } from "@/lib/cms";

export function matchesQuery(query: string, ...parts: Array<string | number | null | undefined>) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return parts
    .filter((p) => p !== null && p !== undefined && p !== "")
    .join(" ")
    .toLowerCase()
    .includes(q);
}

export function StudioPageHeader({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-serif text-4xl tracking-tight text-ink sm:text-5xl">{title}</h1>
        {hint && <p className="mt-2 max-w-xl text-base text-ink-soft">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

export function StudioCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`studio-card p-5 sm:p-6 ${className}`}>{children}</section>;
}

export function StudioField({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-base font-semibold text-ink">{label}</span>
      {help && <span className="mt-0.5 block text-[15px] leading-snug text-ink-soft">{help}</span>}
      <div className="mt-2">{children}</div>
    </label>
  );
}

export function StudioLocaleTabs({
  value,
  onChange,
}: {
  value: StudioLocale;
  onChange: (locale: StudioLocale) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Language">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          role="tab"
          aria-selected={value === l}
          onClick={() => onChange(l)}
          className={`studio-btn min-h-12 px-4 text-base ${value === l ? "studio-btn-primary" : "studio-btn-ghost"}`}
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  );
}

export function StudioSaveBar({
  onSave,
  busy,
  saved,
  extra,
}: {
  onSave: () => void;
  busy?: boolean;
  saved?: string;
  extra?: ReactNode;
}) {
  return (
    <div className="studio-savebar">
      <p className="text-base text-ink-soft">{saved || "Your changes are not saved until you press the blue button."}</p>
      <div className="flex flex-wrap items-center gap-2">
        {extra}
        <button type="button" disabled={busy} onClick={onSave} className="studio-btn studio-btn-primary">
          {busy ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

export function StudioUpload({
  label,
  help,
  accept = "image/*",
  preview,
  onUrl,
}: {
  label: string;
  help?: string;
  accept?: string;
  preview?: string | null;
  onUrl: (url: string) => void;
}) {
  return (
    <div>
      <p className="text-base font-semibold text-ink">{label}</p>
      {help && <p className="mt-0.5 text-[15px] text-ink-soft">{help}</p>}
      {preview && accept.startsWith("image") && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className="mt-3 h-36 w-full rounded-2xl object-cover ring-1 ring-sky/15" />
      )}
      {preview && accept.startsWith("video") && <p className="mt-2 break-all text-[15px] text-ink-soft">{preview}</p>}
      <label className="studio-btn studio-btn-ghost mt-3 cursor-pointer">
        {preview ? "Change file" : "Choose photo"}
        <input
          type="file"
          accept={accept}
          className="sr-only"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const { url } = await uploadFile(file);
            onUrl(url);
            e.target.value = "";
          }}
        />
      </label>
    </div>
  );
}

export function StudioStatus({ live }: { live: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
        live ? "bg-river/15 text-river" : "bg-gold/25 text-ink"
      }`}
    >
      {live ? "Live on the website" : "Hidden"}
    </span>
  );
}

export function StudioCheck({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center gap-3 text-base">
      <input
        type="checkbox"
        className="h-5 w-5 accent-sky"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {children}
    </label>
  );
}

export function StudioSearch({
  value,
  onChange,
  placeholder,
  label = "Search",
  kind = "list",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label?: string;
  kind?: "jump" | "list";
}) {
  return (
    <label className="block min-w-[16rem] flex-1">
      <span className="sr-only">{label}</span>
      <div className="relative">
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="studio-input pe-24"
          data-studio-search={kind}
        />
        {value && (
          <button
            type="button"
            className="absolute end-2 top-1/2 min-h-10 -translate-y-1/2 rounded-full px-3 text-[15px] font-semibold text-sky"
            onClick={() => onChange("")}
          >
            Clear
          </button>
        )}
      </div>
    </label>
  );
}

export function StudioFilters({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { id: string; label: string; count?: number }[];
}) {
  return (
    <div>
      <p className="mb-2 text-[15px] font-semibold text-ink">{label}</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((opt) => {
          const on = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(opt.id)}
              className={`studio-btn min-h-12 px-4 text-base ${on ? "studio-btn-primary" : "studio-btn-ghost"}`}
            >
              {opt.label}
              {typeof opt.count === "number" ? ` (${opt.count})` : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function StudioEmpty({ children }: { children: ReactNode }) {
  return (
    <div className="studio-card p-8 text-center text-lg text-ink-soft">
      {children}
    </div>
  );
}

export function StudioCount({ shown, total, word }: { shown: number; total: number; word: string }) {
  if (shown === total) {
    return (
      <p className="text-[15px] text-ink-soft">
        {total} {word}
      </p>
    );
  }
  return (
    <p className="text-[15px] text-ink-soft">
      Showing {shown} of {total} {word}
    </p>
  );
}

export function StudioCopy({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => setDone(false), 1600);
    return () => window.clearTimeout(t);
  }, [done]);
  if (!text) return null;
  return (
    <button
      type="button"
      className="studio-btn studio-btn-ghost min-h-12 px-4 text-base"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
        } catch {
          setDone(false);
        }
      }}
    >
      {done ? "Copied" : label}
    </button>
  );
}

export function StudioViewSite({ href, label = "See on website" }: { href: string; label?: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="studio-btn studio-btn-ghost">
      {label}
    </a>
  );
}
