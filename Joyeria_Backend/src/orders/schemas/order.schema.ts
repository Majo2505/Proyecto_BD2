// src/orders/schemas/order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OrderItemSchema } from './order-item.schema'; // Importamos el sub-schema

@Schema()
export class Order extends Document {
  @Prop({ required: true, unique: true })
  orderNumber: number; // Número secuencial para el cliente

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  shippingAddress: string; // Dirección completa (Snapshot)

  @Prop({ type: [OrderItemSchema], default: [] })
  items: any[]; // Array de items con precios fijos

  @Prop({ required: true })
  orderTotal: number;

  @Prop({ required: true, default: 'Pending' }) // Pagado, Fallido, Pendiente
  paymentStatus: string; 

  @Prop({ required: true, default: 'Processing' }) // Procesando, Enviado, Entregado
  status: string; 

  @Prop({ default: Date.now })
  createdAt: Date; // Fecha de creación
}

export const OrderSchema = SchemaFactory.createForClass(Order);