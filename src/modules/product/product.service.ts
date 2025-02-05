import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Product, ProductCreate } from './product.entity';

@Injectable()
export class ProductService {
    constructor(private prismaService: PrismaService ) { }

    async createProduct(product: ProductCreate): Promise<ProductCreate> {
        const newProduct = await this.prismaService.product.create({ data: product });
        return {
            name: newProduct.name,
            category: newProduct.category,
            price: newProduct.price
        }
    }

    async getAllProducts(): Promise<Product[]> {
        const products = await this.prismaService.product.findMany();
        return products;
    }

    async getProductById(id: number): Promise<Product | null> {
        const product = await this.prismaService.product.findUnique({ where: { id } });
        return product;
    }

    async updateProduct(id: number, product: Product): Promise<Product | null> {
        const updatedProduct = await this.prismaService.product.update({
            where: { id },
            data: product,
        });
        return updatedProduct;
    }

    async deleteProduct(id: number): Promise<Product | null> {
        const deletedProduct = await this.prismaService.product.delete({ where: { id } });
        return deletedProduct;
    }
}
