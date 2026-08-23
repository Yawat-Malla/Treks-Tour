"use client";

import { useEffect, useState } from "react";
import { cmsFetch } from "@/lib/cms";

type Booking = {
  id: string;
  reference: string;
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  startDate: string;
  groupSize: number;
  message: string | null;
  status: string;
  staffNotes: string | null;
  locale: string;
  trek: { kind?: string; translations: { name: string }[] };
  addon: { translations: { name: string }[] } | null;
  privateDeparture: boolean;
};

export function BookingsInbox() {
  const [rows, setRows] = useState<Booking[] | null>(null);

  useEffect(() => {
    cmsFetch("/cms/bookings").then(setRows);
  }, []);

  async function update(id: string, data: Partial<Booking>) {
    const saved = await cmsFetch(`/cms/bookings/${id}`, { method: "PATCH", body: JSON.stringify(data) });
    setRows((all) => all!.map((r) => (r.id === id ? { ...r, ...saved } : r)));
  }

  if (!rows) return <p>Loading…</p>;

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-4xl">Bookings</h1>
      <p className="mt-2 text-sm text-ink-soft">{rows.length} requests. Guests never created accounts.</p>
      <ul className="mt-8 space-y-4">
        {rows.map((b) => (
          <li key={b.id} className="rounded-2xl bg-snow p-5 ring-1 ring-ink/8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-serif text-xl">
                {b.reference} · {b.trek.translations[0]?.name}
                {b.trek.kind === "rafting" ? " (raft)" : ""}
                {b.addon ? ` + ${b.addon.translations[0]?.name}` : ""}
                {b.privateDeparture ? " · private" : ""}
              </p>
              <select
                value={b.status}
                onChange={(e) => update(b.id, { status: e.target.value })}
                className="rounded-full border border-ink/10 bg-ivory px-3 py-1 text-sm"
              >
                {["new", "contacted", "confirmed", "cancelled"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-2 text-sm">
              {b.fullName} · {b.email} · {b.phone} · {b.nationality} · {b.groupSize} walkers · {b.startDate.slice(0, 10)} · {b.locale}
            </p>
            {b.message && <p className="mt-2 text-sm text-ink-soft">{b.message}</p>}
            <textarea
              className="mt-3 w-full rounded-xl border border-ink/10 px-3 py-2 text-sm"
              placeholder="Staff notes"
              defaultValue={b.staffNotes || ""}
              onBlur={(e) => update(b.id, { staffNotes: e.target.value })}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
