import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../tokens/types/JwtPayload';
import { UsersService } from '../../users/users.service';
import { AbilityFactory } from '../../casl/ability.factory';
import { User } from '@prisma/client';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private abilityFactory: AbilityFactory,
    private config: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_ACCESS_SECRET'),
    });
  }

  validate(payload: JwtPayload): Promise<User> {
    return this.usersService.getUserById(+payload.sub);
  }
}
