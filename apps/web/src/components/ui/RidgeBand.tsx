import type { ReactNode } from "react";
import { BandEdge } from "./SceneMarks";

export function RidgeBand({
  tone = "ink",
  flatBottom = false,
  children,
}: {
  tone?: "ink" | "river" | "sky";
  /** Straight bottom edge instead of mountain/wave cut. */
  flatBottom?: boolean;
  children: ReactNode;
}) {
  const kind = tone === "river" ? "waves" : "mountains";

  return (
    <section className={`ridge ridge--${tone}${flatBottom ? " ridge--flat-bottom" : ""}`}>
      <BandEdge kind={kind} />
      <div className="ridge-inner">{children}</div>
      {!flatBottom && <BandEdge kind={kind} flip />}
    </section>
  );
}
