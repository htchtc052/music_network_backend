import { Injectable, NotFoundException } from '@nestjs/common';
import { Track, TrackFile, User } from '@prisma/client';
import { EditTrackInfoDto } from './dtos/editTrackInfo.dto';
import { TrackResponse } from './dtos/track.response';
import { TracksRepository } from './tracksRepository';
import { TrackWithFile } from './types/track.types';
import { CreateTrackDto } from './dtos/createTrack.dto';
import { CreateTrackFileDto } from './dtos/createTrackFile.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class TracksService {
  constructor(
    private tracksRepository: TracksRepository,
    private usersService: UsersService,
  ) {}

  async createTrackByUploadedFile(
    user: User,
    uploadedFile: Express.Multer.File,
  ): Promise<TrackResponse> {
    const track: Track = await this.createTrack(user, {
      title: uploadedFile.originalname,
    });

    const trackFile: TrackFile = await this.createTrackFile(track.id, {
      filePath: uploadedFile.path,
      fileSize: uploadedFile.size,
      mimetype: uploadedFile.mimetype,
    });

    return new TrackResponse({ ...track, file: trackFile });
  }

  async createTrack(
    user: User,
    createTrackDto: CreateTrackDto,
  ): Promise<Track> {
    return this.tracksRepository.createTrack({
      title: createTrackDto.title,
      userId: user.id,
    });
  }

  async createTrackFile(
    trackId: number,
    createTrackFileDto: CreateTrackFileDto,
  ): Promise<TrackFile> {
    return this.tracksRepository.createTrackFile({
      fileSize: createTrackFileDto.fileSize,
      filePath: createTrackFileDto.filePath,
      mimetype: createTrackFileDto.mimetype,
      trackId,
    });
  }

  async getTrackById(id: number): Promise<TrackWithFile> {
    const track: TrackWithFile = await this.tracksRepository.getTrackById(id);

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  async getCatalogTracks(): Promise<TrackResponse[]> {
    const tracks: TrackWithFile[] =
      await this.tracksRepository.getCatalogTracks();
    return tracks.map((track: TrackWithFile) => new TrackResponse(track));
  }

  async getTracksByUser(
    ownerUser: User,
    guestUser: User,
  ): Promise<TrackResponse[]> {
    const includePrivate = this.usersService.canReadPrivateData(
      ownerUser,
      guestUser,
    );

    const tracks: TrackWithFile[] = await this.tracksRepository.getTracksByUser(
      ownerUser,
      includePrivate,
    );

    return tracks.map((track: TrackWithFile) => new TrackResponse(track));
  }

  async editTrackInfo(
    track: Track,
    editTrackInfoDto: EditTrackInfoDto,
  ): Promise<TrackResponse> {
    const updatedTrack: TrackWithFile = await this.tracksRepository.updateTrack(
      track.id,
      editTrackInfoDto,
    );

    return new TrackResponse(updatedTrack);
  }

  async markTrackDeleted(track: Track): Promise<Track> {
    const deletedTrack: Track = (await this.tracksRepository.updateTrack(
      track.id,
      {
        deletedAt: new Date(),
      },
    )) as Track;

    return deletedTrack;
  }
}
