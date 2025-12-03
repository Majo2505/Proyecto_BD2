// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string; // Se recomienda guardar aquí el HASH de la contraseña

  @Prop({ required: true })
  name: string;

  // Dirección simplificada (cadena de texto)
  @Prop({ required: true })
  address: string; 

  @Prop({ default: 'Client' }) // Puede ser 'Client' o 'Admin'
  role: string; 

  // Referencia a la colección Orders
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Order' }], default: [] })
  pastOrders: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);