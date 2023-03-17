import {
  Controller,
  Get,
  UseGuards,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CategoryService } from './category.service';
import { PoliciesGuard } from 'src/casl/guard/policies.guard';
import { CheckPolicies } from 'src/casl/decorator/check-policies.decorator';
import { CategoryHandler } from './handler/category.handler';
import { Category } from '@prisma/client';
import { CategoryEntity } from './entity/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(new CategoryHandler())
  async findAll(): Promise<Category[]> {
    return await this.categoryService.findAll({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(new CategoryHandler())
  async findOne(@Param('id') id: string): Promise<Category> {
    return await this.categoryService.findOne({ id });
  }

  @Post('create')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(new CategoryHandler())
  async create(@Body() body: CategoryEntity) {
    const data = new CategoryEntity({
      ...body,
      name: body.name.trim().toLowerCase(),
    });

    return await this.categoryService.createCategory(data);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(new CategoryHandler())
  async update(@Param('id') id: string, @Body() body: CategoryEntity) {
    const data = new CategoryEntity({
      ...body,
      name: body.name.trim().toLowerCase(),
    });

    return await this.categoryService.updateCategory({
      where: { id },
      data,
    });
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(new CategoryHandler())
  async delete(@Param('id') id: string) {
    return await this.categoryService.deleteCategory({ id });
  }
}
