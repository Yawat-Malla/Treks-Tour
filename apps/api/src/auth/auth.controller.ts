import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { randomBytes, timingSafeEqual } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import { PinDto } from './pin.dto';

function pinEquals(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    timingSafeEqual(left, Buffer.alloc(left.length));
    return false;
  }
  return timingSafeEqual(left, right);
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly redis: RedisService,
    private readonly config: ConfigService,
  ) {}

  @Get('me')
  async me(@Req() req: Request) {
    const token = req.cookies?.admin_session;
    if (!token) return { authenticated: false };
    const ok = await this.redis.client.get(`admin:session:${token}`);
    return { authenticated: Boolean(ok) };
  }

  @Post('pin')
  @HttpCode(200)
  async pin(@Body() body: PinDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `admin:pin:${ip}`;
    const attempts = Number((await this.redis.client.get(key)) || 0);
    if (attempts >= 5) {
      throw new UnauthorizedException('Too many attempts. Wait 15 minutes.');
    }

    const expected = this.config.get<string>('ADMIN_PIN') || '482916';
    if (!pinEquals(body.pin, expected)) {
      await this.redis.client.set(key, String(attempts + 1), 'EX', 15 * 60);
      throw new UnauthorizedException('Incorrect PIN');
    }

    await this.redis.client.del(key);
    const token = randomBytes(32).toString('hex');
    await this.redis.client.set(`admin:session:${token}`, '1', 'EX', 60 * 60 * 12);

    res.cookie('admin_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 12 * 60 * 60 * 1000,
      path: '/',
    });

    return { ok: true };
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.admin_session;
    if (token) {
      await this.redis.client.del(`admin:session:${token}`);
    }
    res.clearCookie('admin_session', { path: '/' });
    return { ok: true };
  }
}
