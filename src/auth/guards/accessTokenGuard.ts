import { ExecutionContext, Injectable } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { extractTokenFromHeader } from '../utils/extractTokenFromHeader';
import { IS_GUEST_KEY } from '../decorators/guest.decorator';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic: boolean = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );

    const isGuest: boolean = this.reflector.get<boolean>(
      IS_GUEST_KEY,
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest<Request>();

    const accessToken = extractTokenFromHeader(request);

    if (accessToken && isGuest) {
      return false;
    }

    if (!accessToken && (isPublic || isGuest)) {
      return true;
    }

    return super.canActivate(context);
  }
}
