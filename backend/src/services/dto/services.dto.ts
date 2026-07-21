import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt, IsArray, ArrayUnique } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ServiceStatus } from '@prisma/client';

export class CreateServiceDto {
  @ApiProperty({ example: 'Air Cargo Services' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'air-cargo' })
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @ApiProperty({ example: 'Fast air freight shipping globally', required: false })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiProperty({ example: 'Detailed description of air cargo...', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'MdFlight', required: false })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ example: '/images/air-cargo.png', required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: ['Express shipping', 'Door-to-door'], required: false, type: [String] })
  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  @IsOptional()
  features?: string[];

  @ApiProperty({ enum: ServiceStatus, example: ServiceStatus.ACTIVE, required: false })
  @IsEnum(ServiceStatus)
  @IsOptional()
  status?: ServiceStatus;

  @ApiProperty({ example: 0, required: false })
  @IsInt()
  @IsOptional()
  sortOrder?: number;
}

export class UpdateServiceDto {
  @ApiProperty({ example: 'Air Cargo Services', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'air-cargo', required: false })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ example: 'Fast air freight shipping globally', required: false })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiProperty({ example: 'Detailed description of air cargo...', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'MdFlight', required: false })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ example: '/images/air-cargo.png', required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: ['Express shipping', 'Door-to-door'], required: false, type: [String] })
  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  @IsOptional()
  features?: string[];

  @ApiProperty({ enum: ServiceStatus, example: ServiceStatus.ACTIVE, required: false })
  @IsEnum(ServiceStatus)
  @IsOptional()
  status?: ServiceStatus;

  @ApiProperty({ example: 0, required: false })
  @IsInt()
  @IsOptional()
  sortOrder?: number;
}
