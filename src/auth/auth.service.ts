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
        where: { email },
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
}