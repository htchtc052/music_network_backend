import { ApiProperty } from '@nestjs/swagger';

export class CreateTrackFileDto {
  @ApiProperty({ description: 'File size in bytes' })
  fileSize: number;

  @ApiProperty({ description: 'File path or identifier' })
  filePath: string;

  @ApiProperty({ description: 'File MIME type' })
  mimetype: string;
}
