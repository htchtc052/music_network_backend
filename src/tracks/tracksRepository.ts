import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Track, TrackFile, User } from '@prisma/client';
import {
  TrackFileUncheckedCreateInput,
  TrackUncheckedCreateInput,
  TrackUpdateInput,
  TrackWhereFilter,
  TrackWithFile,
} from './types/track.types';

@Injectable()
export class TracksRepository {
  constructor(private prisma: PrismaService) {}

  async createTrack(
    trackUncheckedCreateInput: TrackUncheckedCreateInput,
  ): Promise<Track> {
    return this.prisma.track.create({
      data: trackUncheckedCreateInput,
    });
  }

  async createTrackFile(
    trackCreateFileInput: TrackFileUncheckedCreateInput,
  ): Promise<TrackFile> {
    return this.prisma.trackFile.create({
      data: trackCreateFileInput,
    });
  }

  async getTracksByCriteria(
    trackWhereFilter: TrackWhereFilter,
  ): Promise<TrackWithFile[]> {
    const tracks: TrackWithFile[] = await this.prisma.track.findMany({
      where: {
        ...trackWhereFilter,
        deletedAt: null,
      },
      include: {
        file: true,
      },
    });

    return tracks;
  }

  async getCatalogTracks(): Promise<TrackWithFile[]> {
    const where: TrackWhereFilter = {
      deletedAt: null,
      private: false,
    };

    return this.getTracksByCriteria(where);
  }

  async getTracksByUser(
    user: User,
    includePrivate: boolean,
  ): Promise<TrackWithFile[]> {
    const where: TrackWhereFilter = {
      userId: user.id,
      deletedAt: null,
    };

    if (!includePrivate) {
      where.private = false;
    }

    return this.getTracksByCriteria(where);
  }

  async getTrackById(id: number): Promise<TrackWithFile> {
    return this.prisma.track.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        file: true,
      },
    });
  }

  async updateTrack(
    trackId: number,
    updateTrackInput: TrackUpdateInput,
  ): Promise<TrackWithFile> {
    return this.prisma.track.update({
      where: { id: trackId },
      data: updateTrackInput,
      include: {
        file: true,
      },
    });
  }
}
