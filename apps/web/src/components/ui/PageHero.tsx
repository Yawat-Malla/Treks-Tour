import { FilmImage } from "@/components/ui/FilmImage";
import { WAVES } from "@/components/ui/SceneMarks";

export function PageHero({
  kicker,
  title,
  lede,
  image,
  tall = false,
}: {
  kicker?: string;
  title: string;
  lede?: string;
  image: string;
  tall?: boolean;
}) {
  return (
    <section className={`relative overflow-hidden bg-ink ${tall ? "min-h-[52vh]" : "min-h-[38vh]"} md:min-h-[42vh]`}>
      <FilmImage src={image} className="absolute inset-0" kenburns />
      <div className="hero-vignette absolute inset-0" />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-5 pb-16 pt-28 text-center text-snow lg:px-8 lg:pt-32">
        {kicker ? <p className="text-xs uppercase tracking-[0.22em] text-snow/70">{kicker}</p> : null}
        <h1 className="mt-3 max-w-3xl font-serif text-[clamp(2rem,5vw,3.6rem)] leading-[1.08]">{title}</h1>
        {lede ? <p className="mt-4 max-w-2xl text-sm leading-relaxed text-snow/80 sm:text-base">{lede}</p> : null}
      </div>
      <svg className="hero-wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden>
        <path fill="var(--ivory)" d={WAVES} />
      </svg>
    </section>
  );
}
