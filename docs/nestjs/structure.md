DTO (**Data Transfer Object**) adalah **objek khusus** yang digunakan untuk **mengirim dan menerima data** di dalam API. DTO bertindak sebagai **lapisan validasi** dan memastikan bahwa data yang masuk atau keluar dari aplikasi sesuai dengan struktur yang diharapkan.  

---

## **Mengapa Menggunakan DTO di API?**  
1. **Validasi Data**  
   - Mencegah input yang tidak valid atau berbahaya masuk ke dalam sistem.  
   - Bisa menggunakan **class-validator** untuk otomatis memvalidasi request.  

2. **Meningkatkan Keamanan**  
   - Mengontrol data yang bisa diterima oleh API dan menghindari input yang tidak diinginkan.  

3. **Memisahkan Model Database dengan API**  
   - **DTO ≠ Entity** → **DTO untuk API**, sedangkan **Entity untuk Database** (ORM seperti Prisma, TypeORM).  
   - Ini membantu agar perubahan struktur database **tidak langsung berdampak ke API**.  

4. **Menjaga Konsistensi & Dokumentasi API**  
   - Semua request dan response API memiliki **struktur yang jelas & konsisten**.  

---

## **Bagaimana Konsep DTO di Project API?**
### **Struktur DTO dalam Project API**
Misalkan kita punya fitur **Product**, maka DTO bisa seperti ini:  

```
src/
│── modules/
│   ├── product/
│   │   ├── product.controller.ts
│   │   ├── product.service.ts
│   │   ├── product.entity.ts
│   │   ├── product.module.ts
│   │   ├── dto/
│   │   │   ├── create-product.dto.ts
│   │   │   ├── update-product.dto.ts
│── common/
│   ├── guards/
│   ├── filters/
│── app.module.ts
```

### **Contoh Implementasi DTO**
📌 **1. `create-product.dto.ts` (Validasi untuk Create Product)**
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
- **`@IsNotEmpty()`** → Field tidak boleh kosong.  
- **`@IsString()`** → Memastikan `name` dan `description` adalah string.  
- **`@IsNumber()`** → Memastikan `price` adalah angka.  
- **`@Min(0)`** → Harga tidak boleh negatif.  

---

📌 **2. `update-product.dto.ts` (Validasi untuk Update Product)**
```typescript
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

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
✅ **Fungsi DTO ini:**  
- **`@IsOptional()`** → Field boleh kosong.  
- **Hanya mengupdate field yang diberikan** (tanpa memaksa semua field harus diisi).  

---

📌 **3. Menggunakan DTO di Controller**
```typescript
import { Controller, Post, Body, Put, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }
}
```
✅ **Fungsi Controller ini:**  
- Menggunakan **DTO sebagai tipe parameter** di `@Body()` untuk validasi otomatis.  
- **Tidak perlu validasi manual di dalam service**, karena **NestJS akan otomatis menolak request yang tidak valid**.  

---

📌 **4. Menggunakan DTO di Service**
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

  update(id: string, updateProductDto: UpdateProductDto) {
    const index = this.products.findIndex((p) => p.id === Number(id));
    if (index === -1) return { message: 'Product not found' };

    this.products[index] = { ...this.products[index], ...updateProductDto };
    return this.products[index];
  }
}
```
✅ **Fungsi Service ini:**  
- **DTO digunakan sebagai parameter** untuk memastikan data sudah divalidasi sebelum masuk ke database.  
- **Tidak perlu lagi memeriksa apakah `name`, `description`, dan `price` valid**, karena **DTO sudah menangani itu**.  

---

## **Kesimpulan**
✔ **DTO adalah cara terbaik untuk menangani validasi dan struktur data di API NestJS.**  
✔ **Menggunakan DTO membuat kode lebih bersih, aman, dan mudah dipahami.**  
✔ **NestJS secara otomatis memvalidasi request menggunakan class-validator dengan DTO.**  
