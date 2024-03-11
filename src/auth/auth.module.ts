import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokensModule } from '../tokens/tokens.module';
import { TokensService } from '../tokens/tokens.service';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';
import { EmailConfirmationModule } from '../email-confirmation/email-confirmation.module';
import { EmailConfirmationService } from '../email-confirmation/email-confirmation.service';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { EmailConfirmationTokenStrategy } from './strategies/emailConfirmationToken.strategy';

@Module({
  imports: [UsersModule, TokensModule, EmailModule, EmailConfirmationModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokensService,
    UsersService,
    UsersRepository,
    EmailService,
    EmailConfirmationService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    EmailConfirmationTokenStrategy,
  ],
})
export class AuthModule {}
