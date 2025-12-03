// src/orders/schemas/order-item.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false }) 
export class OrderItem {
    @Prop({ type: Types.ObjectId, required: true, ref: 'Product' })
    productId: Types.ObjectId;

    @Prop({ required: true })
    name: string; // Snapshot del nombre

    @Prop({ required: true })
    price: number; // Snapshot del precio

    @Prop({ required: true })
    quantity: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);