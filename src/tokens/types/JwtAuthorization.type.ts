import { JwtParams } from './JwtParams.type';

export type JwtAuthorizationTokenPayload = {
  userId: number;
};

export type JwtAuthorizationTokenDecoded = JwtAuthorizationTokenPayload &
  JwtParams;
