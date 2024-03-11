import { AuthGuard } from '@nestjs/passport';

export class EmailConfirmationTokenGuard extends AuthGuard(
  'jwt-email-confirmation',
) {
  constructor() {
    super();
  }
}
