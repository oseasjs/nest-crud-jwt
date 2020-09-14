import { ProductRepository } from '../product.repository';
import { GetProductFilterDto } from '../dto/get-product-filter-dto';
import { User } from '../../auth/user.entity';
import { ProductStatus } from '../product.status.enum';
import { CreateProductDto } from '../dto/create-product-dto';
import { InternalServerErrorException } from '@nestjs/common';

const mockUser = {
  id: 1,
  username: 'username | mocked',
} as User;

describe('ProductsRepository', () => {

  let productRepository: ProductRepository;

  beforeEach(async () => {
    productRepository = new ProductRepository();    
  });

  describe('getProductsByFilter', () => {

    let filterDto: GetProductFilterDto;
    let leftJoinAndSelect = jest.fn();
    let where = jest.fn();
    let andWhere = jest.fn();
    let getMany = jest.fn();
    let queryMethod;

    beforeEach(() => {
      
      queryMethod = {
        leftJoinAndSelect, where, andWhere, getMany
      };

      productRepository.createQueryBuilder = jest.fn().mockReturnValue(queryMethod);

    });

    it('get products using filters with empty values | SUCCESSFUL', () => {

      filterDto = {status: null, search: null};

      expect(productRepository.getProductsByFilter(filterDto, mockUser)).resolves.not.toThrow();
      expect(productRepository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(queryMethod.leftJoinAndSelect).toHaveBeenCalledWith('product.productCategory', 'productCategory');
      expect(queryMethod.where).toHaveBeenCalledWith('product.user.id = :userId', {userId: mockUser.id});
      expect(queryMethod.andWhere).not.toHaveBeenCalled();
      expect(queryMethod.getMany).toHaveBeenCalled();

    })

    it('get products filtering by status | SUCCESSFUL', () => {

      filterDto = {status: ProductStatus.DELIVERED, search: null};

      expect(productRepository.getProductsByFilter(filterDto, mockUser)).resolves.not.toThrow();
      expect(productRepository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(queryMethod.leftJoinAndSelect).toHaveBeenCalledWith('product.productCategory', 'productCategory');
      expect(queryMethod.where).toHaveBeenCalledWith('product.user.id = :userId', {userId: mockUser.id});
      expect(queryMethod.andWhere).toHaveBeenCalledWith('product.status = :status', {status: ProductStatus.DELIVERED});
      expect(queryMethod.getMany).toHaveBeenCalled();

    })

    it('get products filtering by name or description (partial) | SUCCESSFUL', () => {

      const search : string = 'none';
      filterDto = {status: null, search: search};

      expect(productRepository.getProductsByFilter(filterDto, mockUser)).resolves.not.toThrow();
      expect(productRepository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(queryMethod.leftJoinAndSelect).toHaveBeenCalledWith('product.productCategory', 'productCategory');
      expect(queryMethod.where).toHaveBeenCalledWith('product.user.id = :userId', {userId: mockUser.id});
      expect(queryMethod.andWhere).toHaveBeenCalledWith('(product.name LIKE :search OR product.description LIKE :search)', {search: `%${search}%`});
      expect(queryMethod.getMany).toHaveBeenCalled();

    })

    it('get products filtering by status and (name or description) | SUCCESSFUL', () => {

      const search : string = 'none';
      filterDto = {status: ProductStatus.IN_TRANSIT, search: search};

      expect(productRepository.getProductsByFilter(filterDto, mockUser)).resolves.not.toThrow();
      expect(productRepository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(queryMethod.leftJoinAndSelect).toHaveBeenCalledWith('product.productCategory', 'productCategory');
      expect(queryMethod.where).toHaveBeenCalledWith('product.user.id = :userId', {userId: mockUser.id});
      expect(queryMethod.andWhere).toHaveBeenCalledWith('product.status = :status', {status: ProductStatus.IN_TRANSIT});
      expect(queryMethod.andWhere).toHaveBeenCalledWith('(product.name LIKE :search OR product.description LIKE :search)', {search: `%${search}%`});
      expect(queryMethod.getMany).toHaveBeenCalled();

    });

  });

  describe('createProduct', () => {

    it('create product | SUCCESSFULL', async () => {

      const productDto : CreateProductDto = {
        name: 'none',
        description: 'none',
        categoryId: 1,
      };

      let save = jest.fn();
      productRepository.create = jest.fn().mockImplementation(() => ({save}));

      const productSaved = await productRepository.createProduct(productDto, mockUser);

      expect(save).toHaveBeenCalled();

      expect(productSaved.name).toEqual(productDto.name);
      expect(productSaved.description).toEqual(productDto.description);
      expect(productSaved.status).toEqual(ProductStatus.AVAILABLE);
      expect(productSaved.userId).toEqual(mockUser.id);
      expect(productSaved.productCategory.id).toEqual(productDto.categoryId);
      expect(productSaved.user).toBeUndefined(); // Removed before retrieve product saved

    });

    it('create product without category | SUCCESSFULL', async () => {

      const productDto : CreateProductDto = {
        name: 'none',
        description: 'none',
        categoryId: null,
      };

      let save = jest.fn();
      productRepository.create = jest.fn().mockImplementation(() => ({save}));

      const productSaved = await productRepository.createProduct(productDto, mockUser);

      expect(save).toHaveBeenCalled();

      expect(productSaved.name).toEqual(productDto.name);
      expect(productSaved.description).toEqual(productDto.description);
      expect(productSaved.status).toEqual(ProductStatus.AVAILABLE);
      expect(productSaved.userId).toEqual(mockUser.id);
      expect(productSaved.productCategory).toBeUndefined();
      expect(productSaved.user).toBeUndefined(); // Removed before retrieve product saved

    });

    it('create product | FAILED', () => {

      const productDto : CreateProductDto = {
        name: 'none',
        description: 'none',
        categoryId: null,
      };

      let save = jest.fn().mockRejectedValue(new Error('Failed to validate create product with error'));
      productRepository.create = jest.fn().mockImplementation(() => ({save}));

      expect(productRepository.createProduct(productDto, mockUser)).rejects.toThrow(InternalServerErrorException);

    });

  });

});