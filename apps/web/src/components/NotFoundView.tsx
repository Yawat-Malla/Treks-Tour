import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/** Shared themed 404 body — used by locale and root not-found pages. */
export async function NotFoundView() {
  const t = await getTranslations("notFound");

  return (
    <section className="relative overflow-hidden bg-ivory">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 opacity-[0.35]"
        style={{
          backgroundImage: "url(/textures/peaks.svg)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom center",
          backgroundSize: "cover",
        }}
        aria-hidden
      />
      <div className="relative mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-5 py-24 text-center lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pine-deep">{t("code")}</p>
        <h1 className="mt-5 font-serif text-4xl text-ink sm:text-5xl">{t("title")}</h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft">{t("body")}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-snow transition hover:bg-moss-deep"
          >
            {t("home")}
          </Link>
          <Link
            href="/treks"
            className="inline-flex min-h-11 items-center rounded-full bg-snow px-6 text-sm font-medium text-ink ring-1 ring-ink/12 transition hover:bg-ivory-deep"
          >
            {t("treks")}
          </Link>
          <Link href="/contact" className="text-sm text-sky underline-offset-4 hover:underline">
            {t("contact")}
          </Link>
        </div>
      </div>
    </section>
  );
}
