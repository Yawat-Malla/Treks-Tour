import { IsString, MinLength, MaxLength } from 'class-validator';

export class PinDto {
  @IsString()
  @MinLength(4)
  @MaxLength(12)
  pin!: string;
}
