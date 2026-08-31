import { getTranslations } from "next-intl/server";

const LOGOS = [
  { src: "/associations/1.svg", alt: "Emblem of Nepal" },
  { src: "/associations/2.svg", alt: "Nepal Tourism Board" },
  { src: "/associations/3.svg", alt: "Nepal Mountaineering Association" },
  { src: "/associations/4.svg", alt: "Trekking Agencies' Association of Nepal" },
] as const;

export async function AssociatedWith() {
  const t = await getTranslations("associated");

  return (
    <section className="bg-snow py-24">
      <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
        <h2 className="font-serif text-3xl sm:text-4xl">{t("title")}</h2>
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-16 gap-y-12 sm:gap-x-20">
          {LOGOS.map((logo) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={logo.src}
              src={logo.src}
              alt={logo.alt}
              className="h-[4.5rem] w-auto object-contain sm:h-24"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
