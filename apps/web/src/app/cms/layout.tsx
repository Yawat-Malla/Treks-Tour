import type { Metadata } from "next";
import { Outfit, Fraunces } from "next/font/google";
import "../globals.css";
import "./studio.css";

const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="studio min-h-full text-ink">{children}</body>
    </html>
  );
}
