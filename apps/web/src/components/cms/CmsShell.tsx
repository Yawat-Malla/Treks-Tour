"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";

const admin = process.env.NEXT_PUBLIC_ADMIN_PATH || "studio-7f3a";

export function CmsShell({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch(apiUrl("/auth/me"), { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setOk(Boolean(d.authenticated)))
      .catch(() => setOk(false));
  }, []);

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch(apiUrl("/auth/pin"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    if (!res.ok) {
      setError("Incorrect PIN, or too many attempts.");
      return;
    }
    setOk(true);
  }

  async function logout() {
    await fetch(apiUrl("/auth/logout"), { method: "POST", credentials: "include" });
    setOk(false);
    router.replace(`/${admin}`);
  }

  if (ok === null) {
    return <div className="p-10 text-sm text-ink-soft">Opening studio…</div>;
  }

  if (!ok) {
    return (
      <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
        <p className="text-xs uppercase tracking-[0.22em] text-copper">Staff only</p>
        <h1 className="mt-3 font-serif text-4xl">Studio</h1>
        <p className="mt-2 text-sm text-ink-soft">Enter the PIN. There is no signup.</p>
        <form onSubmit={unlock} className="mt-8 space-y-4">
          <input
            type="password"
            inputMode="numeric"
            autoComplete="off"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full rounded-2xl border border-ink/10 bg-snow px-4 py-3 tracking-[0.4em]"
          />
          {error && <p className="text-sm text-copper">{error}</p>}
          <button type="submit" className="w-full rounded-full bg-moss py-3 text-snow">
            Unlock
          </button>
        </form>
      </div>
    );
  }

  const links = [
    [`/${admin}`, "Home copy"],
    [`/${admin}/brand`, "Brand & contact"],
    [`/${admin}/treks`, "Trips"],
    [`/${admin}/bookings`, "Bookings"],
  ];

  return (
    <div className="min-h-screen md:grid md:grid-cols-[220px_1fr]">
      <aside className="border-b border-ink/10 bg-snow md:border-b-0 md:border-e">
        <div className="p-5">
          <p className="font-serif text-xl">Studio</p>
          <p className="text-xs text-ink-soft">Annapurna Trails</p>
        </div>
        <nav className="flex flex-col px-3 pb-6 text-sm">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={`rounded-xl px-3 py-2 ${pathname === href ? "bg-ivory-deep text-ink" : "text-ink-soft hover:text-ink"}`}
            >
              {label}
            </Link>
          ))}
          <button type="button" onClick={logout} className="mt-6 px-3 text-start text-ink-soft hover:text-copper">
            Lock
          </button>
        </nav>
      </aside>
      <div className="p-6 md:p-10">{children}</div>
    </div>
  );
}
