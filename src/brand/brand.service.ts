import { Express } from 'express';
import { Prisma, Brand } from '@prisma/client';
import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { uploadImage } from 'src/utils/cloudinary.utils';

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    brandWhereUniqueInput: Prisma.BrandWhereUniqueInput,
  ): Promise<Brand | null> {
    return await this.prisma.brand.findUnique({
      where: brandWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.BrandWhereUniqueInput;
    where?: Prisma.BrandWhereInput;
    orderBy?: Prisma.BrandOrderByWithRelationInput;
  }): Promise<Brand[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return await this.prisma.brand.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createBrand(
    data: Prisma.BrandCreateInput,
    file: Express.Multer.File,
  ): Promise<Brand> {
    try {
      const newBrand = await this.prisma.brand.create({
        data: {
          ...data,
          logo: await uploadImage(file),
        },
      });
      return newBrand;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(
            `This is a unique constraint violation, Brand name (${data.name}) already exists`,
            422,
          );
        }
      }
      throw error;
    }
  }

  async updateBrand(params: {
    where: Prisma.BrandWhereUniqueInput;
    data: Prisma.BrandUpdateInput;
  }): Promise<Brand> {
    const { where, data } = params;
    return await this.prisma.brand.update({
      data,
      where,
    });
  }

  async upsertBrand(params: {
    where: Prisma.BrandWhereUniqueInput;
    update: Prisma.BrandUpdateInput;
    create: Prisma.BrandCreateInput;
  }): Promise<Brand> {
    const { where, create, update } = params;
    return await this.prisma.brand.upsert({
      where,
      update,
      create,
    });
  }

  async deleteBrand(where: Prisma.BrandWhereUniqueInput): Promise<Brand> {
    return await this.prisma.brand.delete({
      where,
    });
  }
}
