import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { CheckPolicies } from 'src/casl/decorator/check-policies.decorator';
import { Action } from 'src/casl/enum/action.enum';
import { PoliciesGuard } from 'src/casl/guard/policies.guard';
import { AuthService } from './auth.service';
import { AccountDto } from './dto/account.dto';
import { MagicLoginStrategy } from './strategy/magic-login.strategy';
import { AdminClass } from './../casl/classes/schema.classes';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Admin } from '@prisma/client';

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

  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @Get('all/admins')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, AdminClass),
  )
  getAllUsers() {
    return this.authService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @Get('admin/counts')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, AdminClass))
  getAdminCounts() {
    return this.authService.getAdminsCount();
  }

  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @Patch('update/admin')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, AdminClass),
  )
  updateAdmin(@Body() body: Partial<Admin>) {
    const { id, ...update } = body;
    return this.authService.updateAdmin(update);
  }

  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @Delete('delete/admin/:id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, AdminClass),
  )
  deleteAdmin(@Param('id') id: string) {
    return this.authService.deleteAdmin(id);
  }
}
