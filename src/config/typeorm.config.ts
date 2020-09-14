import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const TypeOrmConfig : TypeOrmModuleOptions = {

    type: 'postgres',
    host: 'localhost',
    port: 15432,
    username: 'admin',
    password: 'admin',
    database: 'nestjs-crud-jwt',
    entities: [__dirname + '/../**/*.entity.{ts,js}'],
    synchronize: true,

}