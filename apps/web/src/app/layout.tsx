import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

/** Next.js 16 requires html/body on the root layout. Locale/CMS layouts add attrs and chrome. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fraunces.variable} ${outfit.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full">
        {children}
      </body>
    </html>
  );
}
