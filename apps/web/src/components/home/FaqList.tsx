"use client";

import { useState } from "react";
import type { Faq } from "@/lib/api";

export function FaqList({ items, kicker, title }: { items: Faq[]; kicker: string; title: string }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-sky">{kicker}</p>
      <h2 className="mt-3 font-serif text-4xl">{title}</h2>
      <ul className="mt-8 divide-y divide-ink/10">
        {items.map((f) => (
          <li key={f.id}>
            <button type="button" className="flex w-full items-start justify-between gap-4 py-4 text-start" onClick={() => setOpen(open === f.id ? null : f.id)}>
              <span className="font-medium">{f.question}</span>
              <span className="text-sky">{open === f.id ? "–" : "+"}</span>
            </button>
            {open === f.id && <p className="pb-4 text-sm leading-relaxed text-ink-soft">{f.answer}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
