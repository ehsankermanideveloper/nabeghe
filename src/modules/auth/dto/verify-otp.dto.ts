import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4,8}$/)
  @MaxLength(8)
  code!: string;

  @IsOptional()
  @IsString()
  _csrf?: string;
}
