import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCityDto {
  @ApiProperty({ example: 'Dubai' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Main office and operations location', required: false })
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

  @ApiProperty({ example: 'country-uuid-goes-here' })
  @IsUUID()
  @IsNotEmpty()
  countryId!: string;
}

export class UpdateCityDto {
  @ApiProperty({ example: 'Dubai', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Main office and operations location', required: false })
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

  @ApiProperty({ example: 'country-uuid-goes-here', required: false })
  @IsUUID()
  @IsOptional()
  countryId?: string;
}
