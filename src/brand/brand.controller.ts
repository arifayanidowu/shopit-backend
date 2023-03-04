import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BrandService } from './brand.service';
import { PoliciesGuard } from 'src/casl/guard/policies.guard';
import { CheckPolicies } from 'src/casl/decorator/check-policies.decorator';
import { CreateBrandHandler } from './handlers/create-brand.handler';
import { FileInterceptor } from '@nestjs/platform-express';
import { BrandEntity } from './entity/brand.entity';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.brandService.findAll({});
  }

  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('file'), ClassSerializerInterceptor)
  @CheckPolicies(new CreateBrandHandler())
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|svg|webp)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
    @Body() body: BrandEntity,
  ) {
    const data = new BrandEntity({
      ...body,
      name: body.name.trim().toLowerCase(),
    });
    return this.brandService.createBrand(data, file);
  }
}
