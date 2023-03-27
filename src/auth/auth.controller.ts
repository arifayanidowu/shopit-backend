import { FileInterceptor } from '@nestjs/platform-express';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Express } from 'express';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { Action } from 'src/casl/enum/action.enum';
import { AuthService } from './auth.service';
import { AccountDto } from './dto/account.dto';
import { MagicLoginStrategy } from './strategy/magic-login.strategy';
import { AdminClass } from './../casl/classes/schema.classes';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Admin } from '@prisma/client';
import { uploadImage } from 'src/utils/cloudinary.utils';
import { Auth } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private strategy: MagicLoginStrategy,
  ) {}

  @Post('login')
  async login(
    @Req() req,
    @Res() res,
    @Body(new ValidationPipe()) body: AccountDto,
  ) {
    await this.authService.validateUser(body.destination);
    return this.strategy.send(req, res);
  }

  @UseGuards(AuthGuard('magiclogin'))
  @Get('login/callback')
  async loginCallback(@Req() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Get('all/admins')
  @Auth((ability: AppAbility) => ability.can(Action.Read, AdminClass))
  getAllUsers() {
    return this.authService.getAllUsers();
  }

  @Get('admin/counts')
  @Auth((ability: AppAbility) => ability.can(Action.Read, AdminClass))
  getAdminCounts() {
    return this.authService.getAdminsCount();
  }

  @Patch('update/admin')
  @Auth((ability: AppAbility) => ability.can(Action.Update, AdminClass))
  updateAdmin(@Body() body: Partial<Admin>) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...update } = body;
    return this.authService.updateAdmin(update);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/admin/profile')
  @UseInterceptors(FileInterceptor('avatar'), ClassSerializerInterceptor)
  async updateProfile(
    @Req() req,
    @Body() body: Partial<Admin>,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /png|jpeg|jpg|svg|webp/gi,
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 4,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    file?: Express.Multer.File,
  ) {
    const data = { ...body };
    if (file) {
      data.avatar = await uploadImage(file);
    }

    return await this.authService.updateProfile(req.user.id, {
      ...data,
    });
  }

  @Delete('delete/admin/:id')
  @Auth((ability: AppAbility) => ability.can(Action.Manage, AdminClass))
  deleteAdmin(@Param('id') id: string) {
    return this.authService.deleteAdmin(id);
  }

  @Delete('delete/admins')
  @Auth((ability: AppAbility) => ability.can(Action.Delete, AdminClass))
  deleteAdmins(@Req() req: Request) {
    return this.authService.deleteManyAdmins(req.body.ids);
  }
}
