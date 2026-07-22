import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class CreateOrderDto {
	@ApiProperty({ format: 'uuid' })
	@IsUUID()
	customerId!: string;

	@ApiPropertyOptional({ enum: OrderStatus, default: OrderStatus.PENDING })
	@IsOptional()
	@IsEnum(OrderStatus)
	status?: OrderStatus;
}
