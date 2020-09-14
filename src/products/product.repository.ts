import { Repository, EntityRepository } from "typeorm"
import { Product } from "./product.entity";
import { CreateProductDto } from "src/products/dto/create-product-dto";
import { ProductStatus } from "./product.status.enum";
import { GetProductFilterDto } from "src/products/dto/get-product-filter-dto";
import { ProductCategory } from "../products-category/product.category.entity";
import { User } from '../auth/user.entity';
import { Logger, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {

    private logger = new Logger('ProductRepository');

    async getProductsByFilter(filterDto: GetProductFilterDto, user: User) : Promise<Product[]> {

        const {status, search} = filterDto;
        const userId = user.id;

        const query = this.createQueryBuilder('product');
        query.leftJoinAndSelect("product.productCategory", "productCategory")

        query.where('product.user.id = :userId', {userId});

        if (status) {
            query.andWhere('product.status = :status', {status});
        }

        if (search) {
            query.andWhere('(product.name LIKE :search OR product.description LIKE :search)', {search: `%${search}%`});
        }

        return await query.getMany();

    }

    async createProduct(dto: CreateProductDto, user: User) : Promise<Product> {
        const product = this.create();
        const {name, description, categoryId} = dto;

        product.name = name;
        product.description = description;
        product.status = ProductStatus.AVAILABLE;
        product.userId = user.id;

        if (categoryId) {
            
            const productCategory = new ProductCategory();
            productCategory.id = categoryId;

            product.productCategory = productCategory;
            
        }

        try {
            await product.save();
        }
        catch (error) {
            this.logger.error(`Failed to create a product for user "${user.username}". Data: ${dto}`, error.stack);
            throw new InternalServerErrorException();
        }

        delete product.user;

        return product;

    }

}