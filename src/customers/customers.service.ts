import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customersRepository.create(createCustomerDto);

    try {
      return await this.customersRepository.save(customer);
    } catch (error) {
      this.handleUniqueEmailViolation(error);
    }
  }

  findAll(): Promise<Customer[]> {
    return this.customersRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customersRepository.findOneBy({ id });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} was not found`);
    }

    return customer;
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.findOne(id);
    const updatedCustomer = this.customersRepository.merge(
      customer,
      updateCustomerDto,
    );

    try {
      return await this.customersRepository.save(updatedCustomer);
    } catch (error) {
      this.handleUniqueEmailViolation(error);
    }
  }

  async remove(id: string): Promise<void> {
    const customer = await this.findOne(id);
    await this.customersRepository.remove(customer);
  }

  private handleUniqueEmailViolation(error: unknown): never {
    if (error instanceof QueryFailedError && (error as { code?: string }).code === '23505') {
      throw new ConflictException('A customer with this email already exists');
    }

    throw error;
  }
}
