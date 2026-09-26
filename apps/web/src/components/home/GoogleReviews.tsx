"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import type { GoogleReviewsPayload } from "@/lib/api";

function GoogleGlyph({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function Stars({ rating, size = "md" }: { rating: number; size?: "sm" | "md" }) {
  const full = Math.round(rating);
  const cls = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className="flex gap-0.5 text-gold" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={`${cls} ${i < full ? "fill-current" : "fill-ink/15"}`}>
          <path d="M10 1.6 12.4 7l6 .5-4.6 4 1.4 5.9L10 14.6 4.8 17.4l1.4-5.9L1.6 7.5l6-.5L10 1.6Z" />
        </svg>
      ))}
    </div>
  );
}

function ratingLabel(rating: number, t: (key: string) => string) {
  if (rating >= 4.5) return t("excellent");
  if (rating >= 4) return t("great");
  if (rating >= 3) return t("good");
  return t("rated");
}

function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function ReviewCard({
  review,
  mapsUri,
}: {
  review: GoogleReviewsPayload["reviews"][number];
  mapsUri: string;
}) {
  const t = useTranslations("googleReviews");
  const [expanded, setExpanded] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const long = review.text.length > 220;
  const body = !long || expanded ? review.text : `${review.text.slice(0, 220).trim()}…`;
  const showPhoto = Boolean(review.profilePhotoUrl) && !photoFailed;

  return (
    <article className="relative flex h-full min-w-[280px] max-w-[320px] shrink-0 flex-col rounded-2xl bg-snow p-5 ring-1 ring-ink/8 sm:min-w-[300px]">
      <div className="flex items-start gap-3">
        {showPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.profilePhotoUrl!}
            alt=""
            className="h-11 w-11 rounded-full object-cover"
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setPhotoFailed(true)}
          />
        ) : (
          <span className="grid h-11 w-11 place-items-center rounded-full bg-sky/15 text-sm font-semibold text-sky">
            {initials(review.authorName)}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-ink">{review.authorName}</p>
          {review.relativeTime ? <p className="text-xs text-ink-soft">{review.relativeTime}</p> : null}
        </div>
        <GoogleGlyph className="h-5 w-5 shrink-0" />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Stars rating={review.rating} size="sm" />
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#4285F4] text-[10px] text-snow" title={t("verified")}>
          ✓
        </span>
      </div>
      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-soft">{body}</p>
      {long && (
        <button
          type="button"
          className="mt-2 self-start text-sm font-medium text-sky hover:underline"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? t("readLess") : t("readMore")}
        </button>
      )}
      <span className="pointer-events-none absolute bottom-3 end-4 font-serif text-6xl leading-none text-ink/6" aria-hidden>
        “
      </span>
      {mapsUri ? (
        <a href={mapsUri} target="_blank" rel="noreferrer" className="sr-only">
          {t("seeOnGoogle")}
        </a>
      ) : null}
    </article>
  );
}

export function GoogleReviews({ data }: { data: GoogleReviewsPayload }) {
  const t = useTranslations("googleReviews");
  const [index, setIndex] = useState(0);
  const reviews = data.reviews;
  const maxIndex = Math.max(0, reviews.length - 1);

  const writeUrl = useMemo(() => {
    if (!data.mapsUri) return null;
    // Contribute URL when possible; otherwise open the listing.
    if (data.mapsUri.includes("place")) return data.mapsUri;
    return data.mapsUri;
  }, [data.mapsUri]);

  if (!reviews.length && !data.userRatingCount) return null;

  function prev() {
    setIndex((i) => (i <= 0 ? maxIndex : i - 1));
  }
  function next() {
    setIndex((i) => (i >= maxIndex ? 0 : i + 1));
  }

  const visible = reviews.length
    ? [...reviews.slice(index), ...reviews.slice(0, index)]
    : [];

  return (
    <section className="bg-snow py-20">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-center gap-2 border-b border-ink/10 pb-3">
            <span className="border-b-2 border-ink pb-3 text-sm font-semibold text-ink">{t("tabGoogle")}</span>
            <span className="pb-3 text-sm text-ink-soft">{t("tabHint")}</span>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <GoogleGlyph className="h-8 w-8" />
              <div>
                <p className="font-semibold text-ink">{ratingLabel(data.rating, t)}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Stars rating={data.rating} />
                  <span className="font-serif text-2xl text-ink">{data.rating.toFixed(1)}</span>
                  <span className="text-sm text-ink-soft">
                    {t("reviewCount", { count: data.userRatingCount })}
                  </span>
                </div>
              </div>
            </div>
            {writeUrl ? (
              <a
                href={writeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-sm font-medium text-snow hover:bg-moss-deep"
              >
                {t("writeReview")}
              </a>
            ) : null}
          </div>
        </Reveal>

        {visible.length > 0 ? (
          <div className="relative mt-10">
            <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {visible.map((review, i) => (
                <ReviewCard key={`${review.authorName}-${i}`} review={review} mapsUri={data.mapsUri} />
              ))}
            </div>
            {reviews.length > 1 ? (
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={prev}
                  className="rounded-full px-4 py-2 text-sm text-ink ring-1 ring-ink/12 hover:bg-ivory"
                  aria-label={t("prev")}
                >
                  <span aria-hidden className="inline-block rtl:rotate-180">
                    ←
                  </span>
                </button>
                <span className="text-xs text-ink-soft">
                  {index + 1} / {reviews.length}
                </span>
                <button
                  type="button"
                  onClick={next}
                  className="rounded-full px-4 py-2 text-sm text-ink ring-1 ring-ink/12 hover:bg-ivory"
                  aria-label={t("next")}
                >
                  <span aria-hidden className="inline-block rtl:rotate-180">
                    →
                  </span>
                </button>
                {data.mapsUri ? (
                  <a href={data.mapsUri} target="_blank" rel="noreferrer" className="ms-2 text-sm text-sky hover:underline">
                    {t("seeAll")}
                  </a>
                ) : null}
              </div>
            ) : data.mapsUri ? (
              <p className="mt-6 text-center">
                <a href={data.mapsUri} target="_blank" rel="noreferrer" className="text-sm text-sky hover:underline">
                  {t("seeAll")}
                </a>
              </p>
            ) : null}
          </div>
        ) : data.mapsUri ? (
          <p className="mt-8 text-center text-ink-soft">
            <a href={data.mapsUri} target="_blank" rel="noreferrer" className="text-sky hover:underline">
              {t("seeOnGoogle")}
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
