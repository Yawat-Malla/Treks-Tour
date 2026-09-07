import { Link } from "@/i18n/navigation";

function inline(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!m) return <span key={i}>{part}</span>;
    const href = m[2];
    if (href.startsWith("http")) {
      return (
        <a key={i} href={href} className="text-sky underline-offset-4 hover:underline">
          {m[1]}
        </a>
      );
    }
    return (
      <Link key={i} href={href} className="text-sky underline-offset-4 hover:underline">
        {m[1]}
      </Link>
    );
  });
}

export function BlogBody({ body }: { body: string }) {
  const blocks = body.split(/\n\n+/);
  return (
    <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
      {blocks.map((block, i) => {
        const lines = block.trim().split("\n");
        if (lines.length > 1 && lines.every((l) => l.includes("|"))) {
          const rows = lines.filter((l) => !/^\s*\|?\s*-{3,}/.test(l));
          return (
            <div key={i} className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-ink">
                <tbody>
                  {rows.map((row, ri) => {
                    const cells = row.split("|").map((c) => c.trim()).filter((c, idx, arr) => !(idx === 0 && c === "") && !(idx === arr.length - 1 && c === ""));
                    const Tag = ri === 0 ? "th" : "td";
                    return (
                      <tr key={ri} className="border-b border-ink/10">
                        {cells.map((cell, ci) => (
                          <Tag key={ci} className="px-3 py-2 font-medium">
                            {inline(cell)}
                          </Tag>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }
        if (lines[0]?.startsWith("## ")) {
          return (
            <h2 key={i} className="font-serif text-3xl text-ink">
              {lines[0].slice(3)}
            </h2>
          );
        }
        return <p key={i}>{inline(block)}</p>;
      })}
    </div>
  );
}
