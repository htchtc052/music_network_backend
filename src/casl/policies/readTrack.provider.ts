import { Provider } from '@nestjs/common';
import { ReadTrackHandler } from './readTrack.handler';
import { REQUEST } from '@nestjs/core';
import { Track } from '@prisma/client';
import { RequestWithTrack } from '../../tracks/types/requestWithTrack.type';

export const ReadTrackProvider: Provider = {
  provide: ReadTrackHandler,
  inject: [REQUEST],
  useFactory: (request: RequestWithTrack) => {
    const track: Track = request.track;
    return new ReadTrackHandler(track);
  },
};
