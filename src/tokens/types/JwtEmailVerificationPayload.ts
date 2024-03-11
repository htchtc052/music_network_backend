import { JwtParams } from './JwtParams.type';

export type JwtEmailVerificationTokenPayload = {
  email: string;
};

export type JwtEmailVerificationTokenDecoded =
  JwtEmailVerificationTokenPayload & JwtParams;
