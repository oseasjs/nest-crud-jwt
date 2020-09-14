import { IsOptional, IsIn, IsNotEmpty } from "class-validator";
import { ProductStatus } from "src/products/product.status.enum";
// import { ProductStatus } from 'src/products/product.model';

export class GetProductFilterDto {

    @IsOptional()
    @IsIn([ProductStatus.AVAILABLE, ProductStatus.IN_TRANSIT, ProductStatus.DELIVERED])
    status: ProductStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}