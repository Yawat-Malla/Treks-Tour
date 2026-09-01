import { RidgeBand } from "@/components/ui/RidgeBand";
import { MapPin, UserRound, MessageCircle, FileCheck, Users, Shield } from "lucide-react";
import type { SiteSettings } from "@/lib/api";
import { siteCopy } from "@/lib/site-copy";

const TILES = ["tile1", "tile2", "tile3", "tile4", "tile5", "tile6", "tile7", "tile8"] as const;
const WHY = [
  { key: "one", Icon: MapPin },
  { key: "two", Icon: UserRound },
  { key: "three", Icon: MessageCircle },
  { key: "four", Icon: FileCheck },
  { key: "five", Icon: Users },
  { key: "how", Icon: Shield },
] as const;

export function PurposeBand({
  settings,
  fallback,
}: {
  settings: SiteSettings;
  fallback: (key: string) => string;
}) {
  const c = (key: string) =>
    siteCopy(settings, key, () => {
      // #region agent log
      fetch("http://127.0.0.1:7250/ingest/4f909da6-e362-4dd0-8c11-1048ad8b271f", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "4acaf2" },
        body: JSON.stringify({
          sessionId: "4acaf2",
          runId: "post-fix",
          hypothesisId: "D",
          location: "PurposeBand.tsx:c",
          message: "t() invoked as last resort",
          data: { key },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      return fallback(key);
    });
  const title = c("intro.title");
  const body = c("intro.body");

  return (
    <RidgeBand tone="ink">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-river">{c("purpose.kicker")}</p>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl">{title}</h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-snow/75">{body}</p>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {TILES.map((key) => (
              <div
                key={key}
                className="flex aspect-square items-center justify-center rounded-xl bg-snow px-2 text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-ink sm:text-xs"
              >
                {c(`purpose.${key}`)}
              </div>
            ))}
          </div>
        </div>
        <h3 className="mt-14 text-center font-serif text-2xl sm:text-3xl">{c("purpose.whyTitle")}</h3>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map(({ key, Icon }) => (
            <div key={key} className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-snow/10">
                <Icon className="h-5 w-5 text-river" />
              </div>
              <div>
                <p className="font-semibold">{key === "how" ? c("how.oneTitle") : c(`value.${key}Title`)}</p>
                <p className="mt-1 text-sm leading-relaxed text-snow/65">
                  {key === "how" ? c("how.oneBody") : c(`value.${key}Body`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RidgeBand>
  );
}
