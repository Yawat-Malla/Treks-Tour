import type { Metadata } from "next";
import { NotFoundView } from "@/components/NotFoundView";

export const metadata: Metadata = {
  title: "404",
  robots: { index: false, follow: false },
};

/**
 * Unknown paths under a locale. Render the themed 404 directly so the HTML
 * includes it on first paint (calling `notFound()` alone leaves an empty
 * `__next_error__` shell until client recovery).
 * Locale `not-found.tsx` still handles `notFound()` from trek/blog pages.
 */
export default function CatchAllPage() {
  return <NotFoundView />;
}
