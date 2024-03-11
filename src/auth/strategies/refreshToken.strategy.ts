import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../tokens/types/JwtPayload';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { User } from '@prisma/client';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private config: ConfigService, private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_REFRESH_SECRET'),
      // Pass token to `req`
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload): Promise<User> {
    const refreshToken = request.body.refreshToken;

    const user: User = await this.authService.checkAuthUserRefreshToken(
      payload,
      refreshToken,
    );
    return user;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
