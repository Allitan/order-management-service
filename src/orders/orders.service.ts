import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../customers/entities/customer.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatus } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const customer = await this.findCustomer(createOrderDto.customerId);
    const order = this.ordersRepository.create({
      customer,
      status: createOrderDto.status ?? OrderStatus.PENDING,
      total: '0.00',
    });

    return this.ordersRepository.save(order);
  }

  findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: { customer: true, items: { product: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: { customer: true, items: { product: true } },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} was not found`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    if (Object.keys(updateOrderDto).length === 0) {
      throw new BadRequestException('At least one order field must be provided');
    }

    const order = await this.findOne(id);
    const customer = updateOrderDto.customerId
      ? await this.findCustomer(updateOrderDto.customerId)
      : order.customer;
    const updatedOrder = this.ordersRepository.merge(order, {
      customer,
      status: updateOrderDto.status,
    });

    return this.ordersRepository.save(updatedOrder);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.ordersRepository.remove(order);
  }

  private async findCustomer(id: string): Promise<Customer> {
    const customer = await this.customersRepository.findOneBy({ id });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} was not found`);
    }

    return customer;
  }
}
