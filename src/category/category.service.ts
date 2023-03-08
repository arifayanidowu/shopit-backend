import { HttpException, Injectable } from '@nestjs/common';
import { Prisma, Category } from '@prisma/client';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    categoryWhereUniqueInput: Prisma.CategoryWhereUniqueInput,
  ): Promise<Category | null> {
    try {
      return await this.prisma.category.findUnique({
        where: categoryWhereUniqueInput,
      });
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CategoryWhereUniqueInput;
    where?: Prisma.CategoryWhereInput;
    orderBy?: Prisma.CategoryOrderByWithRelationInput;
  }): Promise<Category[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return await this.prisma.category.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createCategory(data: Prisma.CategoryCreateInput): Promise<Category> {
    try {
      return await this.prisma.category.create({ data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(
            `This is a unique constraint violation, Category with (${error.meta.target}) already exists`,
            422,
          );
        }
      }
      throw error;
    }
  }

  async updateCategory(params: {
    where: Prisma.CategoryWhereUniqueInput;
    data: Prisma.CategoryUpdateInput;
  }): Promise<Category> {
    const { where, data } = params;
    try {
      return await this.prisma.category.update({
        data,
        where,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(
            `This is a unique constraint violation, Category with (${error.meta.target}) already exists`,
            422,
          );
        } else if (error.code === 'P2025') {
          throw new HttpException('Record to update does not exist.', 422);
        }
      }
      throw error;
    }
  }

  async upsertCategory(params: {
    where: Prisma.CategoryWhereUniqueInput;
    update: Prisma.CategoryUpdateInput;
    create: Prisma.CategoryCreateInput;
  }): Promise<Category> {
    const { where, create, update } = params;
    try {
      return await this.prisma.category.upsert({
        where,
        update,
        create,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(
            `This is a unique constraint violation, Category with (${error.meta.target}) already exists`,
            422,
          );
        }
      }
      throw error;
    }
  }

  async deleteCategory(
    where: Prisma.CategoryWhereUniqueInput,
  ): Promise<Category> {
    try {
      return await this.prisma.category.delete({
        where,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new HttpException('Record to delete does not exist.', 422);
        } else {
          throw new HttpException('Internal server error', 500);
        }
      }
      throw error;
    }
  }
}
