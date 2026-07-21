import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCountryDto {
  @ApiProperty({ example: 'United Arab Emirates' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'AE' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  code!: string;

  @ApiProperty({ example: '🇦🇪', required: false })
  @IsString()
  @IsOptional()
  flag?: string;

  @ApiProperty({ example: 'Primary GCC logistics hub', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: 0, required: false })
  @IsInt()
  @IsOptional()
  sortOrder?: number;
}

export class UpdateCountryDto {
  @ApiProperty({ example: 'United Arab Emirates', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'AE', required: false })
  @IsString()
  @IsOptional()
  @Length(2, 2)
  code?: string;

  @ApiProperty({ example: '🇦🇪', required: false })
  @IsString()
  @IsOptional()
  flag?: string;

  @ApiProperty({ example: 'Primary GCC logistics hub', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: 0, required: false })
  @IsInt()
  @IsOptional()
  sortOrder?: number;
}
