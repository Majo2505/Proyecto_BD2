import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema }, // Necesario para validar productos al crear orden
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService], // Exportar para usarlo en Users module (pastOrders)
})
export class OrdersModule {}