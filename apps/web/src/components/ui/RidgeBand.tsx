import type { ReactNode } from "react";
import { BandEdge } from "./SceneMarks";

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
      <div className="ridge-inner">{children}</div>
      <BandEdge kind={kind} flip />
    </section>
  );
}
