import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';
import { AuthResponse } from './dto/authResponse';
import { UserResponse } from '../users/dtos/userResponse';
import { SerializerInterceptor } from '../commons/serializerInterceptor';
import { TokensResponse } from '../tokens/dtos/tokensResponse';
import { AuthUser } from './decorators/authUser.decorator';
import { Public } from './decorators/public.decorator';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { LogoutDto } from './dto/logout.dto';
import { Guest } from './decorators/guest.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Create user' })
  @HttpCode(HttpStatus.CREATED)
  @Guest()
  @Post('register')
  @UseInterceptors(SerializerInterceptor)
  register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(registerDto);
  }

  //
  @ApiOperation({ summary: 'Sign in user' })
  @HttpCode(HttpStatus.OK)
  @Guest()
  @Post('login')
  @UseInterceptors(SerializerInterceptor)
  login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @Public()
  @Post('refreshTokens')
  @UseInterceptors(SerializerInterceptor)
  refreshTokens(@AuthUser() user: User): Promise<TokensResponse> {
    return this.authService.generateAndSaveTokens(user.id);
  }

  @ApiOperation({ summary: 'Get auth user' })
  @HttpCode(HttpStatus.OK)
  @Get('/me')
  @UseInterceptors(SerializerInterceptor)
  async getUser(@AuthUser() user: User): Promise<UserResponse> {
    return new UserResponse(user);
  }

  @ApiOperation({ summary: 'Logout user' })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('logout')
  async logout(@Body() logoutDto: LogoutDto): Promise<string> {
    await this.authService.logout(logoutDto.refreshToken);
    return 'User logout';
  }
}
