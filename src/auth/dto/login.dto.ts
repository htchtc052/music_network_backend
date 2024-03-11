import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginDto {
  @IsString({
    message: i18nValidationMessage('validation.EMAIL_NOT_EMPTY'),
  })
  @IsEmail({}, { message: i18nValidationMessage('validation.EMAIL_INVALID') })
  email: string;

  @IsNotEmpty({
    message: i18nValidationMessage('validation.PASSWORD_NOT_EMPTY'),
  })
  password: string;
}
