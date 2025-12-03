import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';


interface OrderItemType {
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  // Generar número de orden único
  private async generateOrderNumber(): Promise<number> {
    const lastOrder = await this.orderModel
      .findOne()
      .sort({ orderNumber: -1 })
      .exec();
    return lastOrder ? lastOrder.orderNumber + 1 : 1000;
  }

  // Simular aprobación de pago (80% aprobado, 20% fallido)
  private simulatePaymentApproval(): string {
    const random = Math.random();
    return random < 0.8 ? 'Aprobado' : 'Fallido';
  }

  // POST /orders (Crear orden)
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, shippingAddress, items } = createOrderDto;

    // Validar que haya items
    if (!items || items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    // Obtener información de productos y crear snapshots
    const orderItems: OrderItemType[] = [];
    let orderTotal = 0;

    for (const item of items) {
      const product = await this.productModel.findById(item.productId).exec();
      
      if (!product) {
        throw new NotFoundException(`Product with ID "${item.productId}" not found`);
      }

      if (item.quantity < 1) {
        throw new BadRequestException('Quantity must be at least 1');
      }

      // Crear snapshot del producto (nombre y precio al momento de la compra)
      const orderItem: OrderItemType = {
        productId: new Types.ObjectId(item.productId),
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      };

      orderItems.push(orderItem);
      orderTotal += product.price * item.quantity;
    }

    // Simular aprobación de pago (80% aprobado)
    const paymentStatus = this.simulatePaymentApproval();

    // Generar número de orden secuencial
    const orderNumber = await this.generateOrderNumber();

    // Crear orden
    const createdOrder = new this.orderModel({
      orderNumber,
      userId: new Types.ObjectId(userId),
      shippingAddress,
      items: orderItems,
      orderTotal,
      paymentStatus,
      status: paymentStatus === 'Aprobado' ? 'Procesando' : 'Cancelado',
    });

    return createdOrder.save();
  }

  // GET /orders (Leer todas las órdenes)
  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  // GET /orders/user/:userId (Leer órdenes de un usuario específico)
  async findByUser(userId: string): Promise<Order[]> {
    return this.orderModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }

  // GET /orders/:id (Leer una orden por ID)
  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return order;
  }

  // PATCH /orders/:id (Actualizar orden - solo status y paymentStatus)
  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    // Validar estados permitidos
    if (updateOrderDto.status) {
      const validStatuses = ['Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado'];
      if (!validStatuses.includes(updateOrderDto.status)) {
        throw new BadRequestException(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }
    }

    if (updateOrderDto.paymentStatus) {
      const validPaymentStatuses = ['Aprobado', 'Fallido', 'Pendiente'];
      if (!validPaymentStatuses.includes(updateOrderDto.paymentStatus)) {
        throw new BadRequestException(`Invalid payment status. Must be one of: ${validPaymentStatuses.join(', ')}`);
      }
    }

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();

    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }

    return updatedOrder;
  }

  // DELETE /orders/:id (Eliminar orden)
  async remove(id: string): Promise<any> {
    const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();
    if (!deletedOrder) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return deletedOrder;
  }
}