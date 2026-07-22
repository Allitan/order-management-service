import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    const [order, product] = await Promise.all([
      this.findOrder(createOrderItemDto.orderId),
      this.findProduct(createOrderItemDto.productId),
    ]);
    await this.decreaseStock(product, createOrderItemDto.quantity);
    const orderItem = this.orderItemsRepository.create({
      order,
      product,
      quantity: createOrderItemDto.quantity,
      unitPrice: product.price,
    });
    const savedOrderItem = await this.orderItemsRepository.save(orderItem);

    await this.updateOrderTotal(order.id);

    return savedOrderItem;
  }

  findAll(): Promise<OrderItem[]> {
    return this.orderItemsRepository.find({
      relations: { order: true, product: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<OrderItem> {
    const orderItem = await this.orderItemsRepository.findOne({
      where: { id },
      relations: { order: true, product: true },
    });

    if (!orderItem) {
      throw new NotFoundException(`Order item with ID ${id} was not found`);
    }

    return orderItem;
  }

  async update(
    id: string,
    updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    if (Object.keys(updateOrderItemDto).length === 0) {
      throw new BadRequestException('At least one order item field must be provided');
    }

    const orderItem = await this.findOne(id);
    const previousOrderId = orderItem.order.id;
    const previousProduct = orderItem.product;
    const order = updateOrderItemDto.orderId
      ? await this.findOrder(updateOrderItemDto.orderId)
      : orderItem.order;
    const product = updateOrderItemDto.productId
      ? await this.findProduct(updateOrderItemDto.productId)
      : orderItem.product;
    const quantity = updateOrderItemDto.quantity ?? orderItem.quantity;

    if (previousProduct.id === product.id) {
      const quantityDifference = quantity - orderItem.quantity;

      if (quantityDifference > 0) {
        await this.decreaseStock(product, quantityDifference);
      } else if (quantityDifference < 0) {
        await this.increaseStock(product, -quantityDifference);
      }
    } else {
      this.ensureSufficientStock(product, quantity);
      previousProduct.stock += orderItem.quantity;
      product.stock -= quantity;
      await Promise.all([
        this.productsRepository.save(previousProduct),
        this.productsRepository.save(product),
      ]);
    }

    const updatedOrderItem = this.orderItemsRepository.merge(orderItem, {
      order,
      product,
      quantity,
    });
    const savedOrderItem = await this.orderItemsRepository.save(updatedOrderItem);

    await this.updateOrderTotal(order.id);

    if (previousOrderId !== order.id) {
      await this.updateOrderTotal(previousOrderId);
    }

    return savedOrderItem;
  }

  async remove(id: string): Promise<void> {
    const orderItem = await this.findOne(id);
    await this.orderItemsRepository.remove(orderItem);
    await this.increaseStock(orderItem.product, orderItem.quantity);
    await this.updateOrderTotal(orderItem.order.id);
  }

  private async updateOrderTotal(orderId: string): Promise<void> {
    const orderItems = await this.orderItemsRepository.find({
      where: { order: { id: orderId } },
    });
    const totalInCents = orderItems.reduce(
      (total, orderItem) =>
        total + this.toCents(orderItem.unitPrice) * BigInt(orderItem.quantity),
      0n,
    );
    const order = await this.findOrder(orderId);

    order.total = this.formatCents(totalInCents);
    await this.ordersRepository.save(order);
  }

  private async findOrder(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOneBy({ id });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} was not found`);
    }

    return order;
  }

  private async findProduct(id: string): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} was not found`);
    }

    return product;
  }

  private async decreaseStock(product: Product, quantity: number): Promise<void> {
    this.ensureSufficientStock(product, quantity);
    product.stock -= quantity;
    await this.productsRepository.save(product);
  }

  private async increaseStock(product: Product, quantity: number): Promise<void> {
    product.stock += quantity;
    await this.productsRepository.save(product);
  }

  private ensureSufficientStock(product: Product, quantity: number): void {
    if (product.stock < quantity) {
      throw new BadRequestException(
        `Insufficient stock for product with ID ${product.id}`,
      );
    }
  }

  private toCents(price: string): bigint {
    const [wholePart, decimalPart = ''] = price.split('.');
    const normalizedDecimalPart = decimalPart.padEnd(2, '0').slice(0, 2);

    return BigInt(wholePart) * 100n + BigInt(normalizedDecimalPart);
  }

  private formatCents(amount: bigint): string {
    const wholePart = amount / 100n;
    const decimalPart = (amount % 100n).toString().padStart(2, '0');

    return `${wholePart}.${decimalPart}`;
  }
}
