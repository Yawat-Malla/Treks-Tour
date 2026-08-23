import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  trekId!: string;

  @IsIn(['en', 'zh', 'ko', 'he'])
  locale!: 'en' | 'zh' | 'ko' | 'he';

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(40)
  phone!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(80)
  nationality!: string;

  @IsDateString()
  startDate!: string;

  @IsInt()
  @Min(1)
  @Max(20)
  groupSize!: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message?: string;

  @IsOptional()
  @IsString()
  addonTrekId?: string;

  @IsOptional()
  @IsBoolean()
  privateDeparture?: boolean;
}
