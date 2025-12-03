import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema'; // 👈 Importa Product
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>, // Inyección de Category
    @InjectModel(Product.name) private productModel: Model<ProductDocument>, // 👈 Inyección de Product
  ) {}

  // --- 1. POST /categories (Crear)
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const createdCategory = new this.categoryModel(createCategoryDto);
    return createdCategory.save();
  }

  // --- 2. GET /categories (Leer todos)
  async findAll(): Promise<Category[]> {
    // Encuentra todas las categorías
    return this.categoryModel.find().exec(); 
  }

  // --- 3. GET /categories/:id (Leer uno)
  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
        throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return category;
  }

  // --- 4. PATCH /categories/:id (Actualizar)
  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const updatedCategory = await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true }).exec();
     if (!updatedCategory) {
        throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return updatedCategory;
  }

  // --- 5. DELETE /categories/:id (Eliminar)
  // Lógica de Integridad: Verifica la relación 1:N antes de eliminar.
  async remove(id: string): Promise<any> {
    // 1. Verificar si existen productos asociados (usando el modelo Product)
    const productCount = await this.productModel.countDocuments({ categoryId: id }).exec();

    if (productCount > 0) {
      // Si hay productos, lanza un error 400 (Bad Request)
      throw new BadRequestException(
        `Cannot delete category with ID "${id}". It still has ${productCount} associated products.`
      );
    }
    
    // 2. Si no hay productos asociados, procede a eliminar la categoría
    const deletedCategory = await this.categoryModel.findByIdAndDelete(id).exec();
    
    if (!deletedCategory) {
        throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return deletedCategory;
  }
}