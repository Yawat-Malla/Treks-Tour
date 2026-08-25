import { Injectable } from '@nestjs/common';
import { Locale } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

const CACHE_TTL = 60;

@Injectable()
export class ContentCache {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async invalidate() {
    const keys = await this.redis.client.keys('public:content:*');
    if (keys.length) await this.redis.client.del(...keys);
  }

  mapTrip(
    trek: {
      id: string;
      slug: string;
      kind: string;
      durationDays: number;
      difficulty: string;
      maxAltitudeM: number;
      priceFromUsd: number;
      season: string;
      heroImageUrl: string;
      gallery: string[];
      featured: boolean;
      inclusions: string[];
      exclusions: string[];
      bestMonths: number[];
      river: string | null;
      grade: string | null;
      minAge: number | null;
      altitudeProfile: unknown;
      translations: {
        locale: Locale;
        name: string;
        summary: string;
        description: string;
        itinerary: unknown;
        seasonLabel: string;
        difficultyLabel: string;
      }[];
    },
    locale: Locale,
  ) {
    const tr = trek.translations.find((x) => x.locale === locale) || trek.translations.find((x) => x.locale === 'en');
    return {
      id: trek.id,
      slug: trek.slug,
      kind: trek.kind,
      durationDays: trek.durationDays,
      difficulty: trek.difficulty,
      maxAltitudeM: trek.maxAltitudeM,
      priceFromUsd: trek.priceFromUsd,
      season: trek.season,
      heroImageUrl: trek.heroImageUrl,
      gallery: trek.gallery,
      featured: trek.featured,
      inclusions: trek.inclusions,
      exclusions: trek.exclusions,
      bestMonths: trek.bestMonths,
      river: trek.river,
      grade: trek.grade,
      minAge: trek.minAge,
      altitudeProfile: trek.altitudeProfile ?? [],
      name: tr?.name ?? trek.slug,
      summary: tr?.summary ?? '',
      description: tr?.description ?? '',
      itinerary: tr?.itinerary ?? [],
      seasonLabel: tr?.seasonLabel ?? trek.season,
      difficultyLabel: tr?.difficultyLabel ?? trek.difficulty,
    };
  }

  async getPublic(locale: Locale) {
    const cacheKey = `public:content:${locale}`;
    const cached = await this.redis.client.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const settings = await this.prisma.siteSettings.findUnique({
      where: { id: 'singleton' },
      include: { translations: true },
    });
    const trips = await this.prisma.trek.findMany({
      where: { published: true },
      include: { translations: true },
      orderBy: { sortOrder: 'asc' },
    });
    const faqs = await this.prisma.faq.findMany({
      include: { translations: true },
      orderBy: { sortOrder: 'asc' },
    });
    const testimonials = await this.prisma.testimonial.findMany({
      include: { translations: true },
      orderBy: { sortOrder: 'asc' },
    });

    const t = settings?.translations.find((x) => x.locale === locale) || settings?.translations.find((x) => x.locale === 'en');
    const mapped = trips.map((trip) => this.mapTrip(trip, locale));

    const payload = {
      settings: settings
        ? {
            siteTitle: settings.siteTitle,
            logoUrl: settings.logoUrl,
            faviconUrl: settings.faviconUrl,
            whatsapp: settings.whatsapp,
            viber: settings.viber,
            email: settings.email,
            wechatId: settings.wechatId,
            wechatQrUrl: settings.wechatQrUrl,
            address: settings.address,
            phone: settings.phone,
            trekkerCount: settings.trekkerCount,
            yearsGuiding: settings.yearsGuiding,
            tagline: t?.tagline ?? '',
            heroHeadline: t?.heroHeadline ?? '',
            heroSubhead: t?.heroSubhead ?? '',
            introTitle: t?.introTitle ?? '',
            introBody: t?.introBody ?? '',
            aboutTitle: t?.aboutTitle ?? '',
            aboutBody: t?.aboutBody ?? '',
          }
        : null,
      treks: mapped.filter((x) => x.kind === 'trek'),
      rafting: mapped.filter((x) => x.kind === 'rafting'),
      activities: mapped.filter((x) => x.kind === 'activity'),
      safaris: mapped.filter((x) => x.kind === 'safari'),
      trips: mapped,
      faqs: faqs.map((f) => {
        const tr = f.translations.find((x) => x.locale === locale) || f.translations.find((x) => x.locale === 'en');
        return { id: f.id, question: tr?.question ?? '', answer: tr?.answer ?? '' };
      }),
      testimonials: testimonials.map((item) => {
        const tr = item.translations.find((x) => x.locale === locale) || item.translations.find((x) => x.locale === 'en');
        return { id: item.id, quote: tr?.quote ?? '', attribution: tr?.attribution ?? '' };
      }),
    };

    await this.redis.client.set(cacheKey, JSON.stringify(payload), 'EX', CACHE_TTL);
    return payload;
  }
}
