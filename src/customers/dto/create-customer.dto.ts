import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MaxLength } from 'class-validator';

export class CreateCustomerDto {
	@ApiProperty({ example: 'Ada' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	firstName!: string;

	@ApiProperty({ example: 'Lovelace' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	lastName!: string;

	@ApiProperty({ example: 'ada.lovelace@example.com' })
	@IsEmail()
	@MaxLength(255)
	email!: string;

	@ApiProperty({ example: '+34912345678' })
	@IsPhoneNumber()
	@MaxLength(20)
	phone!: string;
}
