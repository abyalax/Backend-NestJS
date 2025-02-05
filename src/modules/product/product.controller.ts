import { Body, Controller, Get, Post, Put, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product, ProductCreate } from './product.entity';

@Controller('/api/products')
export class ProductController {
    constructor(private productService: ProductService) { }

    @Get('/')
    getAllProducts() {
        return this.productService.getAllProducts()
    }

    @Post('/')
    async createProduct(@Body() product: ProductCreate) {
        return await this.productService.createProduct(product)
    }

    @Put('/:id')
    async updateProductById(@Param('id') id: number, @Body() product: Product) {
        return await this.productService.updateProduct(id, product)
    }

    @Delete('/:id')
    async deleteProductById(@Param('id') id: number) {
        return await this.productService.deleteProduct(id)
    }

}
