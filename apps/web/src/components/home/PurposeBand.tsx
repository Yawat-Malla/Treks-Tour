import { getTranslations } from "next-intl/server";
import { RidgeBand } from "@/components/ui/RidgeBand";
import { MapPin, UserRound, MessageCircle, FileCheck, Users, Shield } from "lucide-react";

const TILES = ["tile1", "tile2", "tile3", "tile4", "tile5", "tile6", "tile7", "tile8"] as const;
const WHY = [
  { key: "one", Icon: MapPin },
  { key: "two", Icon: UserRound },
  { key: "three", Icon: MessageCircle },
  { key: "four", Icon: FileCheck },
  { key: "five", Icon: Users },
  { key: "how", Icon: Shield },
] as const;

export async function PurposeBand({ title, body }: { title: string; body: string }) {
  const t = await getTranslations();

  return (
    <RidgeBand tone="ink">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-river">{t("purpose.kicker")}</p>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl">{title}</h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-snow/75">{body}</p>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {TILES.map((key) => (
              <div
                key={key}
                className="flex aspect-square items-center justify-center rounded-xl bg-snow px-2 text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-ink sm:text-xs"
              >
                {t(`purpose.${key}`)}
              </div>
            ))}
          </div>
        </div>
        <h3 className="mt-14 text-center font-serif text-2xl sm:text-3xl">{t("purpose.whyTitle")}</h3>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map(({ key, Icon }) => (
            <div key={key} className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-snow/10">
                <Icon className="h-5 w-5 text-river" />
              </div>
              <div>
                <p className="font-semibold">
                  {key === "how" ? t("how.oneTitle") : t(`value.${key}Title`)}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-snow/65">
                  {key === "how" ? t("how.oneBody") : t(`value.${key}Body`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RidgeBand>
  );
}
