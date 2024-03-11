import { TokensResponse } from '../dtos/tokensResponse';

export const accessTokenMock = 'test_access_token';
export const refreshTokenMock = 'test_access_token';

export const emailVerificationTokenMock = 'test_email_verification_token';
export const tokensResponseMock: TokensResponse = {
  accessToken: accessTokenMock,
  refreshToken: refreshTokenMock,
} as TokensResponse;
