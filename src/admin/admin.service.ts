import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { Admin, Prisma } from '@prisma/client';
@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    adminWhereUniqueInput: Prisma.AdminWhereUniqueInput,
  ): Promise<Admin | null> {
    return this.prisma.admin.findUnique({
      where: adminWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AdminWhereUniqueInput;
    where?: Prisma.AdminWhereInput;
    orderBy?: Prisma.AdminOrderByWithRelationInput;
  }): Promise<Admin[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.admin.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createAdmin(data: Prisma.AdminCreateInput): Promise<Admin> {
    try {
      const admin = await this.prisma.admin.findFirst({
        where: { role: 'SuperAdmin' },
      });
      if (admin.role === data.role)
        throw new HttpException(
          `Admin with role (${admin.role}) already exists`,
          422,
        );
      return await this.prisma.admin.create({
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(
            `This is a unique constraint violation, Admin with (${error.meta.target}) already exists`,
            422,
          );
        }
      }
      throw error;
    }
  }

  async updateAdmin(params: {
    where: Prisma.AdminWhereUniqueInput;
    data: Prisma.AdminUpdateInput;
  }): Promise<Admin> {
    const { where, data } = params;
    return this.prisma.admin.update({
      data,
      where,
    });
  }

  async upsertAdmin(params: {
    where: Prisma.AdminWhereUniqueInput;
    update: Prisma.AdminUpdateInput;
    create: Prisma.AdminCreateInput;
  }): Promise<Admin> {
    const { where, create, update } = params;
    return this.prisma.admin.upsert({
      where,
      update,
      create,
    });
  }

  async deleteAdmin(where: Prisma.AdminWhereUniqueInput): Promise<Admin> {
    return this.prisma.admin.delete({
      where,
    });
  }

  async getAdminsRolesCount(): Promise<{
    authors: number;
    editors: number;
    superAdmins: number;
  }> {
    const [authors, editors, superAdmins] = await this.prisma.$transaction([
      this.prisma.admin.count({
        where: { role: 'Author' },
      }),
      this.prisma.admin.count({
        where: { role: 'Editor' },
      }),
      this.prisma.admin.count({
        where: { role: 'SuperAdmin' },
      }),
    ]);

    return {
      authors,
      editors,
      superAdmins,
    };
  }
}
