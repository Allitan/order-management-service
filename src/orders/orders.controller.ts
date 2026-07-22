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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create an order' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Order })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid order data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all orders' })
  @ApiResponse({ status: HttpStatus.OK, type: Order, isArray: true })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an order by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: Order })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Order not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an order' })
  @ApiResponse({ status: HttpStatus.OK, type: Order })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid or empty update data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Order or customer not found' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an order' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Order deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Order not found' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.ordersService.remove(id);
  }
}
