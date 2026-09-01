"use client";

import { useEffect, useMemo, useState } from "react";
import { cmsFetch } from "@/lib/cms";
import { digits } from "@/lib/contacts";
import {
  matchesQuery,
  StudioCard,
  StudioCopy,
  StudioCount,
  StudioEmpty,
  StudioField,
  StudioFilters,
  StudioPageHeader,
  StudioSearch,
} from "./studio-ui";

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

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  contacted: "We replied",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};

export function BookingsInbox() {
  const [rows, setRows] = useState<Booking[] | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    cmsFetch("/cms/bookings").then(setRows);
  }, []);

  const searched = useMemo(() => {
    if (!rows) return [];
    return rows.filter((b) =>
      matchesQuery(q, b.fullName, b.email, b.phone, b.reference, b.nationality, b.trek.translations[0]?.name, b.message),
    );
  }, [rows, q]);

  const filtered = useMemo(() => {
    return searched.filter((b) => status === "all" || b.status === status);
  }, [searched, status]);

  async function update(id: string, data: Partial<Booking>) {
    const saved = await cmsFetch(`/cms/bookings/${id}`, { method: "PATCH", body: JSON.stringify(data) });
    setRows((all) => all!.map((r) => (r.id === id ? { ...r, ...saved } : r)));
  }

  if (!rows) return <p className="text-lg text-ink-soft">Loading bookings…</p>;

  const counts = {
    all: searched.length,
    new: searched.filter((b) => b.status === "new").length,
    contacted: searched.filter((b) => b.status === "contacted").length,
    confirmed: searched.filter((b) => b.status === "confirmed").length,
    cancelled: searched.filter((b) => b.status === "cancelled").length,
  };

  return (
    <div className="max-w-4xl">
      <StudioPageHeader
        title="Bookings"
        hint="Guests never created accounts. Status saves as soon as you change it."
      />
      <div className="mb-6 space-y-4">
        <StudioSearch value={q} onChange={setQ} placeholder="Find by name, phone, email, or trip" />
        <StudioFilters
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { id: "all", label: "All", count: counts.all },
            { id: "new", label: "New", count: counts.new },
            { id: "contacted", label: "We replied", count: counts.contacted },
            { id: "confirmed", label: "Confirmed", count: counts.confirmed },
            { id: "cancelled", label: "Cancelled", count: counts.cancelled },
          ]}
        />
        <StudioCount shown={filtered.length} total={rows.length} word="requests" />
      </div>
      {filtered.length === 0 ? (
        <StudioEmpty>
          {q.trim() || status !== "all" ? "No bookings match that search." : "No booking requests yet."}
        </StudioEmpty>
      ) : (
        <ul className="space-y-4">
          {filtered.map((b) => {
            const phoneDigits = digits(b.phone);
            return (
              <li key={b.id}>
                <StudioCard className={b.status === "new" ? "ring-2 ring-gold" : ""}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-serif text-2xl text-ink">
                        {b.trek.translations[0]?.name}
                        {b.trek.kind === "rafting" ? " (raft)" : ""}
                        {b.addon ? ` + ${b.addon.translations[0]?.name}` : ""}
                      </p>
                      <p className="mt-1 text-[15px] text-ink-soft">
                        {b.reference}
                        {b.privateDeparture ? " · private trip" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {b.status === "new" && (
                        <span className="inline-flex rounded-full bg-gold px-3 py-1 text-sm font-semibold text-ink">New</span>
                      )}
                      <select
                        value={b.status}
                        onChange={(e) => update(b.id, { status: e.target.value })}
                        className="studio-input w-auto min-w-[10rem]"
                        aria-label="Booking status"
                      >
                        {Object.entries(STATUS_LABEL).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <p className="mt-4 text-base">
                    {b.fullName} · {b.nationality} · {b.groupSize} walkers · {b.startDate.slice(0, 10)}
                  </p>
                  {b.message && <p className="mt-2 text-base text-ink-soft">{b.message}</p>}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {phoneDigits ? (
                      <a href={`tel:${phoneDigits}`} className="studio-btn studio-btn-ghost">
                        Call
                      </a>
                    ) : null}
                    {phoneDigits ? (
                      <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noreferrer" className="studio-btn studio-btn-ghost">
                        WhatsApp
                      </a>
                    ) : null}
                    {b.email ? (
                      <a href={`mailto:${b.email}`} className="studio-btn studio-btn-ghost">
                        Email
                      </a>
                    ) : null}
                    <StudioCopy text={b.phone} label="Copy phone" />
                    <StudioCopy text={b.email} label="Copy email" />
                  </div>
                  <div className="mt-4">
                    <StudioField label="Staff notes" help="Only you see this. Saved when you tap outside the box.">
                      <textarea
                        className="studio-input"
                        defaultValue={b.staffNotes || ""}
                        onBlur={(e) => update(b.id, { staffNotes: e.target.value })}
                      />
                    </StudioField>
                  </div>
                </StudioCard>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
