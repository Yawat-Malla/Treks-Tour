"use client";

import { useState } from "react";

export function Lightbox({ images }: { images: string[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        {images.map((src) => (
          <button key={src} type="button" onClick={() => setOpen(src)} className="overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-44 w-full object-cover transition hover:scale-[1.03]" />
          </button>
        ))}
      </div>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/80 p-6" onClick={() => setOpen(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={open} alt="" className="max-h-full max-w-full rounded-xl object-contain" />
        </div>
      )}
    </>
  );
}
