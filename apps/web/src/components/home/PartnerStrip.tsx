import { getTranslations } from "next-intl/server";
import { FileCheck, IdCard, Clock, Users, MessageCircle, MapPin } from "lucide-react";

export async function PartnerStrip({ years, walkers }: { years: number; walkers: number }) {
  const t = await getTranslations("partners");
  const items = [
    { Icon: FileCheck, label: t("acap") },
    { Icon: IdCard, label: t("tims") },
    { Icon: Clock, label: t("years", { count: years }) },
    { Icon: Users, label: t("walkers", { count: walkers }) },
    { Icon: MessageCircle, label: t("reply") },
    { Icon: MapPin, label: t("local") },
  ];

  return (
    <section className="border-b border-ink/6 bg-snow py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-5 lg:px-8">
        {items.map(({ Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-ink-soft">
            <Icon className="h-5 w-5 text-sky" />
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}
