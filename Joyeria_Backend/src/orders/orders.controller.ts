import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders') // Ruta base: /orders
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // POST /orders - Crear una nueva orden
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  // GET /orders - Obtener todas las órdenes
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  // GET /orders/user/:userId - Obtener órdenes de un usuario específico
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.ordersService.findByUser(userId);
  }

  // GET /orders/:id - Obtener una orden por ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  // PATCH /orders/:id - Actualizar una orden (status, paymentStatus)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  // DELETE /orders/:id - Eliminar una orden
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}