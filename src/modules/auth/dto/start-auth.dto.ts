import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class StartAuthDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  identifier!: string;

  @IsOptional()
  @IsString()
  _csrf?: string;
}
