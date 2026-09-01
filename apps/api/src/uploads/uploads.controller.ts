import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { mkdirSync } from 'fs';
import { randomBytes } from 'crypto';
import { AdminGuard } from '../auth/admin.guard';
import { PrismaService } from '../prisma/prisma.service';

const uploadDir = process.env.UPLOAD_DIR || './uploads';
mkdirSync(uploadDir, { recursive: true });

@Controller('cms')
@UseGuards(AdminGuard)
export class UploadsController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('uploads')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadDir,
        filename: (_req, file, cb) => {
          const name = randomBytes(8).toString('hex') + extname(file.originalname || '.bin');
          cb(null, name);
        },
      }),
      limits: { fileSize: 40 * 1024 * 1024 },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    const url = `${process.env.API_ORIGIN || 'http://localhost:4000'}/uploads/${file.filename}`;
    await this.prisma.mediaAsset.create({
      data: {
        url,
        filename: file.originalname || file.filename,
        mimeType: file.mimetype,
      },
    });
    return { url };
  }
}
