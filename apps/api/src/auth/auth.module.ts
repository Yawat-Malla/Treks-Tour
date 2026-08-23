import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AdminGuard } from './admin.guard';

@Module({
  controllers: [AuthController],
  providers: [AdminGuard],
  exports: [AdminGuard],
})
export class AuthModule {}
