import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class CreateOrderDto {
  @ApiProperty({ example: 'Ahmed Al Maktoum' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({ example: '+971 52 754 0249' })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({ example: 'Dubai' })
  @IsString()
  @IsNotEmpty()
  fromCity!: string;

  @ApiProperty({ example: 'Riyadh' })
  @IsString()
  @IsNotEmpty()
  toCity!: string;

  @ApiProperty({ example: 'Air Cargo' })
  @IsString()
  @IsNotEmpty()
  cargoType!: string;

  @ApiProperty({ example: 'Fragile — 3 pallets', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.processing })
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}

export class UpdateOrderDto {
  @ApiProperty({ example: 2600, description: 'Agreed rate in AED', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  agreedRate?: number;

  @ApiProperty({ enum: OrderStatus, required: false })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
