import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { GetProductFilterDto } from './dto/get-product-filter-dto';
import { ProductRepository } from './product.repository';
import { Product } from './product.entity';
import { ProductStatus } from './product.status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product-dto';
import { ProductCategoryRepository } from '../products-category/product.category.repository';
import { User } from '../auth/user.entity';

@Injectable()
export class ProductsService {

    private logger = new Logger('ProductsService');

    constructor(
        @InjectRepository(ProductRepository)
        private productRepository: ProductRepository,
        @InjectRepository(ProductCategoryRepository)
        private productCategoryRepository: ProductCategoryRepository) {
    }

    async getProductById(id: number, user: User) : Promise<Product> {

        const prod = await this.productRepository.findOne(
            { where : {id, userId: user.id} }
        );

        if (!prod) {
            throw new NotFoundException(`Product with id '${id}' not found`);
        }

        return prod;

    }

    async getProducts() : Promise<Product[]> {
        return await this.productRepository.find();
    }

    async createProduct(dto: CreateProductDto, user: User) : Promise<Product> {

        try {

            const {categoryId} = dto;

            if (categoryId) {

                const productCategory = await this.productCategoryRepository.findOne(categoryId);
                if (!productCategory) {
                    throw new NotFoundException(`Product Category with id '${categoryId}' not found`);
                }

            }

            return this.productRepository.createProduct(dto, user);

        }
        catch (error) {

            this.logger.error(`[LOG] Failed to create product for user '${user.username}'. Data: '${JSON.stringify(dto)}'`, error.stack);
            throw error;

        }
    }

    async deleteProduct(id: number, user: User) : Promise<void> {

        const result = await this.productRepository.delete(
            {id, userId: user.id}
        );

        if (result.affected === 0) {
            throw new NotFoundException(`Product with id '${id}' not found`);
        }

    }

    async updateProductStatus(id: number, status: ProductStatus, user: User) : Promise<Product> {
        let prod = await this.getProductById(id, user);
        prod.status = status;
        await prod.save();
        return prod;
    }

    async getProductsByFilter(filterDto: GetProductFilterDto, user: User) : Promise<Product[]> {
        return await  this.productRepository.getProductsByFilter(filterDto, user);
    }

}
