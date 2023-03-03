import { Body, Controller, Post } from '@nestjs/common';
import { Admin } from '@prisma/client';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create/account')
  async createAccount(@Body() body: Admin) {
    return this.adminService.createAdmin(body);
  }
}
