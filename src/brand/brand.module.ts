import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { MulterModule } from '@nestjs/platform-express';
import { BrandController } from './brand.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  imports: [
    AuthModule,
    MulterModule.registerAsync({
      useFactory: async () => {
        return {
          dest: './upload',
        };
      },
    }),
  ],
  controllers: [BrandController],
  providers: [BrandService, PrismaService],
})
export class BrandModule {}
