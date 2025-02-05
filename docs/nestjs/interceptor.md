# 📌 Dokumentasi: Membuat Interceptor di NestJS  

## 🎯 Tujuan  
Interceptor digunakan untuk menangkap dan memodifikasi permintaan atau respons dalam aplikasi **NestJS**. Dalam contoh ini, interceptor akan mengambil **access token** dari cookie, memverifikasinya, dan menambahkannya ke objek `request`.

---

## 📦 Instalasi  
Sebelum membuat interceptor, pastikan **JwtService** sudah diinstal dalam proyek NestJS:  

```sh
npm install @nestjs/jwt
```

---

## 🏗️ Membuat Interceptor  

### 1️⃣ Buat file interceptor  
Buat file interceptor, misalnya `get-cookie.interceptor.ts` di dalam folder `interceptors/`.  

### 2️⃣ Implementasi kode interceptor  
Kode lengkapnya adalah sebagai berikut:

```ts
import { JwtService } from '@nestjs/jwt';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface RequestWithToken extends Request {
    access_token?: string;
}

@Injectable()
export class GetCookieInterceptor implements NestInterceptor {
    constructor(private jwtService: JwtService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<RequestWithToken>();

        const access_token: unknown = request.cookies?.access_token;

        console.log('dari cookie interceptors', access_token);
        console.log(typeof access_token);

        if (access_token === '') {
            throw new UnauthorizedException('Access token tidak ditemukan di cookie');
        }

        if (typeof access_token !== 'string') {
            throw new UnauthorizedException('Type access token invalid');
        }

        const checkToken: unknown = this.jwtService.decode(access_token);

        if (checkToken) {
            request.access_token = access_token;
            return next.handle().pipe(
                map((data: unknown) => ({
                    custom: 'response-custom success get token',
                    data,
                })),
            );
        } else {
            throw new UnauthorizedException('Access token invalid');
        }
    }
}
```

---

## 🛠️ Cara Menggunakan Interceptor  

### 1️⃣ Tambahkan di Controller (Metode Spesifik)
Untuk menggunakan interceptor hanya pada metode tertentu:

```ts
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { GetCookieInterceptor } from '../interceptors/get-cookie.interceptor';

@Controller('example')
export class ExampleController {
    @Get()
    @UseInterceptors(GetCookieInterceptor)
    getData() {
        return { message: 'Hello, World!' };
    }
}
```

### 2️⃣ Tambahkan di Controller (Seluruh Controller)  
Jika ingin interceptor berlaku untuk semua metode dalam controller:

```ts
@UseInterceptors(GetCookieInterceptor)
@Controller('example')
export class ExampleController { 
    @Get()
    getData() {
        return { message: 'Hello, World!' };
    }
}
```

### 3️⃣ Tambahkan Secara Global  
Jika ingin interceptor berlaku untuk seluruh aplikasi:

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GetCookieInterceptor } from './interceptors/get-cookie.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    
    // Gunakan interceptor secara global
    app.useGlobalInterceptors(new GetCookieInterceptor(new JwtService()));

    await app.listen(3000);
}
bootstrap();
```

---

## 📋 Penjelasan Kode  
1. **Mengambil `access_token` dari cookie**  
   ```ts
   const access_token: unknown = request.cookies?.access_token;
   ```

2. **Validasi token**  
   - Jika token kosong:  
     ```ts
     if (access_token === '') {
         throw new UnauthorizedException('Access token tidak ditemukan di cookie');
     }
     ```
   - Jika token bukan string:  
     ```ts
     if (typeof access_token !== 'string') {
         throw new UnauthorizedException('Type access token invalid');
     }
     ```

3. **Dekode token menggunakan `JwtService`**  
   ```ts
   const checkToken: unknown = this.jwtService.decode(access_token);
   ```

4. **Menambahkan `access_token` ke request**  
   ```ts
   request.access_token = access_token;
   ```

5. **Mengubah respons** dengan menambahkan properti tambahan:  
   ```ts
   return next.handle().pipe(
       map((data: unknown) => ({
           custom: 'response-custom success get token',
           data,
       })),
   );
   ```

---

## 🎯 Kesimpulan  
- Interceptor ini menangkap request sebelum diteruskan ke handler.  
- Mengambil token dari **cookies** dan memverifikasinya menggunakan `JwtService`.  
- Menambahkan token yang valid ke objek request agar bisa digunakan dalam middleware atau controller.  
- Mengubah **response** sebelum dikirim ke client.  

Dengan cara ini, kita bisa mengelola token lebih **terstruktur dan aman** di aplikasi **NestJS** 🚀.