import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithAuthUser } from '../types/requestWithAuthData.type';
import { User } from '@prisma/client';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<RequestWithAuthUser>();
    return request.user;
  },
);
