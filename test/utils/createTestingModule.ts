import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { MailerService } from '@nestjs-modules/mailer';

export const createTestingModule = async (): Promise<TestingModule> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
    providers: [],
  })
    .overrideProvider(MailerService)
    .useValue({ sendMail: jest.fn() })
    .compile();

  return moduleFixture;
};
