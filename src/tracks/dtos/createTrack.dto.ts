import { ApiProperty } from '@nestjs/swagger';

export class CreateTrackDto {
  @ApiProperty({ description: 'Track title' })
  title: string;
}
