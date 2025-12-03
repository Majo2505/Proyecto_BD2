import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCartDto, CartItemDto, CartProductSnapshot } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './schemas/cart.schema';
import { Product } from '../products/schemas/product.schema';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const productsWithSnapshot: CartProductSnapshot[] = [];

    for (const item of createCartDto.products) {
      const product = await this.productModel.findById(item.productId).exec();
      if (!product) throw new NotFoundException(`Product ${item.productId} not found`);

      productsWithSnapshot.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }

    createCartDto.products = productsWithSnapshot as any; // TS no se queja
    createCartDto.total = productsWithSnapshot.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0,
    );

    const createdCart = new this.cartModel(createCartDto);
    return createdCart.save();
  }

  async findAll(): Promise<Cart[]> {
    return this.cartModel.find().exec();
  }

  async findOne(id: string): Promise<Cart> {
    const cart = await this.cartModel.findById(id).exec();
    if (!cart) throw new NotFoundException(`Cart ${id} not found`);
    return cart;
  }

  async update(id: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    const updatedCart = await this.cartModel
      .findByIdAndUpdate(id, updateCartDto, { new: true })
      .exec();
    if (!updatedCart) throw new NotFoundException(`Cart ${id} not found`);
    return updatedCart;
  }

  async remove(id: string): Promise<Cart> {
    const removedCart = await this.cartModel.findByIdAndDelete(id).exec();
    if (!removedCart) throw new NotFoundException(`Cart ${id} not found`);
    return removedCart;
  }

  // Agregar producto al carrito (snapshot automático)
  async addProduct(cartId: string, productId: string, quantity = 1): Promise<Cart> {
    const cart = await this.findOne(cartId);

    const product = await this.productModel.findById(productId).exec();
    if (!product) throw new NotFoundException(`Product ${productId} not found`);

    const existingIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId,
    );

    if (existingIndex >= 0) {
      cart.products[existingIndex].quantity += quantity;
    } else {
      cart.products.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
      });
    }

    cart.total = cart.products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    return cart.save();
  }

  // Eliminar producto del carrito
  async removeProduct(cartId: string, productId: string): Promise<Cart> {
    const cart = await this.findOne(cartId);
    cart.products = cart.products.filter((p) => p.productId.toString() !== productId);
    cart.total = cart.products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    return cart.save();
  }
}
