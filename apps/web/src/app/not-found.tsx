import { setRequestLocale } from "next-intl/server";
import { NotFoundView } from "@/components/NotFoundView";
import { routing } from "@/i18n/routing";

/** Global unmatched URLs (outside a triggered locale `notFound()`). */
export default async function RootNotFound() {
  setRequestLocale(routing.defaultLocale);
  return <NotFoundView />;
}
