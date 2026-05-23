import { IsBoolean, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProgressDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  watchedSeconds!: number;

  @IsBoolean()
  isCompleted!: boolean;
}
