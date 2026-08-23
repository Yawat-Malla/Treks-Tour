import { getTranslations } from "next-intl/server";
import { Shield, UserRound, MessageCircle, FileCheck } from "lucide-react";

export async function TrustStrip() {
  const t = await getTranslations("trust");
  const items = [
    { Icon: Shield, label: t("stripBased") },
    { Icon: UserRound, label: t("stripNoAccount") },
    { Icon: MessageCircle, label: t("stripReply") },
    { Icon: FileCheck, label: t("stripPermits") },
  ];
  return (
    <div className="bg-moss-deep text-snow">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-5 py-2.5 text-[11px] uppercase tracking-[0.12em] text-snow/85 lg:px-8">
        {items.map(({ Icon, label }) => (
          <span key={label} className="inline-flex items-center gap-1.5">
            <Icon className="h-3.5 w-3.5 text-sky" strokeWidth={2} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
