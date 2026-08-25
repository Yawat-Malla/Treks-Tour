export function PeakCluster({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 340 210"
      fill="none"
      aria-hidden
    >
      <path fill="#8eb8f4" d="M168 210 248 28l92 182z" />
      <path fill="#f7fbff" d="M248 28 218 86l30-16 32 16z" />
      <path fill="#c5daf8" d="M248 28 228 72l20-10 22 10z" />
      <path fill="#0b1f3a" d="M12 210 148 42l148 168z" />
      <path fill="#e8eef6" d="M148 42 122 86l26-14 28 14z" />
      <path fill="#2f6fed" d="M92 210 168 92l92 118z" opacity=".35" />
      <g transform="translate(140 28)">
        <circle cx="4" cy="3.2" r="2.35" fill="#c45c4a" />
        <path fill="#c45c4a" d="M1.6 6.2h4.8v6.2H1.6z" />
        <path stroke="#c45c4a" strokeWidth="1.35" strokeLinecap="round" d="M2.2 12.6 0.4 18.4M6.2 12.6 8.2 18.4" />
        <path stroke="#0b1f3a" strokeWidth="1.2" strokeLinecap="round" d="M8.4 4.2 12.8 19" />
        <circle cx="16.4" cy="4.4" r="2.35" fill="#2f6fed" />
        <path fill="#2f6fed" d="M14.1 7.4h4.6v6H14.1z" />
        <path stroke="#2f6fed" strokeWidth="1.35" strokeLinecap="round" d="M14.6 13.6 13 19.2M18.4 13.6 20.6 19.2" />
      </g>
    </svg>
  );
}

export function WaveCluster({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 360 168"
      fill="none"
      aria-hidden
    >
      <path
        fill="#0f9d9a"
        d="M0 168c28-28 52-62 92-62 32 0 44 24 76 22 34-2 42-38 86-36 36 2 48 30 84 26 14-2 18-12 22-22v134H0z"
        opacity=".9"
      />
      <path
        fill="#147f7c"
        d="M0 168c36-18 64-48 108-44 38 4 46 28 84 24 40-4 52-34 96-30 28 2 42 22 72 18v100H0z"
      />
      <path
        fill="#f4f8fc"
        d="M18 78c18-2 22 16 40 14 16-2 20-18 38-16 14 2 16 14 32 12 12-2 16-16 30-14"
        stroke="#f4f8fc"
        strokeWidth="5"
        strokeLinecap="round"
        opacity=".85"
      />
      <path
        fill="#ffffff"
        d="M96 54c14-1 18 12 32 10 12-2 14-14 28-12"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="54" cy="48" r="3.2" fill="#fff" opacity=".9" />
      <circle cx="168" cy="36" r="2.4" fill="#fff" opacity=".8" />
      <circle cx="214" cy="58" r="2" fill="#fff" opacity=".7" />
      <path
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        d="M142 28c8 6 6 16-2 20M232 42c10 4 8 14 0 18M76 32c6 8 2 16-6 18"
        opacity=".75"
      />
    </svg>
  );
}

/** Softer range silhouette — fewer peaks, logo-adjacent, less sawtooth. */
const MOUNTAIN =
  "M0 90V58L180 28l140 42 220-56 170 48 250-62 200 44 280-48V90H0Z";

export const WAVES =
  "M0 90C36 90 48 52 92 50C136 48 148 78 192 72C236 66 252 28 304 32C356 36 372 76 428 68C480 60 502 18 560 24C618 30 636 74 700 62C760 52 788 16 852 22C916 28 936 76 1004 64C1068 54 1096 20 1164 28C1232 36 1252 74 1320 60C1372 50 1404 36 1440 42V90H0Z";

export function BandEdge({
  kind,
  flip = false,
}: {
  kind: "mountains" | "waves";
  flip?: boolean;
}) {
  return (
    <svg
      className={`ridge-edge ${flip ? "ridge-edge--bottom" : "ridge-edge--top"}`}
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path fill="var(--ridge-fill)" d={kind === "waves" ? WAVES : MOUNTAIN} />
    </svg>
  );
}
