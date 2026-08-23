"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useMemo, useState } from "react";
import type { Trip } from "@/lib/api";
import { apiUrl } from "@/lib/api";
import type { Locale } from "@/i18n/routing";

export function BookingForm({
  trips,
  initialSlug,
  initialKind,
  initialDate,
  initialPeople,
}: {
  trips: Trip[];
  initialSlug?: string;
  initialKind?: string;
  initialDate?: string;
  initialPeople?: number;
}) {
  const t = useTranslations("book");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const prefilled = trips.find((x) => x.slug === initialSlug);
  const startKind: "trek" | "rafting" =
    prefilled?.kind || (initialKind === "rafting" ? "rafting" : "trek");
  const readyFromHome = Boolean(prefilled && initialDate);
  const [step, setStep] = useState(readyFromHome ? 2 : 1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [kind, setKind] = useState<"trek" | "rafting">(startKind);
  const [form, setForm] = useState({
    trekId: prefilled?.id || trips.find((x) => x.kind === startKind)?.id || "",
    startDate: initialDate || "",
    groupSize: initialPeople && initialPeople > 0 ? initialPeople : 2,
    fullName: "",
    email: "",
    phone: "",
    nationality: "",
    message: "",
    addonTrekId: "",
    privateDeparture: false,
  });

  const pool = useMemo(() => trips.filter((x) => x.kind === kind), [trips, kind]);
  const trek = useMemo(() => trips.find((x) => x.id === form.trekId), [trips, form.trekId]);
  const seti = useMemo(() => trips.find((x) => x.slug === "seti-river-day"), [trips]);
  const showAddon = kind === "trek" && Boolean(seti);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function chooseKind(next: "trek" | "rafting") {
    setKind(next);
    const first = trips.find((x) => x.kind === next);
    setForm((f) => ({ ...f, trekId: first?.id || "", addonTrekId: next === "rafting" ? "" : f.addonTrekId }));
  }

  async function submit() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(apiUrl("/public/bookings"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trekId: form.trekId,
          startDate: form.startDate,
          groupSize: Number(form.groupSize),
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          nationality: form.nationality,
          message: form.message,
          locale,
          addonTrekId: form.addonTrekId || undefined,
          privateDeparture: form.privateDeparture,
        }),
      });
      if (!res.ok) throw new Error("fail");
      const data = await res.json();
      router.push(
        `/book/success?ref=${data.reference}&email=${encodeURIComponent(form.email)}&kind=${kind}`,
      );
    } catch {
      setError(t("error"));
    } finally {
      setBusy(false);
    }
  }

  const steps = [t("stepTrek"), t("stepYou"), t("stepReview")];

  return (
    <div className="mx-auto max-w-xl px-5 py-16 lg:px-8">
      <h1 className="font-serif text-5xl">{t("title")}</h1>
      <p className="mt-3 text-ink-soft">{t("lede")}</p>

      <ol className="mt-10 mb-8 grid grid-cols-3 gap-2">
        {steps.map((label, i) => (
          <li key={label} className="text-center">
            <div className={`h-1 rounded-full ${i + 1 <= step ? "bg-copper" : "bg-ink/10"}`} />
            <p className={`mt-2 text-xs ${i + 1 === step ? "text-ink" : "text-ink-soft"}`}>{label}</p>
          </li>
        ))}
      </ol>

      {step === 1 && (
        <div className="space-y-5">
          <fieldset>
            <legend className="text-sm text-ink-soft">{t("kind")}</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(["trek", "rafting"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => chooseKind(k)}
                  className={`rounded-2xl px-4 py-3 text-sm ring-1 ${
                    kind === k ? "bg-moss text-snow ring-moss" : "bg-snow ring-ink/10"
                  }`}
                >
                  {k === "trek" ? t("trekKind") : t("raftKind")}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="block">
            <span className="text-sm text-ink-soft">{kind === "rafting" ? t("raft") : t("trek")}</span>
            <select
              className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3"
              value={form.trekId}
              onChange={(e) => set("trekId", e.target.value)}
            >
              {pool.map((tr) => (
                <option key={tr.id} value={tr.id}>
                  {tr.name} · {tr.durationDays}d
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm text-ink-soft">{t("start")}</span>
            <input
              type="date"
              required
              className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3"
              value={form.startDate}
              onChange={(e) => set("startDate", e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm text-ink-soft">{t("group")}</span>
            <input
              type="number"
              min={1}
              max={20}
              className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3"
              value={form.groupSize}
              onChange={(e) => set("groupSize", Number(e.target.value))}
            />
          </label>
          {showAddon && seti && (
            <label className="flex items-start gap-3 rounded-2xl bg-snow p-4 ring-1 ring-ink/8">
              <input
                type="checkbox"
                className="mt-1"
                checked={form.addonTrekId === seti.id}
                onChange={(e) => set("addonTrekId", e.target.checked ? seti.id : "")}
              />
              <span>
                <span className="block text-sm font-medium">{t("addon")}</span>
                <span className="mt-1 block text-xs text-ink-soft">{t("addonHint")}</span>
              </span>
            </label>
          )}
          <label className="flex items-start gap-3 rounded-2xl bg-snow p-4 ring-1 ring-ink/8">
            <input
              type="checkbox"
              className="mt-1"
              checked={form.privateDeparture}
              onChange={(e) => set("privateDeparture", e.target.checked)}
            />
            <span>
              <span className="block text-sm font-medium">{t("private")}</span>
              <span className="mt-1 block text-xs text-ink-soft">{t("privateHint")}</span>
            </span>
          </label>
          <button
            type="button"
            disabled={!form.startDate || !form.trekId}
            onClick={() => setStep(2)}
            className="w-full rounded-full bg-copper py-3 text-snow disabled:opacity-40"
          >
            {t("next")}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          {(
            [
              ["fullName", t("name"), "text"],
              ["email", t("email"), "email"],
              ["phone", t("phone"), "tel"],
              ["nationality", t("nationality"), "text"],
            ] as const
          ).map(([key, label, type]) => (
            <label key={key} className="block">
              <span className="text-sm text-ink-soft">{label}</span>
              <input
                type={type}
                required
                className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3"
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
              />
            </label>
          ))}
          <label className="block">
            <span className="text-sm text-ink-soft">{t("message")}</span>
            <textarea
              rows={4}
              className="mt-1 w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3"
              placeholder={t("messageHint")}
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
            />
          </label>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="rounded-full px-5 py-3 text-ink-soft">
              {t("back")}
            </button>
            <button
              type="button"
              disabled={!form.fullName || !form.email || !form.phone || !form.nationality}
              onClick={() => setStep(3)}
              className="flex-1 rounded-full bg-copper py-3 text-snow disabled:opacity-40"
            >
              {t("next")}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <p className="text-sm text-ink-soft">{t("reviewLead")}</p>
          <dl className="space-y-2 rounded-[1.4rem] bg-snow p-5 text-sm ring-1 ring-ink/8">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">{kind === "rafting" ? t("raft") : t("trek")}</dt>
              <dd>{trek?.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">{t("start")}</dt>
              <dd>{form.startDate}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">{t("group")}</dt>
              <dd>{form.groupSize}</dd>
            </div>
            {form.addonTrekId && seti ? (
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">{t("addon")}</dt>
                <dd>{seti.name}</dd>
              </div>
            ) : null}
            {form.privateDeparture ? (
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">{t("private")}</dt>
                <dd>✓</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">{t("name")}</dt>
              <dd>{form.fullName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">{t("email")}</dt>
              <dd>{form.email}</dd>
            </div>
          </dl>
          {error && <p className="text-sm text-copper">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(2)} className="rounded-full px-5 py-3 text-ink-soft">
              {t("back")}
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={busy}
              className="flex-1 rounded-full bg-copper py-3 text-snow"
            >
              {busy ? t("sending") : t("submit")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
