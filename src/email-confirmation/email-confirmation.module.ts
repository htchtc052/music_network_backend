import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';
import { UsersService } from '../users/users.service';
import { TokensService } from '../tokens/tokens.service';
import { UsersRepository } from '../users/users.repository';
import { EmailService } from '../email/email.service';
import { EmailConfirmationController } from './email-confirmation.controller';
import { EmailConfirmationService } from './email-confirmation.service';
import { TracksModule } from '../tracks/tracks.module';

@Module({
  imports: [UsersModule, TracksModule, EmailModule],
  controllers: [EmailConfirmationController],

  providers: [
    UsersService,
    TokensService,
    UsersRepository,
    EmailService,
    EmailConfirmationService,
  ],
})
export class EmailConfirmationModule {}
