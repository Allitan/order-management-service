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
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a customer' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Customer })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email already exists' })
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all customers' })
  @ApiResponse({ status: HttpStatus.OK, type: Customer, isArray: true })
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a customer by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: Customer })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer' })
  @ApiResponse({ status: HttpStatus.OK, type: Customer })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email already exists' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Customer deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.customersService.remove(id);
  }
}
