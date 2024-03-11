import { ApiProperty, PickType } from '@nestjs/swagger';
import { RegisterDto } from '../../auth/dto/register.dto';
import { Genders } from '@prisma/client';

export class EditUserInfoDto extends PickType(RegisterDto, [
  'username',
] as const) {
  @ApiProperty({ example: 'John', required: false })
  firstName: string;

  @ApiProperty({ example: 'Doe', required: false })
  lastName: string;

  @ApiProperty({ example: Genders.MALE, required: false })
  gender: Genders;
}
