import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BrandService } from './brand.service';
import { CreateBrandHandler } from './handlers/create-brand.handler';
import { FileInterceptor } from '@nestjs/platform-express';
import { BrandEntity } from './entity/brand.entity';
import { uploadImage } from 'src/utils/cloudinary.utils';
import { Brand } from '@prisma/client';
import { Auth } from 'src/auth/guards/auth.guard';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.brandService.findAll({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        products: true,
      },
    });
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('logo'), ClassSerializerInterceptor)
  @Auth(new CreateBrandHandler())
  async create(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /png|jpeg|jpg|svg|webp/gi,
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 4,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Body() body: BrandEntity,
  ) {
    const data = new BrandEntity({
      ...body,
    });

    data.logo = await uploadImage(file);

    return await this.brandService.createBrand(data);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'), ClassSerializerInterceptor)
  @Auth(new CreateBrandHandler())
  async update(
    @Param('id') id: string,
    @Body() body: BrandEntity,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|svg|webp)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    const data = new BrandEntity({
      ...body,
      updatedAt: new Date(),
    });
    if (file) {
      data.logo = await uploadImage(file);
    }

    return await this.brandService.updateBrand({
      where: {
        id,
      },
      data,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getBrand(@Param('id') id: string): Promise<Brand> {
    return await this.brandService.findOne({
      id,
    });
  }

  @Delete(':id')
  @Auth(new CreateBrandHandler())
  async deleteBrand(@Param('id') id: string) {
    return await this.brandService.deleteBrand({
      id,
    });
  }
}
