import { IsString, IsNotEmpty, IsOptional, IsEmail, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(160)
  email!: string;

  @ApiProperty({ example: '+971 50 000 0000', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(40)
  phone?: string;

  @ApiProperty({ example: 'air-cargo', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(80)
  service?: string;

  @ApiProperty({ example: 'I need a quote for 3 pallets to Riyadh.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  message!: string;
}
