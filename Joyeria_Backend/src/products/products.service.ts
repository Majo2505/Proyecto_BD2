import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema'; 

@Injectable()
export class ProductsService {
  // Inyección del Modelo de Mongoose
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  // POST /products (Crear)
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  // GET /products (Leer todos)
  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec(); 
  }

  // GET /products/:id (Leer uno)
  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
        // Lanza una excepción si el producto no existe
        throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  // PATCH /products/:id (Actualizar)
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    // Busca por ID y actualiza, devolviendo el documento nuevo ({ new: true })
    const updatedProduct = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
     if (!updatedProduct) {
        throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return updatedProduct;
  }

  // DELETE /products/:id (Eliminar)
  async remove(id: string): Promise<any> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    if (!deletedProduct) {
        throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return deletedProduct;
  }
}