import { Test } from '@nestjs/testing';
import { ProductsService } from '../products.service';
import { ProductRepository } from '../product.repository';
import { ProductCategoryRepository } from '../../products-category/product.category.repository';
import { GetProductFilterDto } from '../dto/get-product-filter-dto';
import { ProductStatus } from '../product.status.enum';
import { CreateProductDto } from '../dto/create-product-dto';
import { NotFoundException } from '@nestjs/common';
import { User } from '../../auth/user.entity';
import { Product } from '../product.entity';

const mockUser = {
  id: 1,
  username: "username | mocked"
} as User;

const mockProduct = {
  id: 1, 
  name: "product name | mocked",
  description: 'product description | mocked',
  status: ProductStatus.AVAILABLE,
  productCategory: null
} as Product;

const mockProductCategory = () => ({
  id: 1, 
  name: "product category | mocked"
});

const mockProductCategoryRepository = () => ({
  findOne: jest.fn(),
});

const mockProductRepository = () => ({
  find: jest.fn(),
  getProductsByFilter: jest.fn(),
  findOne: jest.fn(),
  createProduct: jest.fn(),
  delete: jest.fn(),
});

describe('ProductsService', () => {

  let productsService: ProductsService;
  let productRepository;
  let productCategoryRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductsService,
        {provide: ProductRepository, useFactory: mockProductRepository},
        {provide: ProductCategoryRepository, useFactory: mockProductCategoryRepository}
      ],
    }).compile();

    productsService = await module.get<ProductsService>(ProductsService);
    productRepository = await module.get<ProductRepository>(ProductRepository);
    productCategoryRepository = await module.get<ProductCategoryRepository>(ProductCategoryRepository);

  });

  describe('getProducts', () => {
    it ('get all products from the repository | SUCCESSFUL', () => {

      productRepository.find.mockResolvedValue();
      expect(productRepository.find).toHaveBeenCalledTimes(0);
      
      productsService.getProducts();
      expect(productRepository.find).toHaveBeenCalledTimes(1);

    })
  })

  describe('getProductsByFilter', () => {
    it ('get products by filter from the repository | SUCCESSFUL', () => {

      productRepository.getProductsByFilter.mockResolvedValue();
      expect(productRepository.getProductsByFilter).toHaveBeenCalledTimes(0);

      const filterDto: GetProductFilterDto = {status: ProductStatus.AVAILABLE, search: 'none'};
      
      productsService.getProductsByFilter(filterDto, mockUser);
      expect(productRepository.getProductsByFilter).toHaveBeenCalledTimes(1);

    })
  })

  describe('getProductById', () => {
    it ('get product by id from the repository | SUCCESSFUL', () => {

      productRepository.findOne.mockResolvedValue(mockProduct);
      expect(productRepository.findOne).toHaveBeenCalledTimes(0);

      productsService.getProductById(1, mockUser);
      expect(productRepository.findOne).toHaveBeenCalledTimes(1);

    })

    it ('get product by invalid id from the repository | FAILED', () => {

      productRepository.findOne.mockResolvedValue();
      expect(productRepository.findOne).toHaveBeenCalledTimes(0);

      expect(productsService.getProductById(1, mockUser)).rejects.toThrow(NotFoundException);

    })

  })

  describe('createProduct', () => {
    it ('create a product on repository without product category | SUCCESSFUL', () => {

      productRepository.createProduct.mockResolvedValue(mockProduct);
      expect(productRepository.createProduct).toHaveBeenCalledTimes(0);
      
      productCategoryRepository.findOne.mockResolvedValue();
      expect(productCategoryRepository.findOne).toHaveBeenCalledTimes(0);

      const createProductDto : CreateProductDto = {name: 'none', description: 'none', categoryId: null};

      productsService.createProduct(createProductDto, mockUser);
      expect(productCategoryRepository.findOne).toHaveBeenCalledTimes(0);
      expect(productRepository.createProduct).toHaveBeenCalledTimes(1);

    });

    it ('create a product on repository with product category | SUCCESSFUL', async () => {

      productRepository.createProduct.mockResolvedValue(mockProduct);
      expect(productRepository.createProduct).toHaveBeenCalledTimes(0);

      productCategoryRepository.findOne.mockResolvedValue(mockProductCategory);
      expect(productCategoryRepository.findOne).toHaveBeenCalledTimes(0);

      const createProductDto : CreateProductDto = {name: 'none', description: 'none', categoryId: 1};

      await productsService.createProduct(createProductDto, mockUser);

      expect(productCategoryRepository.findOne).toHaveBeenCalledWith(1);
      expect(productRepository.createProduct).toHaveBeenCalledTimes(1);

    })

    it ('create a product on repository failed by invalid product category | FAILED', () => {

      productRepository.createProduct.mockResolvedValue();
      expect(productRepository.createProduct).toHaveBeenCalledTimes(0);

      productCategoryRepository.findOne.mockResolvedValue(); // Return null to force NotFoundException
      expect(productCategoryRepository.findOne).toHaveBeenCalledTimes(0);

      const createProductDto : CreateProductDto = {name: 'none', description: 'none', categoryId: 1};

      expect(productsService.createProduct(createProductDto, mockUser)).rejects.toThrow(NotFoundException);

    })

  })  

  describe('deleteProduct', () => {
    it ('delete product by id from the repository | SUCCESSFUL', () => {

      productRepository.delete.mockResolvedValue({affected: 1});
      expect(productRepository.delete).toHaveBeenCalledTimes(0);

      productsService.deleteProduct(1, mockUser);
      expect(productRepository.delete).toHaveBeenCalledTimes(1);

    })

    it ('delete product by id from the repository | FAILED', () => {

      productRepository.delete.mockResolvedValue({affected: 0});
      expect(productRepository.delete).toHaveBeenCalledTimes(0);

      expect(productsService.deleteProduct(1, mockUser)).rejects.toThrow(NotFoundException);

    })

  })

  describe('updateProductStatus', () => {
    it ('retrieve and update a product | SUCCESSFUL', async () => {

      const save = jest.fn();

      productRepository.findOne.mockResolvedValue({
        save, // To be called to update produce with new status
        id: mockProduct.id,
        name: mockProduct.name,
        description: mockProduct.description,
        status: mockProduct.status,
        productCategory: mockProduct.productCategory
      });

      const productUpdated = await productsService.updateProductStatus(1, ProductStatus.DELIVERED, mockUser);

      expect(productRepository.findOne).toHaveBeenCalledTimes(1);
      expect(save).toHaveBeenCalledTimes(1);

      expect(productUpdated.id).toEqual(mockProduct.id);
      expect(productUpdated.name).toEqual(mockProduct.name);
      expect(productUpdated.description).toEqual(mockProduct.description);
      expect(productUpdated.productCategory).toEqual(mockProduct.productCategory);
      
      expect(productUpdated.status).not.toEqual(mockProduct.status);
      expect(productUpdated.status).toEqual(ProductStatus.DELIVERED);
      
    })

    it ('retrieve and update a product with invalid id | FAILED', async () => {

      productRepository.findOne.mockResolvedValue(); // Return null to force NotFoundException
      expect(productCategoryRepository.findOne).toHaveBeenCalledTimes(0);

      expect(productsService.updateProductStatus(1, ProductStatus.DELIVERED, mockUser)).rejects.toThrow(NotFoundException);

    })

  })

})