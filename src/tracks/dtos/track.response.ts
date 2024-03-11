import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TrackFileResponse } from './trackFile.response';

export class TrackResponse {
  @ApiProperty({ required: true })
  @Expose()
  id: number;

  @ApiProperty({ required: true })
  @Expose()
  userId: number;

  @ApiProperty({ required: true })
  @Expose()
  title: string;

  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  keywords: string[];

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  private: boolean;

  @Expose({ groups: ['isOwner'] })
  hiddenDescription: string;

  @Expose({ name: 'trackFile' })
  file: TrackFileResponse;

  constructor(partial?: Partial<TrackResponse>) {
    Object.assign(this, partial);
  }
}
