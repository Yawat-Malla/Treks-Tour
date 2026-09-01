"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText, MapPinned, MessageCircle, Newspaper, Phone, HelpCircle, CalendarCheck, Home, LogOut } from "lucide-react";
import { apiUrl } from "@/lib/api";
import { adminPath, studioNav } from "@/cms/studio-nav";
import { StudioJump } from "./StudioJump";

const ICONS = [Home, FileText, Phone, MapPinned, CalendarCheck, HelpCircle, MessageCircle, Newspaper];

export function CmsShell({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const admin = adminPath;
  const links = studioNav(admin);

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
      setError("That PIN did not work. Try again, or ask a manager.");
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
    return <div className="p-10 text-lg text-ink-soft">Opening Studio…</div>;
  }

  if (!ok) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky">Staff only</p>
        <h1 className="mt-3 font-serif text-5xl text-ink">Studio</h1>
        <p className="mt-3 text-lg leading-relaxed text-ink-soft">
          Type the PIN to change the website. There is no signup. Ask a manager if you do not have the PIN.
        </p>
        <form onSubmit={unlock} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-base font-semibold text-ink">PIN</span>
            <input
              type="password"
              inputMode="numeric"
              autoComplete="off"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="studio-input mt-2 tracking-[0.45em]"
            />
          </label>
          {error && <p className="text-base text-red-700">{error}</p>}
          <button type="submit" className="studio-btn studio-btn-primary w-full">
            Unlock
          </button>
        </form>
      </div>
    );
  }

  function active(href: string) {
    if (href === `/${admin}`) return pathname === href || pathname === "/cms";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-[260px_1fr]">
      <aside className="border-b border-sky/15 bg-white/80 backdrop-blur-md md:border-b-0 md:border-e">
        <div className="p-6">
          <p className="font-serif text-2xl text-ink">Studio</p>
          <p className="mt-1 text-[15px] text-ink-soft">Upper Path Treks And Tours</p>
          <div className="mt-4">
            <StudioJump />
          </div>
        </div>
        <nav className="flex flex-col gap-1 px-3 pb-8">
          {links.map((item, i) => {
            const Icon = ICONS[i] || Home;
            const on = active(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-12 items-center gap-3 rounded-2xl px-3 py-2.5 text-base font-medium ${
                  on ? "bg-sky text-white shadow-[0_10px_24px_rgba(47,111,237,0.28)]" : "text-ink hover:bg-sky/10"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={logout}
            className="mt-6 flex min-h-12 items-center gap-3 rounded-2xl px-3 py-2 text-start text-base text-ink-soft hover:bg-gold/20 hover:text-ink"
          >
            <LogOut className="h-5 w-5" aria-hidden />
            Sign out
          </button>
        </nav>
      </aside>
      <div className="p-5 pb-24 md:p-10">{children}</div>
    </div>
  );
}
