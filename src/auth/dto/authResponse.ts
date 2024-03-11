import { UserResponse } from '../../users/dtos/userResponse';
import { TokensResponse } from '../../tokens/dtos/tokensResponse';
import { IntersectionType } from '@nestjs/swagger';

export class AuthResponse extends IntersectionType(TokensResponse) {
  user: UserResponse;
}
