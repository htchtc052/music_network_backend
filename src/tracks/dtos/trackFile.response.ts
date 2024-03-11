import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TrackFileResponse {
  @ApiProperty()
  @Expose()
  fileSize: number;

  @ApiProperty()
  @Expose()
  filePath: string;

  @ApiProperty()
  @Expose()
  mimetype: string;

  constructor(partial?: Partial<TrackFileResponse>) {
    Object.assign(this, partial);
  }
}
