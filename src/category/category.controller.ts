import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryHandler } from './handler/category.handler';
import { Category } from '@prisma/client';
import { CategoryEntity } from './entity/category.entity';
import { Auth } from 'src/auth/guards/auth.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Auth(new CategoryHandler())
  async findAll() {
    return this.categoryService.findAll({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  @Get(':id')
  @Auth(new CategoryHandler())
  async findOne(@Param('id') id: string): Promise<Category> {
    return await this.categoryService.findOne({ id });
  }

  @Post('create')
  @Auth(new CategoryHandler())
  async create(@Body() body: CategoryEntity) {
    const data = new CategoryEntity({
      ...body,
    });
    return await this.categoryService.createCategory(data);
  }

  @Patch('update/:id')
  @Auth(new CategoryHandler())
  async update(@Param('id') id: string, @Body() body: CategoryEntity) {
    const data = new CategoryEntity({
      ...body,
      updatedAt: new Date(),
    });

    return await this.categoryService.updateCategory({
      where: { id },
      data,
    });
  }

  @Delete('delete/:id')
  @Auth(new CategoryHandler())
  async delete(@Param('id') id: string) {
    return await this.categoryService.deleteCategory({ id });
  }
}
