### **📌 Penggunaan DTO di API NestJS**
DTO (**Data Transfer Object**) digunakan dalam API NestJS untuk **memvalidasi dan mentransformasi data request** sebelum diproses oleh service. DTO biasanya digunakan dalam **Controller** saat menerima request dari client.

---

## **1️⃣ Contoh Implementasi DTO di API NestJS**
Kita akan membuat **API sederhana** untuk mengelola produk dengan:
- **DTO untuk validasi request API** (`POST /products`)
- **Service untuk menyimpan dan mengambil data**
- **Controller untuk menangani request API**

📌 **Struktur Folder:**
```
/src
 ├── /products
 │   ├── dto
 │   │   ├── create-product.dto.ts
 │   │   ├── update-product.dto.ts
 │   ├── product.controller.ts
 │   ├── product.service.ts
 │   ├── product.module.ts
```

---

### **2️⃣ Buat DTO untuk Validasi Request**
NestJS menggunakan `class-validator` untuk validasi DTO.

📌 **Instalasi class-validator & class-transformer**
```bash
npm install class-validator class-transformer
```

📌 **`create-product.dto.ts` (Validasi Data untuk Create Product)**
```typescript
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;
}
```
✅ **Fungsi DTO ini:**  
- **Memastikan `name` dan `description` adalah string**  
- **Memastikan `price` adalah angka & tidak negatif**  
- **Menolak request jika ada field kosong**  

---

📌 **`update-product.dto.ts` (Validasi Data untuk Update Product)**
```typescript
import { IsString, IsNumber, Min, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}
```
✅ **Update DTO menggunakan `@IsOptional()` untuk memungkinkan update sebagian**.

---

### **3️⃣ Menggunakan DTO di Controller**
📌 **`product.controller.ts`**
```typescript
import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Endpoint untuk menambahkan produk
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  // Endpoint untuk mengambil semua produk
  @Get()
  findAll() {
    return this.productService.getAll();
  }

  // Endpoint untuk update produk
  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(Number(id), updateProductDto);
  }
}
```
✅ **Di sini DTO digunakan untuk validasi input saat API menerima request.**  
- `@Body() createProductDto: CreateProductDto` → Memastikan request valid saat `POST /products`.  
- `@Body() updateProductDto: UpdateProductDto` → Memastikan request valid saat `PUT /products/:id`.  

---

### **4️⃣ Service untuk Mengelola Data**
📌 **`product.service.ts`**
```typescript
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  private products = [];

  create(createProductDto: CreateProductDto) {
    const newProduct = { id: Date.now(), ...createProductDto };
    this.products.push(newProduct);
    return newProduct;
  }

  getAll() {
    return this.products;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      return { message: 'Product not found' };
    }

    this.products[productIndex] = { ...this.products[productIndex], ...updateProductDto };
    return this.products[productIndex];
  }
}
```
✅ **Service ini menyimpan dan mengupdate data produk.**  
- **Menggunakan DTO sebagai parameter function** → memastikan data sudah tervalidasi di Controller.  
- **Tidak perlu validasi ulang di service** karena sudah dilakukan di DTO.  

---

### **5️⃣ Register Module**
📌 **`product.module.ts`**
```typescript
import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
```
✅ **Module ini menghubungkan Controller dan Service**.  

---

## **🚀 Hasil API Endpoint dengan DTO**
### **1️⃣ POST /products (Menambahkan Produk)**
📌 **Request Body:**
```json
{
  "name": "Laptop",
  "description": "Laptop gaming high-end",
  "price": 2000
}
```
✅ **Response:**
```json
{
  "id": 1700000000000,
  "name": "Laptop",
  "description": "Laptop gaming high-end",
  "price": 2000
}
```

---

### **2️⃣ POST /products (Data Tidak Valid)**
📌 **Request Body (price kosong):**
```json
{
  "name": "Mouse",
  "description": "Mouse wireless"
}
```
❌ **Response (Validasi DTO Gagal):**
```json
{
  "statusCode": 400,
  "message": ["price must be a number", "price should not be empty"],
  "error": "Bad Request"
}
```
✅ **DTO otomatis memvalidasi request tanpa perlu kode tambahan.**  

---

### **3️⃣ GET /products (Ambil Semua Produk)**
📌 **Response:**
```json
[
  {
    "id": 1700000000000,
    "name": "Laptop",
    "description": "Laptop gaming high-end",
    "price": 2000
  }
]
```

---

### **4️⃣ PUT /products/:id (Update Produk)**
📌 **Request Body:**
```json
{
  "price": 1800
}
```
✅ **Response:**
```json
{
  "id": 1700000000000,
  "name": "Laptop",
  "description": "Laptop gaming high-end",
  "price": 1800
}
```
✅ **Menggunakan `@IsOptional()` di `update-product.dto.ts`, sehingga bisa update sebagian data**.

---

## **🎯 Kesimpulan**
✔ **DTO digunakan dalam Controller untuk validasi request API sebelum masuk ke Service**.  
✔ **DTO mencegah request dengan data tidak valid (misalnya price negatif atau kosong)**.  
✔ **Menggunakan `class-validator`, DTO bisa mempermudah validasi tanpa perlu manual check**.  
✔ **Lebih aman dibanding langsung menerima `@Body()` sebagai objek tanpa validasi**.  

💡 **Best practice di NestJS:**  
- **Gunakan DTO (`class`) untuk validasi request API**  
- **Gunakan Interface untuk return type dari service atau database**  

🚀 **Dengan DTO, API kita jadi lebih aman dan lebih mudah dikelola!**