import { getTranslations } from "next-intl/server";
import { Footprints, Calendar, MessageCircle } from "lucide-react";

const ICONS = [Footprints, Calendar, MessageCircle];

export async function HowPills() {
  const t = await getTranslations("how");
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-sky">{t("kicker")}</p>
      <h2 className="mt-3 font-serif text-4xl sm:text-5xl">{t("title")}</h2>
      <ol className="mt-12 grid gap-6 md:grid-cols-3">
        {(["one", "two", "three"] as const).map((key, i) => {
          const Icon = ICONS[i];
          return (
            <li key={key} className="rounded-2xl bg-snow p-6 shadow-[var(--shadow)] ring-1 ring-ink/6">
              <div className="inline-flex rounded-2xl bg-sky/10 p-3 text-sky">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-serif text-2xl">{t(`${key}Title`)}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{t(`${key}Body`)}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
