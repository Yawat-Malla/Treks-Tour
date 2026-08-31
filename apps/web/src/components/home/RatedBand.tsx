import { getTranslations } from "next-intl/server";
import { RidgeBand } from "@/components/ui/RidgeBand";

export async function RatedBand({ years, walkers }: { years: number; walkers: number }) {
  const t = await getTranslations("rated");

  return (
    <RidgeBand tone="ink">
      <div className="relative mx-auto max-w-3xl px-5 py-8 text-center lg:px-8">
        <svg className="pointer-events-none absolute inset-x-0 -top-6 mx-auto h-40 w-64 opacity-30" viewBox="0 0 200 120" aria-hidden>
          <path fill="currentColor" d="M0 120 40 70 70 95 110 20 150 80 180 50 200 120Z" />
          <circle cx="110" cy="14" r="6" fill="#e8eef6" />
          <path stroke="#e8eef6" strokeWidth="3" d="M110 22v18M98 32h24M100 40 90 58M120 40l12 18" />
        </svg>
        <p className="relative font-serif text-3xl sm:text-5xl">{t("title")}</p>
        <p className="relative mt-4 text-sm text-snow/70 sm:text-base">{t("body", { walkers, years })}</p>
      </div>
    </RidgeBand>
  );
}
