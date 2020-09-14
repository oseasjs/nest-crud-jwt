import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product-dto';
import { GetProductFilterDto } from './dto/get-product-filter-dto';
import { ProductStatusValidationPipe} from './pipes/product-status-validation-pipe';
import { Product } from './product.entity';
import { ProductStatus } from './product.status.enum';
import { Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/decorator/get-user.decorator';

@Controller('products')
@UseGuards(AuthGuard())
export class ProductsController {

    private logger = new Logger('ProductsController');

    constructor(private productsService: ProductsService) {}

    @Get("/:id")
    getProductById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User) : Promise<Product> {
            
        this.logger.verbose(`User '${user.username}' is retriving a single product`);
        return this.productsService.getProductById(id, user);

    }

    @Get()
    getProducts(
        @Query(ValidationPipe) filterDto: GetProductFilterDto,
        @GetUser() user: User
    ) : Promise<Product[]> {
        this.logger.verbose(`User '${user.username}' is filtering products with filters '${JSON.stringify(filterDto)}' `);
        return this.productsService.getProductsByFilter(filterDto, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createProduct(
        @Body() dto: CreateProductDto,
        @GetUser() user: User) : Promise<Product> {
        return this.productsService.createProduct(dto, user);
    }

    @Delete("/:id")
    deleteProduct(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User) : Promise<void> {
        return this.productsService.deleteProduct(id, user);
    }

    @Patch('/:id')
    updateProductStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', new ProductStatusValidationPipe()) status: ProductStatus,
        @GetUser() user: User
        ) : Promise<Product> {
        return this.productsService.updateProductStatus(id, status, user);
    }

}
