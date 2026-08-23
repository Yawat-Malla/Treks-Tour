import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PublicModule } from '../public/public.module';
import { CmsController } from './cms.controller';

@Module({
  imports: [AuthModule, PublicModule],
  controllers: [CmsController],
})
export class CmsModule {}
