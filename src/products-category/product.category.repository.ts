import { Repository, EntityRepository } from "typeorm"
import { ProductCategory } from "./product.category.entity";

@EntityRepository(ProductCategory)
export class ProductCategoryRepository extends Repository<ProductCategory> {
    
}