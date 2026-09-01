export const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH || "studio-7f3a";

export const LOCALES = ["en", "zh", "ko", "he"] as const;
export type StudioLocale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<StudioLocale, string> = {
  en: "English",
  zh: "中文",
  ko: "한국어",
  he: "עברית",
};

export type StudioNavItem = {
  href: string;
  label: string;
  hint: string;
  tint: string;
};

export function studioNav(admin: string): StudioNavItem[] {
  return [
    { href: `/${admin}`, label: "Home", hint: "Pick what you want to change", tint: "bg-sky/15 text-sky" },
    { href: `/${admin}/pages`, label: "Website words & photos", hint: "Titles, stories, and pictures guests see", tint: "bg-sky/15 text-sky" },
    { href: `/${admin}/brand`, label: "Name, logo & phone", hint: "WhatsApp, email, and the floating buttons", tint: "bg-river/15 text-river" },
    { href: `/${admin}/treks`, label: "Trips", hint: "Treks, rafting, activities, and safaris", tint: "bg-sky/15 text-sky" },
    { href: `/${admin}/bookings`, label: "Bookings", hint: "People who asked to go", tint: "bg-gold/20 text-ink" },
    { href: `/${admin}/faqs`, label: "Questions", hint: "Answers on the homepage", tint: "bg-river/15 text-river" },
    { href: `/${admin}/voices`, label: "Guest quotes", hint: "What walkers said about us", tint: "bg-sky/15 text-sky" },
    { href: `/${admin}/blog`, label: "News", hint: "Stories on the blog", tint: "bg-river/15 text-river" },
  ];
}
