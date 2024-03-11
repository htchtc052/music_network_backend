import { User } from '@prisma/client';
import { RequestWithAuthUser } from '../../auth/types/requestWithAuthData.type';

type UserProfile = {
  userProfile: User;
};

export type RequestWithUserProfile = RequestWithAuthUser & UserProfile;
