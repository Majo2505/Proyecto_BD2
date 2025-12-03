import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; // Necesario para Types.ObjectId

// Importaciones de DTOs (asumiendo que los tienes creados)
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

// Importaciones de Schemas
import { Product, ProductDocument } from './schemas/product.schema';
import { Category, CategoryDocument } from '../categories/schemas/category.schema'; // Importación de Category

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>, // Inyección del Modelo de Category
  ) {}

  // --- FUNCIÓN DE VALIDACIÓN DE LA RELACIÓN ---
  private async validateAndPopulateCategory(dto: CreateProductDto | UpdateProductDto): Promise<void> {
    if (dto.categoryId) {
      // Usamos Types.ObjectId para asegurarnos de que el ID sea válido
      const categoryId = new Types.ObjectId(dto.categoryId as string); 
      
      const category = await this.categoryModel.findById(categoryId).exec();
      
      if (!category) {
        throw new BadRequestException(`Category with ID "${dto.categoryId}" not found.`);
      }

      // Desnormaliza el nombre de la categoría en el DTO antes de guardar
      (dto as any).categoryName = category.name;
    }
  }
  // -------------------------------------------


  // --- 1. POST /products (Crear Producto e Incrementar Contador)
  async create(createProductDto: CreateProductDto): Promise<Product> {
    // 1. Validar Categoría y Desnormalizar el Nombre
    await this.validateAndPopulateCategory(createProductDto); 

    // 2. Guardar el Producto
    const createdProduct = new this.productModel(createProductDto);
    const product = await createdProduct.save();

    // 3. 🚀 ACTUALIZAR LA RELACIÓN: INCREMENTAR EL CONTADOR
    await this.categoryModel.updateOne(
      { _id: product.categoryId },
      { $inc: { productCount: 1 } } // Usa $inc para incrementar productCount
    ).exec();

    return product;
  }

  // --- 2. GET /products (Leer todos con Categoría)
  async findAll(): Promise<Product[]> {
    return this.productModel
      .find()
      .populate('categoryId') // Carga los detalles de la categoría
      .exec(); 
  }
  
  // --- 3. GET /products/:id (Leer uno con Categoría)
  async findOne(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('categoryId')
      .exec();
      
    if (!product) {
        throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  // --- 4. PATCH /products/:id (Actualizar)
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    // Si se está actualizando el categoryId, valida que el nuevo exista
    await this.validateAndPopulateCategory(updateProductDto); 

    const updatedProduct = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
     
    // Lógica avanzada aquí debería manejar la actualización del contador si el categoryId *cambió*.
     
    if (!updatedProduct) {
        throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return updatedProduct;
  }

  // --- 5. DELETE /products/:id (Eliminar Producto y Decrementar Contador)
  async remove(id: string): Promise<any> {
    const productToDelete = await this.productModel.findById(id).exec();
    
    if (!productToDelete) {
        throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    // 1. Eliminar el Producto
    const deletedProduct = await this.productModel.deleteOne({ _id: id }).exec();

    // 2. 🚀 ACTUALIZAR LA RELACIÓN: DECREMENTAR EL CONTADOR
    // Decrementa el productCount de la categoría asociada
    await this.categoryModel.updateOne(
      { _id: productToDelete.categoryId, productCount: { $gt: 0 } }, // Seguridad: solo si productCount > 0
      { $inc: { productCount: -1 } } 
    ).exec();

    return deletedProduct;
  }
}