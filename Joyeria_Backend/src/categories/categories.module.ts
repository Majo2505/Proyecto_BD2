import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category, CategorySchema } from './schemas/category.schema';

// Importaciones para la relación con productos
import { Product, ProductSchema } from '../products/schemas/product.schema'; // 👈 IMPORTAR PRODUCTO

@Module({
  imports: [
    MongooseModule.forFeature([
      // 1. Registro del Schema de Categoría
      { name: Category.name, schema: CategorySchema },
      // 2. Registro del Modelo de Producto (para poder usarlo en el Service)
      { name: Product.name, schema: ProductSchema }, // 👈 REGISTRAR PRODUCTO
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  // Exportamos el MongooseModule para que otros módulos (como Products) puedan usar Category
  exports: [MongooseModule] 
})
export class CategoriesModule {}