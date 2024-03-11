import { PrismaService } from 'nestjs-prisma';
import { Track, TrackFile, User } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { TracksService } from './tracks.service';
import { ConfigService } from '@nestjs/config';

import { TrackResponse } from './dtos/track.response';
import { TracksRepository } from './tracksRepository';
import { TrackWithFile } from './types/track.types';
import { EditTrackInfoDto } from './dtos/editTrackInfo.dto';
import { UsersService } from '../users/users.service';

describe('TracksService', () => {
  let tracksService: TracksService;
  let mockTracksRepository: TracksRepository =
    jest.createMockFromModule<TracksRepository>('./tracksRepository');

  let mockUsersService: UsersService = jest.createMockFromModule<UsersService>(
    '../users/users.service',
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TracksService,
        PrismaService,
        ConfigService,
        {
          provide: TracksRepository,
          useValue: mockTracksRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    tracksService = module.get<TracksService>(TracksService);
  });

  it('should be defined', () => {
    expect(tracksService).toBeDefined();
  });

  it('should upload track to page', async () => {
    const user: User = { id: 1 } as User;

    const uploadedTrackFileMock: Express.Multer.File = {
      originalname: 'test_track.mp3',
      size: 1024,
      path: '/pathtofile',
      buffer: undefined,
      filename: 'test_str.mp3',
      destination: '/dest_folder',
      stream: undefined,
      mimetype: 'audio/mpeg',
    } as Express.Multer.File;

    const trackMock: Track = {
      id: 1,
      userId: user.id,
      title: uploadedTrackFileMock.originalname,
    } as Track;

    const trackFileMock: TrackFile = {
      trackId: trackMock.id,
      fileSize: uploadedTrackFileMock.size,
      filePath: uploadedTrackFileMock.path,
      mimetype: uploadedTrackFileMock.mimetype,
    } as TrackFile;

    const trackResponseMock: TrackResponse = new TrackResponse({
      ...trackMock,
      file: trackFileMock,
    });

    tracksService.createTrack = jest.fn().mockResolvedValue(trackMock);

    tracksService.createTrackFile = jest.fn().mockResolvedValue(trackFileMock);

    const trackResponse: TrackResponse =
      await tracksService.createTrackByUploadedFile(
        user,
        uploadedTrackFileMock,
      );

    expect(trackResponse).toEqual(trackResponseMock);
  });

  describe('editTrackInfo', () => {
    it('Should update track info', async () => {
      const trackMock: Track = {
        id: 1,
        title: 'Track 1',
      } as Track;

      const editTrackInfoDtoMock: EditTrackInfoDto = {
        title: 'Edited title',
      } as EditTrackInfoDto;

      const editedTrackMock: TrackWithFile = {
        ...trackMock,
        ...editTrackInfoDtoMock,
      } as TrackWithFile;

      mockTracksRepository.updateTrack = jest
        .fn()
        .mockResolvedValue(editedTrackMock);

      const editedTrackResponse: TrackResponse =
        await tracksService.editTrackInfo(trackMock, editTrackInfoDtoMock);

      expect(editedTrackResponse).toEqual(new TrackResponse(editedTrackMock));
    });
  });

  describe('GetTracksByUser', () => {
    const ownerUser: User = { id: 1 } as User;

    const guestUser: User = { id: 2 } as User;

    const tracksResponseMock: TrackResponse[] = [
      {
        id: 1,
        userId: ownerUser.id,
        private: false,
      } as TrackWithFile,
      {
        id: 2,
        userId: ownerUser.id,
        private: true,
      } as TrackWithFile,
    ];

    mockUsersService.canReadPrivateData = jest
      .fn()
      .mockImplementation((ownerUser: User, guestUser: User): boolean => {
        return ownerUser.id === guestUser.id;
      });

    mockTracksRepository.getTracksByUser = jest
      .fn()
      .mockImplementation((ownerUser: User, includePrivate: boolean) => {
        return tracksResponseMock.filter(
          (track) =>
            track.userId == ownerUser.id && (includePrivate || !track.private),
        );
      });

    it('should return all two tracks for owner user', async () => {
      const tracksResponseDto: TrackResponse[] =
        await tracksService.getTracksByUser(ownerUser, ownerUser);
      expect(tracksResponseDto.length).toEqual(2);
    });

    it('should return all only public track for guest user', async () => {
      const tracksResponseDto: TrackResponse[] =
        await tracksService.getTracksByUser(ownerUser, guestUser);
      expect(tracksResponseDto.length).toEqual(1);
    });
  });

  describe('GetCatalogTracks', () => {
    const ownerUser: User = { id: 1 } as User;

    const tracksResponseMock: TrackResponse[] = [
      {
        id: 1,
        userId: ownerUser.id,
        private: false,
      } as TrackWithFile,
      {
        id: 2,
        userId: ownerUser.id,
        private: true,
      } as TrackWithFile,
    ];

    mockTracksRepository.getCatalogTracks = jest.fn().mockImplementation(() => {
      return tracksResponseMock.filter((track) => !track.private);
    });

    it('should return all only public track for catalog', async () => {
      const tracksResponseDto: TrackResponse[] =
        await tracksService.getCatalogTracks();
      expect(tracksResponseDto.length).toEqual(1);
    });
  });

  describe('deleteTrack', () => {
    it('should mark track as deleted', async () => {
      const trackMock: Track = { id: 1 } as Track;
      const deletedAt = new Date();
      const deletedTrackMock: Track = { ...trackMock, deletedAt } as Track;

      mockTracksRepository.updateTrack = jest
        .fn()
        .mockResolvedValue(deletedTrackMock);

      const deletedTrack: Track = await tracksService.markTrackDeleted(
        trackMock,
      );

      expect(deletedTrack).toEqual(deletedTrackMock);
    });
  });
});
