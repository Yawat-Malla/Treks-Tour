import type { ReactNode } from "react";
import { BandEdge, PeakCluster, WaveCluster } from "./SceneMarks";

export function RidgeBand({
  tone = "ink",
  children,
}: {
  tone?: "ink" | "river" | "sky";
  children: ReactNode;
}) {
  const kind = tone === "river" ? "waves" : "mountains";

  return (
    <section className={`ridge ridge--${tone}`}>
      <BandEdge kind={kind} />
      <div className="ridge-peaks" aria-hidden />
      {tone === "ink" && (
        <div className="ridge-mark ridge-mark--end" aria-hidden>
          <PeakCluster />
        </div>
      )}
      {tone === "river" && (
        <div className="ridge-mark ridge-mark--start" aria-hidden>
          <WaveCluster />
        </div>
      )}
      <div className="ridge-inner">{children}</div>
      <BandEdge kind={kind} flip />
    </section>
  );
}
