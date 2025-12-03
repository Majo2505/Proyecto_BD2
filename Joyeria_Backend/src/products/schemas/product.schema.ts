// src/products/schemas/product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Indica que esta clase es un esquema de Mongoose
@Schema()
export class Product extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, default: 0 })
  stock: number;

  // Desnormalización y Referencia
  @Prop({ required: true })
  categoryName: string; 

  @Prop({ type: Types.ObjectId, required: true, ref: 'Category' })
  categoryId: Types.ObjectId;

  // Arrays Embedded
  @Prop([String])
  photos: string[];

  @Prop([String])
  characteristics: string[];

  // Contadores del Proyecto
  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  boughtCount: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);