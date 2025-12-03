// src/users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string; 

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @IsIn(['cliente', 'admin', 'vendedor'])
  readonly role: string;
}