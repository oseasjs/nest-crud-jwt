import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ProductStatus } from 'src/products/product.status.enum';


export class ProductStatusValidationPipe implements PipeTransform {

    readonly allowedStatuses = [
        ProductStatus.AVAILABLE,
        ProductStatus.IN_TRANSIT,
        ProductStatus.DELIVERED
    ];

    transform(status: any) {

        status = status.toUpperCase();
        
        const idx = this.allowedStatuses.indexOf(status);
        const statusValid = idx !== -1;

        if (!statusValid) {
            throw new BadRequestException(`'${status}' is not a valid status`);
        }
        

        return status;
    }

}