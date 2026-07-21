import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsDecimal,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	Min,
} from 'class-validator';

export class CreateProductDto {
	@ApiProperty({ example: 'Wireless Keyboard', maxLength: 150 })
	@IsString()
	@IsNotEmpty()
	@MaxLength(150)
	name!: string;

	@ApiPropertyOptional({ example: 'Compact mechanical keyboard with Bluetooth connectivity.' })
	@IsOptional()
	@IsString()
	description?: string;

	@ApiProperty({ example: '89.99', description: 'Positive monetary amount with up to two decimal places' })
	@IsDecimal({ decimal_digits: '1,2', force_decimal: false })
	price!: string;

	@ApiProperty({ example: 25, minimum: 0 })
	@Type(() => Number)
	@IsInt()
	@Min(0)
	stock!: number;
}
