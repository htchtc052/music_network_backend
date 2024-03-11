import { TrackWithFile } from './track.types';
import { RequestWithAuthUser } from '../../auth/types/requestWithAuthData.type';

export type RequestWithTrack = RequestWithAuthUser & {
  track: TrackWithFile;
};
