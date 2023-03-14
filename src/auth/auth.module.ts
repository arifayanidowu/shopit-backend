import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { MagicLoginStrategy } from './strategy/magic-login.strategy';
import { AdminModule } from 'src/admin/admin.module';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [
    AdminModule,
    PassportModule,
    CaslModule,
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
    MulterModule.registerAsync({
      useFactory: async () => {
        return {
          dest: './upload',
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, MagicLoginStrategy],
  controllers: [AuthController],
  exports: [AuthService, MagicLoginStrategy, CaslModule, PassportModule],
})
export class AuthModule {}
