import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmailAllreadyExists } from '../../users/validators/isEmailAlreadyExists.validator';
import { MinLengthCustom } from '../../commons/minLengthCustom.decorator';

export class RegisterDto {
  @ApiProperty({ example: 'john_doe', description: 'User name' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'user@mail.com', description: 'User email' })
  @IsNotEmpty()
  @IsEmail()
  @Validate(IsEmailAllreadyExists, {
    message: 'EMAIL_BUSY',
  })
  email: string;

  @ApiProperty({ example: 'Strong_password', description: 'User password' })
  @IsNotEmpty()
  @MinLengthCustom(4, {
    message: `PASSWORD_TOO_LONG`,
  })
  password: string;
}
