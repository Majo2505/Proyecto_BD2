// DTO para crear una categoría
export class CreateCategoryDto {
  readonly name: string;
  readonly description?: string; // Opcional
}