import type { Metadata } from "next";
import "../globals.css";
import "./studio.css";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return <div className="studio min-h-full text-ink">{children}</div>;
}
