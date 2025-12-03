import { Types } from 'mongoose';
import { IsOptional, IsArray, IsMongoId, IsNumber, IsInt, Min } from 'class-validator';

// DTO que recibe del cliente al agregar un producto
export class CartItemDto {
  @IsMongoId()
  productId: Types.ObjectId;

  @IsInt()
  @Min(1)
  quantity: number;
}

// Snapshot interno que se guarda en el carrito
export class CartProductSnapshot {
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

// DTO para crear carrito
export class CreateCartDto {
  @IsOptional()
  @IsMongoId()
  userId?: Types.ObjectId; // Carrito puede ser anónimo

  @IsArray()
  products: CartItemDto[] = []; // Recibimos solo productId y quantity

  @IsNumber()
  total: number = 0; // Se calcula automáticamente
}
