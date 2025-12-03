import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// El tipo de documento que Mongoose manejará
export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  name: string; 

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;
  
  @Prop({ default: Date.now })
  createdAt: Date; 
}

export const ProductSchema = SchemaFactory.createForClass(Product);