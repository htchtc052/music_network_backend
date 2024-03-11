import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { EmailConfirmationService } from './email-confirmation.service';
import { Public } from '../auth/decorators/public.decorator';
import { User } from '@prisma/client';
import { AuthUser } from '../auth/decorators/authUser.decorator';
import { EmailConfirmationTokenGuard } from '../auth/guards/emailConfirmationTokenGuard';

@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(private emailConfirmationService: EmailConfirmationService) {}

  @ApiOperation({ summary: 'Resend email confirmation link' })
  @Post('resendEmailConfirmation')
  async resendConfirmationLink(@AuthUser() user: User) {
    await this.emailConfirmationService.resendEmailConfirmationLink(user);

    return `Link sended`;
  }

  @ApiOperation({ summary: 'Confirm email' })
  @Public()
  @UseGuards(EmailConfirmationTokenGuard)
  @Post('confirmEmail')
  async ConfirmEmail(@AuthUser() user: User): Promise<string> {
    await this.emailConfirmationService.confirmEmail(user);
    return 'Email confirm success';
  }
}
