import { IsMongoId, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Types } from 'mongoose';

export class ProductSnapshotDto {
  // Referencia al ID del producto original
  @IsMongoId()
  @IsNotEmpty()
  productId: Types.ObjectId;

  // Snapshot: Nombre del producto al momento de añadirlo
  @IsString()
  @IsNotEmpty()
  name: string;

  // Snapshot: Precio del producto al momento de añadirlo
  @IsNumber()
  @Min(0)
  price: number;

  // Cantidad de este producto en el carrito
  @IsNumber()
  @Min(1)
  quantity: number;
}
