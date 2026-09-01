import type { AssociationLogo } from "@/cms/page-catalog";

export function AssociatedWith({ title, logos }: { title: string; logos: AssociationLogo[] }) {
  return (
    <section className="bg-snow py-24">
      <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
        <h2 className="font-serif text-3xl sm:text-4xl">{title}</h2>
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-16 gap-y-12 sm:gap-x-20">
          {logos.map((logo) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={logo.url}
              src={logo.url}
              alt={logo.alt}
              className="h-[4.5rem] w-auto object-contain sm:h-24"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
