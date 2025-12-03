// src/users/users.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';

@Controller('users')
// ValidationPipe globalmente para validar los DTOs
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) 
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //  POST /users 
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  //  GET /users 
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // GET /users/:id 
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  // PUT /users/:id 
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  //  DELETE /users/:id 
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  remove(@Param('id') id: string): Promise<any> {
    return this.usersService.remove(id);
  }
}