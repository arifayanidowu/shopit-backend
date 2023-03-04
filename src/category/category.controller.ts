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
  async findAll(): Promise<{ statusCode: number; data: Category[] }> {
    const result = await this.categoryService.findAll({});
    return {
      statusCode: 200,
      data: result,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(new CategoryHandler())
  async findOne(
    @Param('id') id: string,
  ): Promise<{ statusCode: number; data: Category }> {
    const result = await this.categoryService.findOne({ id });
    return {
      statusCode: 200,
      data: result,
    };
  }

  @Post('create')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(new CategoryHandler())
  async create(@Body() body: CategoryEntity) {
    const data = new CategoryEntity({
      ...body,
      name: body.name.trim().toLowerCase(),
    });

    const result = await this.categoryService.createCategory(data);
    return {
      statusCode: 201,
      data: result,
    };
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(new CategoryHandler())
  async update(@Param('id') id: string, @Body() body: CategoryEntity) {
    const data = new CategoryEntity({
      ...body,
      name: body.name.trim().toLowerCase(),
    });

    const result = await this.categoryService.updateCategory({
      where: { id },
      data,
    });
    return {
      statusCode: 200,
      data: result,
    };
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(new CategoryHandler())
  async delete(@Param('id') id: string) {
    await this.categoryService.deleteCategory({ id });
    return {
      statusCode: 200,
      data: null,
      message: 'Category deleted successfully',
    };
  }
}
