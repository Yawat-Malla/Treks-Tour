import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { ContentCache } from './content-cache.service';
import { GooglePlacesService } from './google-places.service';

@Module({
  controllers: [PublicController],
  providers: [ContentCache, GooglePlacesService],
  exports: [ContentCache, GooglePlacesService],
})
export class PublicModule {}
