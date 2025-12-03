// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// El tipo de documento que Mongoose manejará
export type UserDocument = User & Document;

@Schema({ timestamps: true }) 
export class User extends Document {

  @Prop({ required: true, unique: true, index: true })
  email: string; 

  @Prop({ required: true })
  password: string; 

  @Prop({ required: true })
  name: string; 

  @Prop({ required: true })
  address: string; 

//rol
  @Prop({ 
    required: true, 
    enum: ['cliente', 'admin', 'vendedor'], 
    default: 'cliente' 
  }) 
  role: string; 

  // --- Relación USERS → ORDERS (1 A N) ---
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Order' }], default: [] })
  pastOrders: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);