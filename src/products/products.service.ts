import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  findAll(): Promise<Product[]> {
    return this.productsRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} was not found`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    if (Object.keys(updateProductDto).length === 0) {
      throw new BadRequestException('At least one product field must be provided');
    }

    const product = await this.findOne(id);
    const updatedProduct = this.productsRepository.merge(
      product,
      updateProductDto,
    );

    return this.productsRepository.save(updatedProduct);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }
}
