import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AccountController } from './account.controller';

import { AuthModule } from '../auth/auth.module';
import { TokensModule } from '../tokens/tokens.module';
import { TokensService } from '../tokens/tokens.service';
import { EmailModule } from '../email/email.module';
import { UsersRepository } from '../users/users.repository';

@Module({
  imports: [UsersModule, AuthModule, TokensModule, EmailModule],
  controllers: [AccountController],

  providers: [UsersService, TokensService, UsersRepository],
})
export class AccountModule {}
