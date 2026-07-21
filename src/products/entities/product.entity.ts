import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ length: 150 })
	name!: string;

	@Column({ type: 'text', nullable: true })
	description!: string | null;

	@Column({ type: 'decimal', precision: 12, scale: 2 })
	price!: string;

	@Column({ type: 'integer' })
	stock!: number;

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;
}
