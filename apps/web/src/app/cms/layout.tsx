import type { Metadata } from "next";
import { fetchPublic } from "@/lib/api";
import { siteIcons } from "@/lib/seo";
import "../globals.css";
import "./studio.css";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchPublic("en").catch(() => null);
  return {
    title: "Studio",
    robots: { index: false, follow: false },
    icons: data ? siteIcons(data.settings) : { icon: [{ url: "/logo.png", type: "image/png" }] },
  };
}

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return <div className="studio min-h-full text-ink">{children}</div>;
}
