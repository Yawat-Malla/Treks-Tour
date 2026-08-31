"use client";

import { useState } from "react";
import type { Faq } from "@/lib/api";
import { ChevronDown } from "lucide-react";

export function FaqList({
  items,
  kicker,
  title,
  columns = 2,
}: {
  items: Faq[];
  kicker: string;
  title: string;
  columns?: 1 | 2;
}) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  const mid = Math.ceil(items.length / 2);
  const cols = columns === 2 && items.length > 3 ? [items.slice(0, mid), items.slice(mid)] : [items];

  return (
    <div>
      <p className="text-center text-xs uppercase tracking-[0.22em] text-sky">{kicker}</p>
      <h2 className="mt-3 text-center font-serif text-4xl">{title}</h2>
      <div className={`mt-10 grid gap-x-12 ${cols.length > 1 ? "md:grid-cols-2" : ""}`}>
        {cols.map((col, i) => (
          <ul key={i} className="divide-y divide-ink/10">
            {col.map((f) => {
              const isOpen = open === f.id;
              return (
                <li key={f.id}>
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-4 py-4 text-start"
                    onClick={() => setOpen(isOpen ? null : f.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium">{f.question}</span>
                    <ChevronDown className={`mt-0.5 h-4 w-4 shrink-0 text-sky transition ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && <p className="pb-4 text-sm leading-relaxed text-ink-soft">{f.answer}</p>}
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </div>
  );
}
