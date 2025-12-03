export class CreateProductDto {
  readonly name: string;
  readonly description?: string; // Opcional
  readonly price: number;
  readonly stock: number;
  
  // Campos de Relación Requeridos
  readonly categoryName: string;
  readonly categoryId: string; // Se recibe como string y se convierte en el Service
}