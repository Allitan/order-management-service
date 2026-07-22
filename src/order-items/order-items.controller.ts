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
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemsService } from './order-items.service';

@ApiTags('order-items')
@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Create an order item' })
  @ApiResponse({ status: HttpStatus.CREATED, type: OrderItem })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid order item data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Order or product not found' })
  create(@Body() createOrderItemDto: CreateOrderItemDto) {
    return this.orderItemsService.create(createOrderItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all order items' })
  @ApiResponse({ status: HttpStatus.OK, type: OrderItem, isArray: true })
  findAll() {
    return this.orderItemsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an order item by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: OrderItem })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Order item not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.orderItemsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an order item' })
  @ApiResponse({ status: HttpStatus.OK, type: OrderItem })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid or empty update data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Order item, order, or product not found' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    return this.orderItemsService.update(id, updateOrderItemDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an order item' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Order item deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Order item not found' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.orderItemsService.remove(id);
  }
}
