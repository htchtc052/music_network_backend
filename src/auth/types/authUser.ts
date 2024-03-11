import { AppAbility } from '../../casl/ability.factory';
import { User } from '@prisma/client';

export type AuthUser = User & { ability: AppAbility };
