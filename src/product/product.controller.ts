import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Get,
  UseGuards,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  Req,
} from '@nestjs/common';
import { Express } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProductService } from './product.service';
import { PoliciesGuard } from 'src/casl/guard/policies.guard';
import { CheckPolicies } from 'src/casl/decorator/check-policies.decorator';
import { ProductHandler } from './handler/product.handler';
import { Product } from '@prisma/client';
import { uploadImage } from 'src/utils/cloudinary.utils';
import { ProductEntity } from './entity/product.entity';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(new ProductHandler())
  async findAll(): Promise<{ statusCode: number; data: Product[] }> {
    const result = await this.productService.findAll({});
    return {
      statusCode: 200,
      data: result,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(new ProductHandler())
  async findOne(
    @Param('id') id: string,
  ): Promise<{ statusCode: number; data: Product }> {
    const result = await this.productService.findOne({ id });
    return {
      statusCode: 200,
      data: result,
    };
  }

  @Post('create')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @UseInterceptors(FileInterceptor('file'), ClassSerializerInterceptor)
  @CheckPolicies(new ProductHandler())
  async create(
    @Req() req,
    @Body() body: ProductEntity,
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
  ) {
    const data = new ProductEntity({
      ...body,
      name: body.name.trim().toLowerCase(),
      createdById: req.user.id,
      image: await uploadImage(file),
      price: Number(body.price),
      quantity: Number(body.quantity),
    });

    const result = await this.productService.createProduct(data);
    return {
      statusCode: 201,
      data: result,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @UseInterceptors(FileInterceptor('file'), ClassSerializerInterceptor)
  @CheckPolicies(new ProductHandler())
  async update(
    @Param('id') id: string,
    @Body() body: ProductEntity,
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
    const data = new ProductEntity({
      ...body,
      name: body.name.trim().toLowerCase(),
      price: Number(body.price),
      quantity: Number(body.quantity),
    });
    if (file) {
      data.image = await uploadImage(file);
    }
    const result = await this.productService.updateProduct({
      where: { id },
      data,
    });
    return {
      statusCode: 200,
      data: result,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(new ProductHandler())
  async delete(@Param('id') id: string) {
    const result = await this.productService.deleteProduct({ id });
    return {
      statusCode: 200,
      data: result,
    };
  }
}
