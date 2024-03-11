import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokensService } from './tokens.service';

describe('TokensService', () => {
  let tokensService: TokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokensService,

        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
            decode: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('MOCKED_SECRET_KEY'),
          },
        },
        JwtService,
      ],
    }).compile();

    tokensService = module.get<TokensService>(TokensService);
  });

  it('should be defined', () => {
    expect(tokensService).toBeDefined();
  });
});
