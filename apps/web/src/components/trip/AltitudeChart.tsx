import type { ProfilePoint } from "@/lib/api";

export function AltitudeChart({
  points,
  label,
  unit = "m",
}: {
  points: ProfilePoint[];
  label: string;
  unit?: string;
}) {
  if (!points.length) return null;
  const max = Math.max(...points.map((p) => p.m), 1);
  const w = 640;
  const h = 180;
  const pad = 16;
  const coords = points.map((p, i) => {
    const x = pad + (i / Math.max(points.length - 1, 1)) * (w - pad * 2);
    const y = h - pad - (p.m / max) * (h - pad * 2);
    return `${x},${y}`;
  });
  return (
    <div>
      <p className="mb-3 text-sm text-ink-soft">{label}</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full overflow-visible" role="img" aria-label={label}>
        <polyline fill="none" stroke="currentColor" className="text-copper" strokeWidth="3" points={coords.join(" ")} />
        {points.map((p, i) => {
          const x = pad + (i / Math.max(points.length - 1, 1)) * (w - pad * 2);
          const y = h - pad - (p.m / max) * (h - pad * 2);
          return (
            <g key={p.d}>
              <circle cx={x} cy={y} r="4" className="fill-copper" />
              <text x={x} y={h - 2} textAnchor="middle" className="fill-ink-soft" fontSize="11">
                {p.m}
                {unit === "m" ? "" : ""}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
