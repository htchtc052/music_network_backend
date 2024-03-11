import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditTrackInfoDto {
  @ApiProperty({ example: 'My song', description: 'Track title' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'My awesome song', description: 'Track description' })
  @IsOptional()
  description: string;

  @ApiProperty({
    example: 'My awesome  song info',
    description: 'Track hidden description',
  })
  @IsOptional()
  hiddenDescription: string;

  @ApiProperty({
    example: true,
    description: 'Whether the track is private or not',
    default: false,
  })
  private: boolean;
}
