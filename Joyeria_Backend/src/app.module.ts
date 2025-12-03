import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/BD2_Joyeria'), 
    
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}


