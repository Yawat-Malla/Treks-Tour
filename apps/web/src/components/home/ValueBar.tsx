import { getTranslations } from "next-intl/server";
import { MapPin, UserRound, MessageCircle, FileCheck, Users } from "lucide-react";

export async function ValueBar() {
  const t = await getTranslations("value");
  const tiles = [
    { Icon: MapPin, title: t("oneTitle"), body: t("oneBody"), tint: "bg-sky/10 text-sky" },
    { Icon: UserRound, title: t("twoTitle"), body: t("twoBody"), tint: "bg-river/10 text-river" },
    { Icon: MessageCircle, title: t("threeTitle"), body: t("threeBody"), tint: "bg-sky/10 text-sky" },
    { Icon: FileCheck, title: t("fourTitle"), body: t("fourBody"), tint: "bg-sky/10 text-sky" },
    { Icon: Users, title: t("fiveTitle"), body: t("fiveBody"), tint: "bg-river/10 text-river" },
  ];
  return (
    <section className="bg-ivory py-16">
      <div className="mx-auto grid max-w-6xl gap-4 px-5 sm:grid-cols-2 lg:grid-cols-5 lg:px-8">
        {tiles.map(({ Icon, title, body, tint }) => (
          <div key={title} className="rounded-2xl bg-snow p-5 shadow-[var(--shadow)] ring-1 ring-ink/6">
            <div className={`inline-flex rounded-2xl p-2.5 ${tint}`}>
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-sm font-semibold">{title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
