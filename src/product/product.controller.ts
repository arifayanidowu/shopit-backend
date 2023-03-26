import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Get,
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
import { ProductService } from './product.service';
import { ProductHandler } from './handler/product.handler';
import { Product } from '@prisma/client';
import { generateSku } from 'src/utils/sku';
import { uploadImage } from 'src/utils/cloudinary.utils';
import { ProductEntity } from './entity/product.entity';
import { Auth } from 'src/auth/guards/auth.guard';
import { GetProductsHandler } from './handler/get-products.handler';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @Auth(new GetProductsHandler())
  async findAll(): Promise<Product[]> {
    return await this.productService.findAll({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
        brand: true,
      },
    });
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('file'), ClassSerializerInterceptor)
  @Auth(new ProductHandler())
  async create(
    @Req() req,
    @Body() body: ProductEntity,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|svg|webp)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    const data = new ProductEntity({
      ...body,
      image: await uploadImage(file),
      price: Number(body.price),
      quantity: Number(body.quantity),
      sku: generateSku(body),
      createdById: req.user.id,
    });

    return await this.productService.createProduct(data);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'), ClassSerializerInterceptor)
  @Auth(new ProductHandler())
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
      price: body.price && Number(body.price),
      quantity: body.quantity && Number(body.quantity),
      updatedAt: new Date(),
    });
    if (file) {
      data.image = await uploadImage(file);
    }
    return await this.productService.updateProduct({
      where: { id },
      data,
    });
  }

  @Get(':id')
  @Auth(new ProductHandler())
  async findOne(@Param('id') id: string): Promise<Product> {
    return await this.productService.findOne({ id });
  }

  @Delete(':id')
  @Auth(new ProductHandler())
  async delete(@Param('id') id: string) {
    return await this.productService.deleteProduct({ id });
  }

  @Get('batch/:id')
  async getBatchProducts(@Param('id') batchId: string) {
    return await this.productService.batchProducts({
      where: { id: batchId },
    });
  }
}
