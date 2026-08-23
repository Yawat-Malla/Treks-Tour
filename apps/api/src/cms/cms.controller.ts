import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Locale, Prisma } from '@prisma/client';
import { AdminGuard } from '../auth/admin.guard';
import { PrismaService } from '../prisma/prisma.service';
import { ContentCache } from '../public/content-cache.service';
import { UpdateBookingDto, UpdateSettingsDto, UpsertTrekDto } from './cms.dto';

@Controller('cms')
@UseGuards(AdminGuard)
export class CmsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: ContentCache,
  ) {}

  @Get('settings')
  settings() {
    return this.prisma.siteSettings.findUnique({
      where: { id: 'singleton' },
      include: { translations: true },
    });
  }

  @Patch('settings')
  async updateSettings(@Body() body: UpdateSettingsDto) {
    const { translations, ...rest } = body;
    const settings = await this.prisma.siteSettings.update({
      where: { id: 'singleton' },
      data: {
        ...rest,
        translations: translations
          ? {
              deleteMany: {},
              create: translations.map((t) => ({
                locale: t.locale as Locale,
                tagline: t.tagline,
                heroHeadline: t.heroHeadline,
                heroSubhead: t.heroSubhead,
                introTitle: t.introTitle,
                introBody: t.introBody,
                aboutTitle: t.aboutTitle,
                aboutBody: t.aboutBody,
              })),
            }
          : undefined,
      },
      include: { translations: true },
    });
    await this.cache.invalidate();
    return settings;
  }

  @Get('treks')
  treks() {
    return this.prisma.trek.findMany({
      include: { translations: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  @Get('treks/:id')
  async trek(@Param('id') id: string) {
    const trek = await this.prisma.trek.findUnique({
      where: { id },
      include: { translations: true },
    });
    if (!trek) throw new NotFoundException();
    return trek;
  }

  @Post('treks')
  async createTrek(@Body() body: UpsertTrekDto) {
    const trek = await this.prisma.trek.create({
      data: this.trekData(body),
      include: { translations: true },
    });
    await this.cache.invalidate();
    return trek;
  }

  @Patch('treks/:id')
  async updateTrek(@Param('id') id: string, @Body() body: UpsertTrekDto) {
    await this.prisma.trekTranslation.deleteMany({ where: { trekId: id } });
    const trek = await this.prisma.trek.update({
      where: { id },
      data: this.trekData(body),
      include: { translations: true },
    });
    await this.cache.invalidate();
    return trek;
  }

  @Delete('treks/:id')
  async deleteTrek(@Param('id') id: string) {
    await this.prisma.booking.deleteMany({ where: { trekId: id } });
    await this.prisma.trek.delete({ where: { id } });
    await this.cache.invalidate();
    return { ok: true };
  }

  @Get('bookings')
  bookings() {
    return this.prisma.booking.findMany({
      include: {
        trek: { include: { translations: { where: { locale: 'en' } } } },
        addon: { include: { translations: { where: { locale: 'en' } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Patch('bookings/:id')
  updateBooking(@Param('id') id: string, @Body() body: UpdateBookingDto) {
    return this.prisma.booking.update({
      where: { id },
      data: body,
      include: { trek: { include: { translations: { where: { locale: 'en' } } } }, addon: { include: { translations: { where: { locale: 'en' } } } } },
    });
  }

  private trekData(body: UpsertTrekDto) {
    return {
      slug: body.slug,
      durationDays: body.durationDays,
      difficulty: body.difficulty,
      maxAltitudeM: body.maxAltitudeM,
      priceFromUsd: body.priceFromUsd,
      season: body.season,
      heroImageUrl: body.heroImageUrl,
      gallery: body.gallery,
      featured: body.featured,
      published: body.published,
      sortOrder: body.sortOrder,
      kind: body.kind,
      inclusions: body.inclusions,
      exclusions: body.exclusions,
      bestMonths: body.bestMonths,
      river: body.river,
      grade: body.grade,
      minAge: body.minAge,
      altitudeProfile: body.altitudeProfile as Prisma.InputJsonValue,
      translations: {
        create: body.translations.map((t) => ({
          locale: t.locale as Locale,
          name: t.name,
          summary: t.summary,
          description: t.description,
          itinerary: t.itinerary as Prisma.InputJsonValue,
          seasonLabel: t.seasonLabel,
          difficultyLabel: t.difficultyLabel,
        })),
      },
    };
  }
}
