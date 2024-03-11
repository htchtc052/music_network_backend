import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TrackWithFile } from '../types/track.types';
import { RequestWithTrack } from '../types/requestWithTrack.type';

export const CurrentTrack = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TrackWithFile => {
    const request = ctx.switchToHttp().getRequest<RequestWithTrack>();

    return request.track;
  },
);
