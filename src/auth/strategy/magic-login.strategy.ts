import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-magic-login';
import { AuthService } from '../auth.service';
import * as sendGrid from '@sendgrid/mail';

sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

@Injectable()
export class MagicLoginStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(MagicLoginStrategy.name);
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      secret: configService.get<string>('MAGIC_LINK_SECRET'),
      verifyUserAfterToken: true,
      userFields: ['email'],
      jwtOptions: {
        expiresIn: '1h',
      },
      callbackUrl:
        configService.get<string>('BASE_URL') + '/auth/login/callback',
      sendMagicLink: async (destination, href) => {
        const msg = {
          to: destination,
          from: 'ShopIt Online Store: <arifayanidowu2@gmail.com>',
          subject: 'Magic Link',
          text: 'Magic Link',
          html: `<a href="${href}">Click here to login</a>`,
        };
        await sendGrid.send({
          templateId: process.env.SENDGRID_DYNAMIC_TEMPLATE_ID,
          dynamicTemplateData: {
            subject: 'Magic Link',
            name: 'ShopIt',
            link: href,
            email: destination,
          },
          ...msg,
        });
        this.logger.debug(
          `Sending magic link email to ${destination} with link url ${href}`,
        );
      },
      verify: async (payload, callback) => {
        callback(null, this.validate(payload));
      },
    });
  }

  async validate(payload: { destination: string }) {
    const user = this.authService.validateUser(payload.destination);
    return user;
  }
}
