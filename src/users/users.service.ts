import { Injectable, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { User } from '@prisma/client';
import { EditUserInfoDto } from '../account/dtos/editUserInfo.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { UsersRepository } from './users.repository';
import { UserResponse } from './dtos/userResponse';
import { AbilityFactory, Action, AppAbility } from '../casl/ability.factory';
import { subject } from '@casl/ability';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private abilityFactory: AbilityFactory,
  ) {}

  async createUser(registerDto: RegisterDto): Promise<User> {
    const hashedPassword = await this.hashPassword(registerDto.password);

    const user: User = await this.usersRepository.createUser({
      password: hashedPassword,
      email: registerDto.email,
      username: registerDto.username,
    });

    return user;
  }

  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  async getUserById(userId: number): Promise<User> {
    const user: User = await this.usersRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async checkEmailExists(email: string): Promise<boolean> {
    return !(await this.usersRepository.getUsersCountByEmail(email));
  }

  async editUserInfo(
    user: User,
    editUserInfoDto: EditUserInfoDto,
  ): Promise<UserResponse> {
    const updatedUser: User = await this.usersRepository.updateUser(
      user.id,
      editUserInfoDto,
    );

    return new UserResponse(updatedUser);
  }

  async markUserDeleted(userId: number): Promise<User> {
    return this.usersRepository.updateUser(userId, { deletedAt: new Date() });
  }

  async markEmailAsConfirmed(userId: number) {
    return this.usersRepository.updateUser(userId, {
      emailConfirmedAt: new Date(),
    });
  }

  canReadPrivateData(ownerUser: User, guestUser: User): boolean {
    const ability: AppAbility = this.abilityFactory.createForUser(guestUser);
    return ability.can(Action.ReadPrivateData, subject('User', ownerUser));
  }
}
