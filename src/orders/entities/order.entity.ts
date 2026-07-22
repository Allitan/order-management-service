import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { OrderItem } from '../../order-items/entities/order-item.entity';

export enum OrderStatus {
	PENDING = 'PENDING',
	PROCESSING = 'PROCESSING',
	COMPLETED = 'COMPLETED',
	CANCELLED = 'CANCELLED',
}

@Entity('orders')
export class Order {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@ManyToOne(() => Customer, { nullable: false })
	customer!: Customer;

	@OneToMany(() => OrderItem, (orderItem) => orderItem.order)
	items!: OrderItem[];

	@Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
	status!: OrderStatus;

	@Column({ type: 'decimal', precision: 12, scale: 2, default: '0.00' })
	total!: string;

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;
}
