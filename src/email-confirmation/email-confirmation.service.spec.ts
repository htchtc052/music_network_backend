import { UsersService } from '../users/users.service';
import { TokensService } from '../tokens/tokens.service';
import { EmailService } from '../email/email.service';
import { Test, TestingModule } from '@nestjs/testing';
import { EmailConfirmationService } from './email-confirmation.service';

describe('AuthService', () => {
  let emailConfirmationService: EmailConfirmationService;

  const mockUsersService: UsersService = jest.createMockFromModule(
    '../users/users.service',
  );

  const mockTokensService: TokensService = jest.createMockFromModule(
    '../tokens/tokens.service',
  );

  const mockEmailService: EmailService = jest.createMockFromModule(
    '../email/email.service',
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailConfirmationService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: TokensService,
          useValue: mockTokensService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    emailConfirmationService = module.get<EmailConfirmationService>(
      EmailConfirmationService,
    );
  });

  it('should be defined', () => {
    expect(emailConfirmationService).toBeDefined();
  });
});
