import {IsNotEmpty, IsOptional} from 'class-validator';

export class CreateProductDto {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    description: string;

    @IsOptional() 
    categoryId: number
}