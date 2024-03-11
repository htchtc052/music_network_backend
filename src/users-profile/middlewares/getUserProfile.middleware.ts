import { Injectable, NestMiddleware } from '@nestjs/common';

import { NextFunction, Response } from 'express';
import { UsersService } from '../../users/users.service';
import { RequestWithUserProfile } from '../../users/types/requestsWithUser.type';

@Injectable()
export class GetUserProfileMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: RequestWithUserProfile, res: Response, next: NextFunction) {
    console.debug('req.params.id', req.params.id);
    req.userProfile = await this.usersService.getUserById(+req.params.id);

    //console.debug('req.users.profile', req.userProfile);

    next();
  }
}
