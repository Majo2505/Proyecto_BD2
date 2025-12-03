// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema'; 
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  // Usamos 'UserDocument' como tipo de retorno para asegurar la compatibilidad con Mongoose
  
  // --- CREAR ---
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  // ---  LEER TODOS ---
  // Mantenemos User[] o Document[] ya que es un array
  async findAll(): Promise<User[]> { 
    return this.userModel.find().select('-password').populate('pastOrders', 'createdAt status orderNumber items orderTotal').exec();
  }

  // --- LEER UNO ---
  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).select('-password').populate('pastOrders', 'createdAt status orderNumber items orderTotal').exec();
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }
    return user; 
  }
  
  // --- ACTUALIZAR ---
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    const existingUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).select('-password');
    if (!existingUser) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }
    return existingUser;
  }

  // --- ELIMINAR  ---
  async remove(id: string): Promise<any> {
    const result = await this.userModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }
    return { message: 'Usuario eliminado exitosamente' };
  }
  
  
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }
}