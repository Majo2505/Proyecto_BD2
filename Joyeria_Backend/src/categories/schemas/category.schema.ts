import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// 1. Definición del Tipo de Documento para Mongoose
export type CategoryDocument = Category & Document;

// 2. Definición del Esquema (Modelo de Mongoose)
@Schema()
export class Category {
  // Nombre de la categoría (ej: "Anillos", "Collares"). Debe ser único.
  @Prop({ required: true, unique: true })
  name: string; 

  // Descripción detallada de la categoría (Opcional)
  @Prop()
  description: string;
  
  // Campo que no forma parte de la relación directa, pero es útil para 
  // contar rápidamente cuántos productos tiene esta categoría (cache).
  @Prop({ default: 0 })
  productCount: number;
}

// 3. Exportación del Esquema para Mongoose
export const CategorySchema = SchemaFactory.createForClass(Category);