import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a product' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Product })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid product data' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all products' })
  @ApiResponse({ status: HttpStatus.OK, type: Product, isArray: true })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a product by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: Product })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Product not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: HttpStatus.OK, type: Product })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid or empty update data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Product not found' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Product deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Product not found' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productsService.remove(id);
  }
}
