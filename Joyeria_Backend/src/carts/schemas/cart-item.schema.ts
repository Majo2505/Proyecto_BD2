// src/carts/schemas/cart-item.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// NO extiende de Document, es solo un sub-esquema para ser embebido
@Schema({ _id: false }) // No necesitamos un _id para cada item en el array
export class CartItem {
    @Prop({ type: Types.ObjectId, required: true, ref: 'Product' })
    productId: Types.ObjectId;

    @Prop({ required: true })
    name: string; // Snapshot del nombre

    @Prop({ required: true })
    price: number; // Snapshot del precio

    @Prop({ required: true })
    quantity: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);