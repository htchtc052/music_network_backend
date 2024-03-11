import { BadRequestException, INestApplication } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponse } from './dto/authResponse';
import { User } from '@prisma/client';

describe('AuthController', () => {
  let app: INestApplication;
  let authController: AuthController;
  const mockAuthService: AuthService =
    jest.createMockFromModule<AuthService>('./auth.service');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
      controllers: [AuthController],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    app = module.createNestApplication();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  const user: User = {
    id: 1,
    email: 'test@mail.com',
    password: 'pwd',
    username: 'test',
  } as User;

  const accessToken = 'test_access_token';
  const refreshToken = 'test_refresh_token';

  const authResponseMock: AuthResponse = {
    user,
    accessToken,
    refreshToken,
  };

  it('should register user', async () => {
    mockAuthService.register = jest.fn().mockResolvedValue(authResponseMock);

    const authResponse: AuthResponse = await authController.register({
      username: user.username,
      email: user.email,
      password: user.password,
    });

    expect(authResponse).toEqual(authResponseMock);
  });

  describe('login routes', () => {
    mockAuthService.login = jest
      .fn()
      .mockImplementation((loginDto: LoginDto) => {
        if (
          loginDto.email == user.email &&
          loginDto.password == user.password
        ) {
          return authResponseMock;
        } else {
          throw new BadRequestException('');
        }
      });

    it('should login user with valid credentials', async () => {
      const authResponse: AuthResponse = await authController.login({
        email: user.email,
        password: user.password,
      });

      expect(authResponse).toEqual(authResponseMock);
    });

    it('should throw error with invalid credentials', async () => {
      expect(() =>
        authController.login({
          email: 'invalid email',
          password: 'invalid password',
        }),
      ).toThrow(BadRequestException);
    });
  });
});
