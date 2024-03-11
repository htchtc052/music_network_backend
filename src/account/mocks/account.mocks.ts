import { EditUserInfoDto } from '../dtos/editUserInfo.dto';
import { Genders } from '@prisma/client';

export const editUserInfoDtoMock: EditUserInfoDto = {
  username: 'Test name',
  firstName: 'Alex',
  lastName: 'Kotov',
  gender: Genders.MALE,
} as EditUserInfoDto;
