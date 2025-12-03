import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

// Subdocumento para items (snapshot de productos)
class OrderItem {
  @Prop({ required: true, type: Types.ObjectId })
  productId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 1 })
  quantity: number;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: number;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  shippingAddress: string;

  @Prop({ required: true, type: [OrderItem] })
  items: OrderItem[];

  @Prop({ required: true, min: 0 })
  orderTotal: number;

  @Prop({ 
    required: true, 
    enum: ['Aprobado', 'Fallido', 'Pendiente'],
    default: 'Pendiente'
  })
  paymentStatus: string;

  @Prop({ 
    required: true, 
    enum: ['Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado'],
    default: 'Pendiente'
  })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);