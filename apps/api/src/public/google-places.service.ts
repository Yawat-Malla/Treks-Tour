import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';

export type GoogleReview = {
  authorName: string;
  profilePhotoUrl: string | null;
  rating: number;
  relativeTime: string;
  text: string;
  authorUri: string | null;
};

export type GoogleReviewsPayload = {
  rating: number;
  userRatingCount: number;
  mapsUri: string;
  displayName: string;
  reviews: GoogleReview[];
};

const CACHE_KEY = 'public:google-reviews';
const CACHE_TTL_SEC = 60 * 60 * 12; // 12 hours
const SEARCH_QUERY = 'Shalom Treks and Travel Lakeside Pokhara';

@Injectable()
export class GooglePlacesService {
  private readonly logger = new Logger(GooglePlacesService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisService,
  ) {}

  async invalidate() {
    await this.redis.client.del(CACHE_KEY);
  }

  async getReviews(opts: {
    placeId?: string | null;
    mapsUrl?: string | null;
  }): Promise<GoogleReviewsPayload | null> {
    const apiKey = this.config.get<string>('GOOGLE_PLACES_API_KEY')?.trim();
    if (!apiKey) return null;

    const cached = await this.redis.client.get(CACHE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached) as GoogleReviewsPayload;
      } catch {
        /* refetch */
      }
    }

    try {
      let placeId = (opts.placeId || '').trim();
      if (!placeId) {
        placeId = (await this.searchPlaceId(apiKey, SEARCH_QUERY)) || '';
      }
      if (!placeId) {
        this.logger.warn('No Google Place ID configured and text search returned nothing');
        return null;
      }

      const payload = await this.fetchPlaceDetails(apiKey, placeId, opts.mapsUrl || null);
      if (payload) {
        await this.redis.client.set(CACHE_KEY, JSON.stringify(payload), 'EX', CACHE_TTL_SEC);
      }
      return payload;
    } catch (err) {
      this.logger.warn(`Google Places fetch failed: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }
  }

  private async searchPlaceId(apiKey: string, textQuery: string): Promise<string | null> {
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName',
      },
      body: JSON.stringify({ textQuery, maxResultCount: 1 }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      this.logger.warn(`Places searchText ${res.status}: ${body.slice(0, 200)}`);
      return null;
    }
    const data = (await res.json()) as { places?: { id?: string }[] };
    const id = data.places?.[0]?.id;
    return id || null;
  }

  private async fetchPlaceDetails(
    apiKey: string,
    placeId: string,
    fallbackMapsUri: string | null,
  ): Promise<GoogleReviewsPayload | null> {
    const resource = placeId.startsWith('places/') ? placeId : `places/${placeId}`;
    const res = await fetch(`https://places.googleapis.com/v1/${resource}`, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask':
          'id,displayName,rating,userRatingCount,googleMapsUri,reviews',
      },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      this.logger.warn(`Places details ${res.status}: ${body.slice(0, 200)}`);
      return null;
    }

    const data = (await res.json()) as {
      displayName?: { text?: string };
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
      reviews?: {
        rating?: number;
        text?: { text?: string };
        relativePublishTimeDescription?: string;
        authorAttribution?: {
          displayName?: string;
          uri?: string;
          photoUri?: string;
        };
      }[];
    };

    const reviews: GoogleReview[] = (data.reviews || []).slice(0, 5).map((r) => ({
      authorName: r.authorAttribution?.displayName || 'Google user',
      profilePhotoUrl: r.authorAttribution?.photoUri || null,
      rating: typeof r.rating === 'number' ? r.rating : 5,
      relativeTime: r.relativePublishTimeDescription || '',
      text: r.text?.text || '',
      authorUri: r.authorAttribution?.uri || null,
    }));

    return {
      rating: typeof data.rating === 'number' ? data.rating : 0,
      userRatingCount: typeof data.userRatingCount === 'number' ? data.userRatingCount : 0,
      mapsUri: data.googleMapsUri || fallbackMapsUri || '',
      displayName: data.displayName?.text || 'Google reviews',
      reviews,
    };
  }
}
