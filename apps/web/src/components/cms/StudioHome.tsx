"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FileText, Phone, MapPinned, MessageCircle, Newspaper, HelpCircle, CalendarCheck } from "lucide-react";
import { adminPath, studioNav } from "@/cms/studio-nav";
import { cmsFetch } from "@/lib/cms";
import { matchesQuery, StudioEmpty, StudioPageHeader, StudioSearch } from "./studio-ui";

const TILE_ICONS = [FileText, Phone, MapPinned, CalendarCheck, HelpCircle, MessageCircle, Newspaper];

export function StudioHome() {
  const items = studioNav(adminPath).slice(1);
  const [q, setQ] = useState("");
  const [newBookings, setNewBookings] = useState(0);

  useEffect(() => {
    cmsFetch("/cms/bookings")
      .then((list: { status: string }[]) => setNewBookings(list.filter((b) => b.status === "new").length))
      .catch(() => setNewBookings(0));
  }, []);

  const shown = useMemo(
    () => items.filter((item) => matchesQuery(q, item.label, item.hint)),
    [items, q],
  );

  return (
    <div>
      <StudioPageHeader
        title="What do you want to change?"
        hint="Tap a big card. You can always come back here from Home on the left."
      />
      <div className="mb-6 max-w-2xl">
        <StudioSearch value={q} onChange={setQ} placeholder="Find a job — trips, bookings, logo…" />
      </div>
      {shown.length === 0 ? (
        <StudioEmpty>Nothing matches that search. Clear the box to see every job.</StudioEmpty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((item) => {
            const i = items.findIndex((x) => x.href === item.href);
            const Icon = TILE_ICONS[i] || FileText;
            const isBookings = item.href.endsWith("/bookings");
            return (
              <Link
                key={item.href}
                href={item.href}
                className="studio-card group relative flex min-h-[9.5rem] flex-col p-6 transition hover:-translate-y-0.5 hover:ring-2 hover:ring-sky"
              >
                {isBookings && newBookings > 0 && (
                  <span className="absolute end-4 top-4 inline-flex min-h-8 items-center rounded-full bg-gold px-3 text-sm font-semibold text-ink">
                    {newBookings} new
                  </span>
                )}
                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${item.tint}`}>
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <p className="mt-4 font-serif text-2xl text-ink group-hover:text-sky">{item.label}</p>
                <p className="mt-1 text-[15px] leading-snug text-ink-soft">{item.hint}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
