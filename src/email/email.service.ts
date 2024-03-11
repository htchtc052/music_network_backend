import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendEmailVerificationEmail(
    user: User,
    verificationToken: string,
  ): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    const backendUrl = this.configService.get<string>('BACKEND_URL');

    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: `Confirm registration on ${frontendUrl}`,
        template: `account-activation`,
        context: {
          backendUrl,
          frontendUrl,
          verificationToken,
          username: user.username,
        },
      });
    } catch (err) {
      console.error(`Error sending signup Email ${err.stack}`);
    }
  }
}
