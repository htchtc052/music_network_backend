import { Prisma, Track } from '@prisma/client';

export type TrackWithFile = Prisma.TrackGetPayload<{
  include: { file: true };
}>;

export type TrackWhereFilter = Prisma.TrackWhereInput;

export type TrackUpdateInput = Partial<Track>;

export type TrackUncheckedCreateInput = Prisma.TrackUncheckedCreateInput;

export type TrackFileUncheckedCreateInput =
  Prisma.TrackFileUncheckedCreateInput;
