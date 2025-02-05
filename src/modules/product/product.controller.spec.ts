import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

describe('ProductController', () => {
    let controller: ProductController;
    let productServiceMosk: Partial<ProductService>;

    beforeEach(async () => {

        productServiceMosk = {
            getAllProducts: jest.fn(),
            getProductById: jest.fn(),
            createProduct: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn(),
        }
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [
                {
                    provide: ProductService,
                    useValue: productServiceMosk
                }
            ]
        }).compile();
        controller = module.get<ProductController>(ProductController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    
});
