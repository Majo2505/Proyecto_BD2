import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true }) // Mantiene el registro automático de createdAt y updatedAt
export class Product {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, default: 0 })
  stock: number; // Campo esencial de inventario

  // --- RELACIÓN CON CATEGORIES (Obligatoria) ---
  
  // Desnormalización: Guarda el nombre de la categoría
  @Prop({ required: true })
  categoryName: string; 

  // Referencia de ID: Almacena el ID de la Categoría y establece la referencia Mongoose
  @Prop({ type: Types.ObjectId, required: true, ref: 'Category' })
  categoryId: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);