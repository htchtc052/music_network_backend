import { INestApplication } from '@nestjs/common';
import { AccountController } from './account.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';

describe('AccountController', () => {
  let app: INestApplication;
  let accountController: AccountController;

  const mockUsersService: UsersService =
    jest.createMockFromModule<UsersService>('../users/users.service');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
      controllers: [AccountController],
    }).compile();

    accountController = module.get<AccountController>(AccountController);
    app = module.createNestApplication();
  });

  it('should be defined', () => {
    expect(AccountController).toBeDefined();
  });
});
