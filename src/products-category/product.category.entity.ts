import { BaseEntity, PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity()
export class ProductCategory extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

}