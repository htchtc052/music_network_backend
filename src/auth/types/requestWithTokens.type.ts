import { TokensResponse } from '../../tokens/dtos/tokensResponse';

export type RequestWithTokens = {
  tokens: TokensResponse;
} & Request;
