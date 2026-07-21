import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('customers')
export class Customer {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ length: 100 })
	firstName!: string;

	@Column({ length: 100 })
	lastName!: string;

	@Column({ unique: true, length: 255 })
	email!: string;

	@Column({ length: 20 })
	phone!: string;

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;
}
