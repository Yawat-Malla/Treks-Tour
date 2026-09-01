import { FileCheck, IdCard, Clock, Users, MessageCircle, MapPin } from "lucide-react";
import type { SiteSettings } from "@/lib/api";
import { fillCopy, siteCopy } from "@/lib/site-copy";

export function PartnerStrip({
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
          hypothesisId: "A",
          location: "PartnerStrip.tsx:c",
          message: "t() invoked as last resort",
          data: { key },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      return fallback(key);
    });
  const items = [
    { Icon: FileCheck, label: c("partners.acap") },
    { Icon: IdCard, label: c("partners.tims") },
    { Icon: Clock, label: fillCopy(c("partners.years"), { count: settings.yearsGuiding }) },
    { Icon: Users, label: fillCopy(c("partners.walkers"), { count: settings.trekkerCount }) },
    { Icon: MessageCircle, label: c("partners.reply") },
    { Icon: MapPin, label: c("partners.local") },
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
