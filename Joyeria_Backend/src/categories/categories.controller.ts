import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories') // Define la ruta base para este recurso: /categories
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // --- 1. POST /categories (Crear)
  @Post()
  // Por defecto, NestJS devuelve 201 Created para POST
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  // --- 2. GET /categories (Leer todos)
  @Get()
  // Devuelve 200 OK
  findAll() {
    return this.categoriesService.findAll();
  }

  // --- 3. GET /categories/:id (Leer uno)
  @Get(':id')
  // Devuelve 200 OK
  findOne(@Param('id') id: string) {
    // El servicio maneja la excepción NotFoundException si no existe.
    return this.categoriesService.findOne(id);
  }

  // --- 4. PATCH /categories/:id (Actualizar)
  @Patch(':id')
  // Devuelve 200 OK
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    // El servicio maneja la actualización y la excepción NotFoundException.
    return this.categoriesService.update(id, updateCategoryDto);
  }

  // --- 5. DELETE /categories/:id (Eliminar)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Establece el código de respuesta 204 No Content
  remove(@Param('id') id: string) {
    // El servicio maneja la eliminación y las validaciones de relación con productos.
    return this.categoriesService.remove(id);
  }
}