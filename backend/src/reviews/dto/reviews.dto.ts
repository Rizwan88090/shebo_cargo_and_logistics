import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  MaxLength,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 'Ahmed Al Maktoum' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @ApiProperty({ example: 'Global Trading LLC', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(120)
  company?: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @ApiProperty({ example: 'Excellent service, fast delivery!' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  text!: string;

  @ApiProperty({ example: 'Air Cargo', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(80)
  service?: string;
}

export class UpdateReviewDto {
  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isApproved?: boolean;
}
