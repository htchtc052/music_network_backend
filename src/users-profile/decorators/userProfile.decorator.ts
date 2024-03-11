import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUserProfile } from '../../users/types/requestsWithUser.type';
import { User } from '@prisma/client';

export const UserProfile = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<RequestWithUserProfile>();
    return request.userProfile;
  },
);
