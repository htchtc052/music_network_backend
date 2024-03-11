import { SetMetadata } from '@nestjs/common';

export const IS_GUEST_KEY = 'auth-is-guest';

export function Guest() {
  return SetMetadata(IS_GUEST_KEY, true);
}
