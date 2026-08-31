export type KindId = "trek" | "rafting" | "activity" | "safari";

export function KindMark({ kind, className = "" }: { kind: KindId; className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden>
      {kind === "trek" && <TrekMark />}
      {kind === "rafting" && <RaftMark />}
      {kind === "activity" && <GliderMark />}
      {kind === "safari" && <RhinoMark />}
    </svg>
  );
}

function TrekMark() {
  return (
    <>
      <path
        d="M2.5 25.5 11 11.5l5.2 7.6L21.5 8.5 29.5 25.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M2.5 25.5h27" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="17.6" cy="16.4" r="1.35" fill="currentColor" />
      <path
        d="M17.6 17.8 16.4 22.4M17.6 17.8 19.4 22.1M16.7 19.7h2.6M18.8 16.9 21.2 20.4"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </>
  );
}

function RaftMark() {
  return (
    <>
      <path d="M10 5.8 22.8 26" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
      <path
        d="M8.2 4.4c1.9-1.15 4.3.55 3.55 2.7-.55 1.55-2.95 2-4.35.7-1.05-1-.7-2.75.8-3.4Z"
        fill="currentColor"
      />
      <ellipse cx="16" cy="20.2" rx="11.2" ry="5.3" stroke="currentColor" strokeWidth="1.8" />
      <ellipse cx="16" cy="20.2" rx="6.4" ry="2.7" stroke="currentColor" strokeWidth="1.25" />
      <path d="M7.6 20.2h16.8" stroke="currentColor" strokeWidth="1.15" opacity=".55" />
    </>
  );
}

function GliderMark() {
  return (
    <>
      <path d="M4.8 12.2Q16 3.2 27.2 12.2" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" />
      <path d="M7.2 12.2Q16 7.2 24.8 12.2" stroke="currentColor" strokeWidth="1.2" opacity=".7" />
      <path
        d="M8.4 12.2 15.2 21.6M23.6 12.2 16.8 21.6M16 12.2v9.2"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <circle cx="16" cy="23.1" r="1.45" fill="currentColor" />
      <path
        d="M16 24.6 14.6 28.4M16 24.6 17.6 28.3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </>
  );
}

function RhinoMark() {
  return (
    <>
      <path
        fill="currentColor"
        d="M7.2 21.4c-.2-4.6 3.2-8.6 8.4-9.6 1-2.6 3.2-4.6 5.8-5.1 1.4-.2 2.4.7 2.3 1.9 1.8.6 3.2 2 4 3.8.4-.2 1-.3 1.5.2.7.6.5 1.7-.3 2.1h-.8c.7 1.3 1.1 2.8 1.1 4.3 0 1.3-.7 2.2-2 2.2H9.1c-1.2 0-1.9-.8-1.9-1.8Z"
      />
      <path
        fill="currentColor"
        d="M22.2 8.6 25.4 3.2c.28-.5 1.05-.28 1.02.4L24.4 9.4"
      />
      <path
        d="M11.2 22.6v4.2M16.2 22.8v4.2M21.4 22.6v4.2"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
      />
    </>
  );
}
