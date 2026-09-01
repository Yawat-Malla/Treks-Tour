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
import {
  UpdateBookingDto,
  UpdateSettingsDto,
  UpsertBlogPostDto,
  UpsertFaqDto,
  UpsertTestimonialDto,
  UpsertTrekDto,
} from './cms.dto';

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
    const { translations, associations, chips, ...rest } = body;
    const settings = await this.prisma.siteSettings.update({
      where: { id: 'singleton' },
      data: {
        ...rest,
        associations: associations === undefined ? undefined : (associations as Prisma.InputJsonValue),
        chips: chips === undefined ? undefined : (chips as Prisma.InputJsonValue),
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
                pages: (t.pages ?? {}) as Prisma.InputJsonValue,
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

  @Get('faqs')
  faqs() {
    return this.prisma.faq.findMany({
      include: { translations: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  @Post('faqs')
  async createFaq(@Body() body: UpsertFaqDto) {
    const faq = await this.prisma.faq.create({
      data: this.faqData(body),
      include: { translations: true },
    });
    await this.cache.invalidate();
    return faq;
  }

  @Patch('faqs/:id')
  async updateFaq(@Param('id') id: string, @Body() body: UpsertFaqDto) {
    await this.prisma.faqTranslation.deleteMany({ where: { faqId: id } });
    const faq = await this.prisma.faq.update({
      where: { id },
      data: this.faqData(body),
      include: { translations: true },
    });
    await this.cache.invalidate();
    return faq;
  }

  @Delete('faqs/:id')
  async deleteFaq(@Param('id') id: string) {
    await this.prisma.faq.delete({ where: { id } });
    await this.cache.invalidate();
    return { ok: true };
  }

  @Get('testimonials')
  testimonials() {
    return this.prisma.testimonial.findMany({
      include: { translations: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  @Post('testimonials')
  async createTestimonial(@Body() body: UpsertTestimonialDto) {
    const item = await this.prisma.testimonial.create({
      data: this.testimonialData(body),
      include: { translations: true },
    });
    await this.cache.invalidate();
    return item;
  }

  @Patch('testimonials/:id')
  async updateTestimonial(@Param('id') id: string, @Body() body: UpsertTestimonialDto) {
    await this.prisma.testimonialTranslation.deleteMany({ where: { testimonialId: id } });
    const item = await this.prisma.testimonial.update({
      where: { id },
      data: this.testimonialData(body),
      include: { translations: true },
    });
    await this.cache.invalidate();
    return item;
  }

  @Delete('testimonials/:id')
  async deleteTestimonial(@Param('id') id: string) {
    await this.prisma.testimonial.delete({ where: { id } });
    await this.cache.invalidate();
    return { ok: true };
  }

  @Get('blog')
  blog() {
    return this.prisma.blogPost.findMany({
      include: { translations: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  @Get('blog/:id')
  async blogPost(@Param('id') id: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
      include: { translations: true },
    });
    if (!post) throw new NotFoundException();
    return post;
  }

  @Post('blog')
  async createBlog(@Body() body: UpsertBlogPostDto) {
    const post = await this.prisma.blogPost.create({
      data: this.blogData(body),
      include: { translations: true },
    });
    await this.cache.invalidate();
    return post;
  }

  @Patch('blog/:id')
  async updateBlog(@Param('id') id: string, @Body() body: UpsertBlogPostDto) {
    await this.prisma.blogPostTranslation.deleteMany({ where: { postId: id } });
    const post = await this.prisma.blogPost.update({
      where: { id },
      data: this.blogData(body),
      include: { translations: true },
    });
    await this.cache.invalidate();
    return post;
  }

  @Delete('blog/:id')
  async deleteBlog(@Param('id') id: string) {
    await this.prisma.blogPost.delete({ where: { id } });
    await this.cache.invalidate();
    return { ok: true };
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

  private faqData(body: UpsertFaqDto) {
    return {
      sortOrder: body.sortOrder,
      translations: {
        create: body.translations.map((t) => ({
          locale: t.locale as Locale,
          question: t.question,
          answer: t.answer,
        })),
      },
    };
  }

  private testimonialData(body: UpsertTestimonialDto) {
    return {
      sortOrder: body.sortOrder,
      translations: {
        create: body.translations.map((t) => ({
          locale: t.locale as Locale,
          quote: t.quote,
          attribution: t.attribution,
        })),
      },
    };
  }

  private blogData(body: UpsertBlogPostDto) {
    return {
      slug: body.slug,
      heroImageUrl: body.heroImageUrl,
      featured: body.featured,
      published: body.published,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
      sortOrder: body.sortOrder,
      translations: {
        create: body.translations.map((t) => ({
          locale: t.locale as Locale,
          title: t.title,
          excerpt: t.excerpt,
          body: t.body,
        })),
      },
    };
  }
}
