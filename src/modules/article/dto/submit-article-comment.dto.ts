import { IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class SubmitArticleCommentDto {
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  body!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  parentId?: number;
}
