import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { Token, User } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokensService } from '../tokens/tokens.service';

import { AuthResponse } from './dto/authResponse';
import { TokensResponse } from '../tokens/dtos/tokensResponse';
import { UserResponse } from '../users/dtos/userResponse';
import { EmailConfirmationService } from '../email-confirmation/email-confirmation.service';
import { JwtPayload } from '../tokens/types/JwtPayload';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokensService: TokensService,
    private emailConfirmationService: EmailConfirmationService,
    private usersRepository: UsersRepository,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const user: User = await this.usersService.createUser(registerDto);

    const tokensResponse: TokensResponse = await this.generateAndSaveTokens(
      user.id,
    );

    await this.emailConfirmationService.sendEmailVerificationEmail(user);

    return {
      ...tokensResponse,
      user: new UserResponse(user),
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user: User = await this.usersRepository.getUserByEmail(
      loginDto.email,
    );

    if (
      !user ||
      !(await this.validatePassword(user.password, loginDto.password))
    ) {
      throw new BadRequestException('INVALID_CREDENTIALS');
    }

    const tokensResponse: TokensResponse = await this.generateAndSaveTokens(
      user.id,
    );

    return {
      ...tokensResponse,
      user: new UserResponse(user),
    };
  }

  async validatePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    try {
      return await argon2.verify(password, userPassword);
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async checkAuthUserRefreshToken(
    payload: JwtPayload,
    refreshToken: string,
  ): Promise<User> {
    const user: User = await this.checkUserByToken(refreshToken);

    if (!user || user.id != parseInt(payload.sub)) {
      throw new UnauthorizedException('Refresh token not exists');
    }

    await this.deleteUserToken(refreshToken);
    return user;
  }

  async checkUserByToken(token: string): Promise<User | null> {
    const tokenData: Token = await this.usersRepository.getUserToken({
      token,
    });

    if (!tokenData) {
      return null;
    }

    return this.usersRepository.getUserById(tokenData.userId);
  }

  async generateAndSaveTokens(userId: number): Promise<TokensResponse> {
    const accessToken = await this.tokensService.signAccessToken(userId);

    const refreshToken = await this.tokensService.signRefreshToken(userId);

    await this.usersRepository.createRefreshToken({
      token: refreshToken,
      userId,
    });

    return { accessToken, refreshToken };
  }

  async logout(refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('Token ID required');
    }

    await this.deleteUserToken(refreshToken);
  }

  async deleteUserToken(token: string): Promise<void> {
    await this.usersRepository.deleteUserToken({ token });
  }
}
