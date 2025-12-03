import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CartsModule } from './carts/carts.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/BD2_Joyeria'),
    ProductsModule,
    CategoriesModule,
    CartsModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
