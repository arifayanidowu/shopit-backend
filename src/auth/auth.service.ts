import { Admin } from '@prisma/client';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string) {
    const user = await this.adminService.findOne({ email });
    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.active) {
      await this.adminService.updateAdmin({
        where: { email: user.email },
        data: { active: true, validateToken: null },
      });
    }
    return user;
  }

  async login(user: Admin) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async updateAdmin(data: Partial<Admin>) {
    return await this.adminService.updateAdmin({
      where: { email: data.email },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async updateProfile(id: string, data: Partial<Admin>) {
    return await this.adminService.updateProfile({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async getAllUsers(): Promise<Admin[]> {
    return await this.adminService.findAll({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAdminsCount(): Promise<{
    authors: number;
    editors: number;
    superAdmins: number;
  }> {
    return await this.adminService.getAdminsRolesCount();
  }

  async deleteAdmin(id: string): Promise<Admin> {
    return await this.adminService.deleteAdmin({ id });
  }

  async deleteManyAdmins(ids: string[]) {
    return this.adminService.deleteManyAdmins({
      id: {
        in: ids,
      },
    });
  }
}
