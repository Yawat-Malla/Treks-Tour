"use client";

import { useEffect } from "react";

/** Sets document lang/dir from the active locale (root layout owns the html element). */
export function DocumentLang({ locale, dir }: { locale: string; dir: "ltr" | "rtl" }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);
  return null;
}
