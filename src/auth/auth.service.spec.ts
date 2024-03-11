import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { BadRequestException } from '@nestjs/common';
import { TokensService } from '../tokens/tokens.service';
import { AuthResponse } from './dto/authResponse';
import { EmailConfirmationService } from '../email-confirmation/email-confirmation.service';
import { UsersRepository } from '../users/users.repository';
import { User } from '@prisma/client';

describe('AuthService', () => {
  let authService: AuthService;

  const mockUsersService: UsersService = jest.createMockFromModule(
    '../users/users.service',
  );

  const mockTokensService: TokensService = jest.createMockFromModule(
    '../tokens/tokens.service',
  );

  const mockUsersRepository: UsersRepository = jest.createMockFromModule(
    '../users/users.repository',
  );

  const mockEmailConfirmationService: EmailConfirmationService =
    jest.createMockFromModule(
      '../email-confirmation/email-confirmation.service.ts',
    );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        {
          provide: TokensService,
          useValue: mockTokensService,
        },
        {
          provide: EmailConfirmationService,
          useValue: mockEmailConfirmationService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('Auth methods', () => {
    const user: User = {
      id: 1,
      email: 'test@mail.com',
      password: 'pwd',
      username: 'test',
    } as User;

    const accessToken = 'test_access_token';
    const refreshToken = 'test_refresh_token';

    const authResponseDtoMock: AuthResponse = {
      user,
      accessToken,
      refreshToken,
    };

    it('should create new user', async () => {
      mockUsersService.createUser = jest.fn().mockResolvedValueOnce(user);

      authService.generateAndSaveTokens = jest.fn().mockResolvedValue({
        accessToken,
        refreshToken,
      });

      mockEmailConfirmationService.sendEmailVerificationEmail = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

      const authResponse: AuthResponse = await authService.register({
        username: user.username,
        email: user.email,
        password: user.password,
      });

      expect(authResponse).toEqual(authResponseDtoMock);
    });

    it('should login user with valid credentials', async () => {
      mockUsersRepository.getUserByEmail = jest
        .fn()
        .mockImplementation((checkEmail) => {
          if (checkEmail == user.email) {
            return user;
          } else {
            throw new BadRequestException('User does not exist');
          }
        });

      authService.validatePassword = jest
        .fn()
        .mockImplementation((password1, password2) => {
          return password1 === password2;
        });

      authService.generateAndSaveTokens = jest.fn().mockResolvedValue({
        accessToken,
        refreshToken,
      });

      const authResponse: AuthResponse = await authService.login({
        email: user.email,
        password: user.password,
      });

      expect(mockUsersRepository.getUserByEmail).toHaveBeenCalledWith(
        user.email,
      );

      expect(authService.validatePassword).toHaveBeenCalledWith(
        user.password,
        user.password,
      );

      expect(authService.generateAndSaveTokens).toHaveBeenCalledWith(user.id);

      expect(authResponse).toEqual(authResponseDtoMock);
    });
  });
});
