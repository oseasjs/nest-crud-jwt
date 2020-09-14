import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { ProductStatus } from "./product.status.enum";

import { User } from '../auth/user.entity';
import { ProductCategory } from '../products-category/product.category.entity';

@Entity()
export class Product extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    status: ProductStatus;

    @ManyToOne(type => ProductCategory)
    @JoinColumn({name: 'product_category_id', referencedColumnName: 'id'})
    productCategory: ProductCategory;

    @ManyToOne(type => User, user => user.products)
    user: User;

    @Column()
    userId: number;

}