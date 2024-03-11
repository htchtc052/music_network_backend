import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../tokens/types/JwtPayload';
import { User } from '@prisma/client';
import { UsersService } from '../../users/users.service';

@Injectable()
export class EmailConfirmationTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-email-confirmation',
) {
  constructor(
    private config: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('emailConfirmationToken'),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_EMAIL_CONFIRMATION_SECRET'),
    });
  }

  validate(payload: JwtPayload): Promise<User> {
    return this.usersService.getUserById(+payload.sub);
  }
}
