"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PAGE_CATALOG } from "@/cms/page-catalog";
import { adminPath, studioNav } from "@/cms/studio-nav";
import { matchesQuery, StudioSearch } from "./studio-ui";

type Jump = { href: string; label: string; hint: string };

function jumps(): Jump[] {
  const admin = adminPath;
  const pages = `/${admin}/pages`;
  return [
    ...studioNav(admin).map((item) => ({ href: item.href, label: item.label, hint: item.hint })),
    ...PAGE_CATALOG.map((g) => ({
      href: `${pages}?section=${g.id}`,
      label: g.label,
      hint: g.help,
    })),
    { href: `/${admin}/brand`, label: "WhatsApp, Viber, email, WeChat", hint: "Floating buttons and phone numbers" },
    { href: `/${admin}/brand`, label: "Logo and company name", hint: "Pictures in the header" },
  ];
}

export function StudioJump() {
  const [q, setQ] = useState("");
  const found = useMemo(() => {
    if (!q.trim()) return [];
    return jumps()
      .filter((item) => matchesQuery(q, item.label, item.hint))
      .slice(0, 8);
  }, [q]);

  return (
    <div className="relative">
      <StudioSearch
        value={q}
        onChange={setQ}
        kind="jump"
        label="Find a page"
        placeholder="Find a page"
      />
      {q.trim() && (
        <ul className="studio-card absolute z-20 mt-2 w-full overflow-hidden p-2">
          {found.length === 0 && (
            <li className="px-4 py-3 text-base text-ink-soft">Nothing matches “{q.trim()}”. Try another word.</li>
          )}
          {found.map((item) => (
            <li key={`${item.href}-${item.label}`}>
              <Link
                href={item.href}
                onClick={() => setQ("")}
                className="block min-h-12 rounded-xl px-4 py-3 hover:bg-sky/10"
              >
                <span className="block text-base font-semibold text-ink">{item.label}</span>
                <span className="block text-[15px] text-ink-soft">{item.hint}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
