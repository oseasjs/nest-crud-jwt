import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TypeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    ProductsModule,
    AuthModule
  ],
})
export class AppModule {}
