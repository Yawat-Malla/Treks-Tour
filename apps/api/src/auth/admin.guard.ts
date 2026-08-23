import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly redis: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<{ cookies?: Record<string, string> }>();
    const token = req.cookies?.admin_session;
    if (!token) {
      throw new UnauthorizedException('Staff session required');
    }
    const ok = await this.redis.client.get(`admin:session:${token}`);
    if (!ok) {
      throw new UnauthorizedException('Staff session expired');
    }
    return true;
  }
}
