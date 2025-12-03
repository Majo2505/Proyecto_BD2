// src/carts/schemas/cart.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CartItemSchema } from './cart-item.schema'; // Importamos el sub-schema

@Schema()
export class Cart extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId: Types.ObjectId; // Puede ser null si es anónimo

  // Array de objetos embebidos usando el sub-schema
  @Prop({ type: [CartItemSchema], default: [] })
  items: any[]; 

  @Prop({ required: true, default: 0 })
  total: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);