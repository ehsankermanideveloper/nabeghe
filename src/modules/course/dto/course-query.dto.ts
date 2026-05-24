import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CourseLevel } from '@modules/course/enum/course-level.enum';
import { CourseSort } from '@modules/course/enum/course-sort.enum';

const emptyToUndefined = ({ value }: { value: unknown }) =>
  value === '' ? undefined : value;

export class CourseQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Transform(emptyToUndefined)
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @IsOptional()
  @Transform(emptyToUndefined)
  @IsEnum(CourseSort)
  sort?: CourseSort;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(48)
  limit?: number = 12;
}
