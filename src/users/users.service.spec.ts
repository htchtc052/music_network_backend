import { UsersService } from './users.service';
import { PrismaService } from 'nestjs-prisma';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { UsersRepository } from './users.repository';
import { UserResponse } from './dtos/userResponse';
import { TokensService } from '../tokens/tokens.service';
import { AbilityFactory } from '../casl/ability.factory';
import { EditUserInfoDto } from '../account/dtos/editUserInfo.dto';
import { RegisterDto } from '../auth/dto/register.dto';

describe('UsersService', () => {
  let usersService: UsersService;

  const mockTokensService: TokensService =
    jest.createMockFromModule<TokensService>('../tokens/tokens.service');

  let mockUsersRepository: UsersRepository =
    jest.createMockFromModule<UsersRepository>('./users.repository');

  let mockAbilityFactory: AbilityFactory =
    jest.createMockFromModule<AbilityFactory>('../casl/ability.factory');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        PrismaService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        {
          provide: TokensService,
          useValue: mockTokensService,
        },
        { provide: AbilityFactory, useValue: mockAbilityFactory },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('should create a new user', async () => {
    const user: User = {
      id: 1,
      email: 'user@test.com',
      password: 'pwd_string',
      username: 'user',
    } as User;

    mockUsersRepository.createUser = jest.fn().mockResolvedValue(user);
    usersService.hashPassword = jest.fn().mockResolvedValue(user.password);

    const createdUser: User = await usersService.createUser({
      username: user.username,
      email: user.email,
      password: user.password,
    } as RegisterDto);

    expect(createdUser).toEqual(user);
  });

  describe('editUserInfo', () => {
    it('Should update user info', async () => {
      const user: User = {
        id: 1,
        username: 'user',
      } as User;

      const editUserInfoDto: EditUserInfoDto = {
        username: 'New user name',
      } as EditUserInfoDto;

      const editedUserMock: User = {
        ...user,
        ...editUserInfoDto,
      } as User;

      mockUsersRepository.updateUser = jest
        .fn()
        .mockResolvedValue(editedUserMock);

      const editedUserResponse: UserResponse = await usersService.editUserInfo(
        user,
        editUserInfoDto,
      );

      expect(editedUserResponse).toEqual(new UserResponse(editedUserMock));
    });
  });

  describe('deleteUser', () => {
    it('should mark user as deleted', async () => {
      const user: User = {
        id: 1,
        email: 'user@test.com',
        password: 'pwd_string',
        username: 'user',
      } as User;

      const deletedAt = new Date();
      const deletedUserMock: User = { ...user, deletedAt } as User;

      mockUsersRepository.updateUser = jest
        .fn()
        .mockResolvedValue(deletedUserMock);

      const deletedUser: User = await usersService.markUserDeleted(user.id);

      expect(deletedUser).toEqual(deletedUserMock);
    });
  });
});
