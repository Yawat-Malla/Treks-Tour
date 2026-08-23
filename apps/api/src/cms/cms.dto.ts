import { Type } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class TranslationDto {
  @IsIn(['en', 'zh', 'ko', 'he'])
  locale!: 'en' | 'zh' | 'ko' | 'he';

  @IsString()
  @MaxLength(200)
  tagline!: string;

  @IsString()
  @MaxLength(400)
  heroHeadline!: string;

  @IsString()
  @MaxLength(800)
  heroSubhead!: string;

  @IsString()
  @MaxLength(200)
  introTitle!: string;

  @IsString()
  @MaxLength(4000)
  introBody!: string;

  @IsString()
  @MaxLength(200)
  aboutTitle!: string;

  @IsString()
  @MaxLength(6000)
  aboutBody!: string;
}

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  siteTitle?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string | null;

  @IsOptional()
  @IsString()
  faviconUrl?: string | null;

  @IsOptional()
  @IsString()
  whatsapp?: string;

  @IsOptional()
  @IsString()
  viber?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  wechatId?: string;

  @IsOptional()
  @IsString()
  wechatQrUrl?: string | null;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  trekkerCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  yearsGuiding?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranslationDto)
  translations?: TranslationDto[];
}

export class TrekTranslationDto {
  @IsIn(['en', 'zh', 'ko', 'he'])
  locale!: 'en' | 'zh' | 'ko' | 'he';

  @IsString()
  name!: string;

  @IsString()
  summary!: string;

  @IsString()
  description!: string;

  @Allow()
  itinerary!: unknown;

  @IsString()
  seasonLabel!: string;

  @IsString()
  difficultyLabel!: string;
}

export class UpsertTrekDto {
  @IsString()
  slug!: string;

  @IsInt()
  @Min(1)
  durationDays!: number;

  @IsString()
  difficulty!: string;

  @IsInt()
  @Min(0)
  maxAltitudeM!: number;

  @IsInt()
  @Min(0)
  priceFromUsd!: number;

  @IsString()
  season!: string;

  @IsString()
  heroImageUrl!: string;

  @IsArray()
  @IsString({ each: true })
  gallery!: string[];

  @IsBoolean()
  featured!: boolean;

  @IsBoolean()
  published!: boolean;

  @IsInt()
  sortOrder!: number;

  @IsIn(['trek', 'rafting'])
  kind!: 'trek' | 'rafting';

  @IsArray()
  @IsString({ each: true })
  inclusions!: string[];

  @IsArray()
  @IsString({ each: true })
  exclusions!: string[];

  @IsArray()
  @IsInt({ each: true })
  bestMonths!: number[];

  @IsOptional()
  @IsString()
  river?: string | null;

  @IsOptional()
  @IsString()
  grade?: string | null;

  @IsOptional()
  @IsInt()
  minAge?: number | null;

  @Allow()
  altitudeProfile?: unknown;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrekTranslationDto)
  translations!: TrekTranslationDto[];
}

export class UpdateBookingDto {
  @IsOptional()
  @IsIn(['new', 'contacted', 'confirmed', 'cancelled'])
  status?: 'new' | 'contacted' | 'confirmed' | 'cancelled';

  @IsOptional()
  @IsString()
  staffNotes?: string;
}
