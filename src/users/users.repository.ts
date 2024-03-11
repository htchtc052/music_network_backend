import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, Token, User } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(
    userCreateInput: Prisma.UserUncheckedCreateInput,
  ): Promise<User> {
    return this.prisma.user.create({
      data: userCreateInput,
    });
  }

  async createRefreshToken(
    tokenCreateInput: Prisma.TokenUncheckedCreateInput,
  ): Promise<Token> {
    return this.prisma.token.create({
      data: tokenCreateInput,
    });
  }

  getUserById(id: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  getUserByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email,
        deletedAt: null,
      },
    });
  }

  getUsersCountByEmail(email: string): Prisma.PrismaPromise<number> {
    return this.prisma.user.count({
      where: {
        email,
      },
    });
  }

  async updateUser(
    userId: number,
    updateUserInput: Partial<User>,
  ): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: updateUserInput,
    });
  }

  async getUserToken(tokenData: Prisma.TokenWhereUniqueInput): Promise<Token> {
    return this.prisma.token.findUnique({ where: tokenData });
  }

  async deleteUserToken(tokenData: Prisma.TokenWhereUniqueInput) {
    await this.prisma.token.delete({ where: tokenData });
  }
}
