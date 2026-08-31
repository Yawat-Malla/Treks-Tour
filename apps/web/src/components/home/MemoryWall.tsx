import { getTranslations } from "next-intl/server";
import { FilmImage } from "@/components/ui/FilmImage";

export async function MemoryWall({ images }: { images: string[] }) {
  const t = await getTranslations("memories");
  const shots = images.slice(0, 5);
  if (shots.length === 0) return null;

  return (
    <section className="bg-ivory py-16">
      <h2 className="px-5 text-center font-serif text-3xl sm:text-4xl">{t("title")}</h2>
      <div className="mx-auto mt-10 flex max-w-6xl gap-3 overflow-x-auto px-5 pb-2 lg:px-8">
        {shots.map((src, i) => (
          <div key={`${src}-${i}`} className="relative h-56 w-40 shrink-0 overflow-hidden rounded-xl ring-4 ring-snow shadow-[var(--shadow)] sm:h-64 sm:w-48">
            <FilmImage src={src} />
          </div>
        ))}
      </div>
    </section>
  );
}
