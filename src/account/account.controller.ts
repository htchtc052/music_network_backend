import { ApiOperation } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { EditUserInfoDto } from './dtos/editUserInfo.dto';
import { User } from '@prisma/client';
import { UserResponse } from '../users/dtos/userResponse';
import { SerializerInterceptor } from '../commons/serializerInterceptor';
import { AuthUser } from '../auth/decorators/authUser.decorator';

@Controller('account')
export class AccountController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Edit user' })
  @HttpCode(HttpStatus.OK)
  @Put('editUserInfo')
  @UseInterceptors(SerializerInterceptor)
  editUserInfo(
    @AuthUser() user: User,
    @Body() editUserInfoDto: EditUserInfoDto,
  ): Promise<UserResponse> {
    return this.usersService.editUserInfo(user, editUserInfoDto);
  }

  @ApiOperation({ summary: 'Delete user' })
  @HttpCode(HttpStatus.OK)
  @Delete('deleteUser')
  async softDeleteUser(@AuthUser() user: User): Promise<string> {
    const deletedUser: User = await this.usersService.markUserDeleted(user.id);
    return `User ${deletedUser.id} successfully deleted`;
  }
}
