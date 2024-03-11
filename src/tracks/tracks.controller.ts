import { ApiOperation } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Track, User } from '@prisma/client';
import { TracksService } from './tracks.service';
import { EditTrackInfoDto } from './dtos/editTrackInfo.dto';
import { TransformTrackInterceptor } from './interceptors/transormTrack.interceptor';
import { Public } from '../auth/decorators/public.decorator';
import { TrackResponse } from './dtos/track.response';
import { TrackWithFile } from './types/track.types';
import { CurrentTrack } from './decorators/currentTrack.decorator';
import { CheckPolicies } from '../casl/policies.decorator';
import { ReadTrackHandler } from '../casl/policies/readTrack.handler';
import { PoliciesGuard } from '../casl/policies.guard';
import { EditTrackHandler } from '../casl/policies/editTrack.handler';
import { FileInterceptor } from '@nestjs/platform-express';
import { SerializerInterceptor } from '../commons/serializerInterceptor';
import { AuthUser } from '../auth/decorators/authUser.decorator';

@Controller('tracks')
export class TracksController {
  constructor(private tracksService: TracksService) {}

  @ApiOperation({ summary: 'Upload track to user page' })
  @HttpCode(HttpStatus.CREATED)
  @Post('uploadTrack')
  @UseInterceptors(
    FileInterceptor('trackFile', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'audio/mpeg') {
          cb(null, true);
        } else {
          cb(new BadRequestException('File must be an mp3'), false);
        }
      },
    }),
  )
  @UseInterceptors(SerializerInterceptor)
  uploadTrack(
    @AuthUser() user: User,
    @UploadedFile()
    uploadedTrackFile: Express.Multer.File,
  ): Promise<TrackResponse> {
    return this.tracksService.createTrackByUploadedFile(
      user,
      uploadedTrackFile,
    );
  }

  @ApiOperation({ summary: 'Get track by id' })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Get(':id')
  @CheckPolicies(ReadTrackHandler)
  @UseGuards(PoliciesGuard)
  @UseInterceptors(TransformTrackInterceptor)
  getTrack(@CurrentTrack() track: TrackWithFile): TrackResponse {
    return new TrackResponse(track);
  }

  @ApiOperation({ summary: 'Get catalog tracks' })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Get()
  @UseInterceptors(TransformTrackInterceptor)
  async getCatalogTracks(): Promise<TrackResponse[]> {
    return this.tracksService.getCatalogTracks();
  }

  @ApiOperation({ summary: 'Edit track info' })
  @HttpCode(HttpStatus.OK)
  @Put(':id/editTrackInfo')
  @CheckPolicies(EditTrackHandler)
  @UseGuards(PoliciesGuard)
  @UseInterceptors(TransformTrackInterceptor)
  editInfo(
    @CurrentTrack() track: TrackWithFile,
    @Body() editTrackInfoDto: EditTrackInfoDto,
  ): Promise<TrackResponse> {
    return this.tracksService.editTrackInfo(track, editTrackInfoDto);
  }

  @Delete(':id/deleteTrack')
  @CheckPolicies(EditTrackHandler)
  @UseGuards(PoliciesGuard)
  async deleteTrack(@CurrentTrack() track: TrackWithFile): Promise<string> {
    const deletedTrack: Track = await this.tracksService.markTrackDeleted(
      track,
    );

    return `Track ${deletedTrack.id} successfully deleted`;
  }
}
