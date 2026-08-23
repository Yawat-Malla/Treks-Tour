import type { ItineraryDay } from "@/lib/api";

export function ItinerarySnap({ days }: { days: ItineraryDay[] }) {
  return (
    <div className="itinerary-rail">
      {days.map((day) => (
        <article key={day.day} className="rounded-2xl bg-snow p-5 ring-1 ring-ink/8">
          <p className="font-serif text-3xl text-copper">{String(day.day).padStart(2, "0")}</p>
          <h3 className="mt-2 font-medium">{day.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{day.body}</p>
        </article>
      ))}
    </div>
  );
}
