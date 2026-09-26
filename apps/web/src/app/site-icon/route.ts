import { NextResponse } from "next/server";
import { apiBase, fetchPublic } from "@/lib/api";
import { siteIconUrl } from "@/lib/seo";

const MIME: Record<string, string> = {
  ico: "image/x-icon",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  svg: "image/svg+xml",
  webp: "image/webp",
  gif: "image/gif",
};

export const dynamic = "force-dynamic";

/**
 * Same-origin tab icon. Studio uploads live on the API (`/uploads/…`);
 * browsers often ignore a cross-origin `<link rel="icon">`, and Next's
 * leftover `app/favicon.ico` used to win. This route proxies the file.
 */
export async function GET() {
  const data = await fetchPublic("en").catch(() => null);
  const src = data ? siteIconUrl(data.settings) : "/logo.png";
  const api = apiBase();
  const origin = src.startsWith("http")
    ? new URL(src)
    : new URL(src, api || "http://127.0.0.1:3000");

  const res = await fetch(origin, { cache: "no-store" }).catch(() => null);
  if (!res?.ok) {
    const fallback = await fetch(new URL("/logo.png", "http://127.0.0.1:3000"), { cache: "no-store" }).catch(
      () => null,
    );
    if (fallback?.ok) {
      return new NextResponse(fallback.body, {
        headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=60" },
      });
    }
    return new NextResponse(null, { status: 404 });
  }

  const ext = origin.pathname.split(".").pop()?.toLowerCase() ?? "png";
  return new NextResponse(res.body, {
    headers: {
      "Content-Type": res.headers.get("content-type") || MIME[ext] || "image/png",
      "Cache-Control": "public, max-age=300",
    },
  });
}
