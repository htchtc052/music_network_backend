import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

const TOKEN_SCOPES = {
  ACCESS_SCOPE: 'ACCESS',
  REFRESH_SCOPE: 'REFRESH_SCOPE',
  EMAIL_CONFIRMATION_SCOPE: 'EMAIL_VERIFICATION',
};

@Injectable()
export class TokensService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  signAccessToken(userId: number) {
    return this.signToken(userId, TOKEN_SCOPES.ACCESS_SCOPE);
  }

  signRefreshToken(userId: number) {
    return this.signToken(userId, TOKEN_SCOPES.REFRESH_SCOPE);
  }

  signEmailConfirmationToken(userId: number) {
    return this.signToken(userId, TOKEN_SCOPES.EMAIL_CONFIRMATION_SCOPE);
  }

  private signToken(userId: number, scope: string) {
    let options: JwtSignOptions = {
      subject: userId.toString(),
    };

    if (scope === TOKEN_SCOPES.ACCESS_SCOPE) {
      options = {
        ...options,
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '60s',
      };
    } else if (scope === TOKEN_SCOPES.REFRESH_SCOPE) {
      options = {
        ...options,
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '1h',
      };
    } else if (scope === TOKEN_SCOPES.EMAIL_CONFIRMATION_SCOPE) {
      options = {
        ...options,
        secret: this.configService.get<string>('JWT_EMAIL_CONFIRMATION_SECRET'),
        expiresIn: '1h',
      };
    }

    return this.jwtService.signAsync({ sid: uuidv4() }, options);
  }
}
