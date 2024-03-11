import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Track } from '@prisma/client';
import { EditTrackHandler } from './editTrack.handler';
import { RequestWithTrack } from '../../tracks/types/requestWithTrack.type';

export const EditTrackProvider: Provider = {
  provide: EditTrackHandler,
  inject: [REQUEST],
  useFactory: (request: RequestWithTrack) => {
    const track: Track = request.track;
    return new EditTrackHandler(track);
  },
};
