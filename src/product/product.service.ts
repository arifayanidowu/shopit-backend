import { HttpException, Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    productWhereUniqueInput: Prisma.ProductWhereUniqueInput,
  ): Promise<Product | null> {
    try {
      return await this.prisma.product.findUnique({
        where: productWhereUniqueInput,
      });
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProductWhereUniqueInput;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }): Promise<Product[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return await this.prisma.product.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createProduct(data: Prisma.ProductCreateInput): Promise<Product> {
    try {
      return await this.prisma.product.create({ data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(
            `This is a unique constraint violation, Product name (${data.name}) already exists`,
            422,
          );
        }
      }
      throw error;
    }
  }

  async updateProduct(params: {
    where: Prisma.ProductWhereUniqueInput;
    data: Prisma.ProductUpdateInput;
  }): Promise<Product> {
    const { where, data } = params;
    try {
      return await this.prisma.product.update({
        where,
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(
            `This is a unique constraint violation, Product name (${data.name}) already exists`,
            422,
          );
        } else if (error.code === 'P2025') {
          throw new HttpException('Record to update does not exist.', 422);
        }
      }
      throw error;
    }
  }

  async upsertProduct(params: {
    where: Prisma.ProductWhereUniqueInput;
    update: Prisma.ProductUpdateInput;
    create: Prisma.ProductCreateInput;
  }): Promise<Product> {
    const { where, create, update } = params;
    try {
      return await this.prisma.product.upsert({
        where,
        update,
        create,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(
            `This is a unique constraint violation, Product name (${update.name}) already exists`,
            422,
          );
        }
      }
      throw error;
    }
  }

  async deleteProduct(where: Prisma.ProductWhereUniqueInput): Promise<Product> {
    try {
      return await this.prisma.product.delete({
        where,
      });
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
