import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

// Permite actualizar solo una parte de los campos de CreateCategoryDto
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}