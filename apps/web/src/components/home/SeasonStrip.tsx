import { getTranslations } from "next-intl/server";

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function level(kind: "trek" | "raft", m: number): "peak" | "good" | "off" {
  if (kind === "trek") {
    if ([10, 11, 4].includes(m)) return "peak";
    if ([3, 5, 9, 12].includes(m)) return "good";
    return "off";
  }
  if ([10, 11, 3, 4, 5].includes(m)) return "peak";
  if ([1, 2, 6, 9, 12].includes(m)) return "good";
  return "off";
}

export async function SeasonStrip() {
  const t = await getTranslations("season");
  const labels = t.raw("months") as string[];
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-copper">{t("kicker")}</p>
      <h2 className="mt-3 font-serif text-4xl">{t("title")}</h2>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[640px] text-center text-xs">
          <thead>
            <tr>
              <th className="p-2 text-start font-normal text-ink-soft" />
              {MONTHS.map((m, i) => (
                <th key={m} className="p-2 font-normal">
                  {labels[i]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(["trek", "raft"] as const).map((row) => (
              <tr key={row}>
                <td className="p-2 text-start">{t(row)}</td>
                {MONTHS.map((m) => (
                  <td key={m} className="p-1">
                    <div className="season-cell h-8 rounded-md" data-level={level(row, m)} title={t(level(row, m))} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 flex flex-wrap gap-4 text-xs text-ink-soft">
        <span className="inline-flex items-center gap-2">
          <span className="season-cell inline-block h-3 w-3 rounded-sm" data-level="peak" />
          {t("peak")}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="season-cell inline-block h-3 w-3 rounded-sm" data-level="good" />
          {t("good")}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="season-cell inline-block h-3 w-3 rounded-sm" data-level="off" />
          {t("off")}
        </span>
      </p>
    </div>
  );
}
