import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { UserResponse } from '../users/dtos/userResponse';
import { User } from '@prisma/client';
import { SerializerInterceptor } from '../commons/serializerInterceptor';
import { UserProfile } from './decorators/userProfile.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { TracksService } from '../tracks/tracks.service';
import { TransformTrackInterceptor } from '../tracks/interceptors/transormTrack.interceptor';
import { AuthUser } from '../auth/decorators/authUser.decorator';
import { TrackResponse } from '../tracks/dtos/track.response';

@Controller('users')
export class UsersProfileController {
  constructor(private tracksService: TracksService) {}

  @ApiOperation({ summary: 'Get user profile' })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Get(':id')
  @UseInterceptors(SerializerInterceptor)
  async getUserById(@UserProfile() userProfile: User): Promise<UserResponse> {
    return new UserResponse(userProfile);
  }

  @ApiOperation({ summary: 'Get user tracks' })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Get(':id/tracks')
  @UseInterceptors(TransformTrackInterceptor)
  getPageTracks(
    @UserProfile() userProfile: User,
    @AuthUser() authUser: User,
  ): Promise<TrackResponse[]> {
    return this.tracksService.getTracksByUser(userProfile, authUser);
  }
}
