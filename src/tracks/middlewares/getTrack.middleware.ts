import { Injectable, NestMiddleware } from '@nestjs/common';

import { NextFunction, Response } from 'express';
import { TracksService } from '../tracks.service';
import { RequestWithTrack } from '../types/requestWithTrack.type';
import { TrackWithFile } from '../types/track.types';

@Injectable()
export class GetTrackMiddleware implements NestMiddleware {
  constructor(private readonly tracksService: TracksService) {}

  async use(req: RequestWithTrack, res: Response, next: NextFunction) {
    const track: TrackWithFile = await this.tracksService.getTrackById(
      parseInt(req.params.id),
    );

    req.track = track;
    next();
  }
}
