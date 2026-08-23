import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Locale } from '@prisma/client';
import type { Request } from 'express';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { ContentCache } from './content-cache.service';
import { CreateBookingDto } from './create-booking.dto';

const LOCALES: Locale[] = ['en', 'zh', 'ko', 'he'];

function asLocale(value?: string): Locale {
  return LOCALES.includes(value as Locale) ? (value as Locale) : 'en';
}

@Controller('public')
export class PublicController {
  constructor(
    private readonly cache: ContentCache,
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly mail: MailService,
    private readonly config: ConfigService,
  ) {}

  @Get('site')
  async site(@Query('locale') locale?: string) {
    return this.cache.getPublic(asLocale(locale));
  }

  @Get('treks/:slug')
  async trek(@Param('slug') slug: string, @Query('locale') locale?: string) {
    const data = await this.cache.getPublic(asLocale(locale));
    const trek = data.trips.find((t: { slug: string }) => t.slug === slug);
    if (!trek) throw new NotFoundException('Trip not found');
    return { settings: data.settings, trek, trips: data.trips };
  }

  @Post('bookings')
  async book(@Body() body: CreateBookingDto, @Req() req: Request) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `book:${ip}`;
    const n = Number((await this.redis.client.get(key)) || 0);
    if (n >= 8) {
      throw new UnauthorizedException('Too many booking requests. Please try later or message us on WhatsApp.');
    }
    await this.redis.client.set(key, String(n + 1), 'EX', 60 * 60);

    const trek = await this.prisma.trek.findFirst({
      where: { id: body.trekId, published: true },
      include: { translations: true },
    });
    if (!trek) throw new NotFoundException('Trip not found');

    let addonTrekId: string | null = null;
    if (body.addonTrekId) {
      const addon = await this.prisma.trek.findFirst({
        where: { id: body.addonTrekId, published: true, kind: 'rafting' },
      });
      if (addon) addonTrekId = addon.id;
    }

    const reference = `AT-${randomBytes(3).toString('hex').toUpperCase()}`;
    const booking = await this.prisma.booking.create({
      data: {
        reference,
        trekId: trek.id,
        addonTrekId,
        privateDeparture: Boolean(body.privateDeparture),
        locale: body.locale,
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        nationality: body.nationality,
        startDate: new Date(body.startDate),
        groupSize: body.groupSize,
        message: body.message || null,
      },
      include: { addon: { include: { translations: true } } },
    });

    const name = trek.translations.find((t) => t.locale === body.locale)?.name || trek.translations.find((t) => t.locale === 'en')?.name || trek.slug;
    const addonName = booking.addon
      ? booking.addon.translations.find((t) => t.locale === body.locale)?.name ||
        booking.addon.translations.find((t) => t.locale === 'en')?.name
      : null;
    const company = this.config.get<string>('COMPANY_EMAIL') || 'hello@annapurnatrails.com';
    const text = [
      `Booking ${reference}`,
      `Trip: ${name} (${trek.kind})`,
      addonName ? `Add-on: ${addonName}` : '',
      body.privateDeparture ? 'Private departure requested' : '',
      `Name: ${body.fullName}`,
      `Email: ${body.email}`,
      `Phone: ${body.phone}`,
      `Nationality: ${body.nationality}`,
      `Start: ${body.startDate}`,
      `Group: ${body.groupSize}`,
      body.message ? `Message: ${body.message}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    await this.mail.send(
      body.email,
      `Annapurna Trails — ${reference}`,
      `Namaste ${body.fullName},\n\nWe have your request ${reference} for ${name}. A manager in Pokhara will confirm dates, permits, and the next steps. No account was created.\n\n${text}\n\nAnnapurna Trails, Lakeside, Pokhara`,
    );
    await this.mail.send(company, `New booking ${reference} — ${name}`, text);

    return {
      reference: booking.reference,
      trekName: name,
      kind: trek.kind,
      addonName,
      privateDeparture: booking.privateDeparture,
      startDate: booking.startDate,
      groupSize: booking.groupSize,
    };
  }
}
