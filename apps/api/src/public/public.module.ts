import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { ContentCache } from './content-cache.service';

@Module({
  controllers: [PublicController],
  providers: [ContentCache],
  exports: [ContentCache],
})
export class PublicModule {}
