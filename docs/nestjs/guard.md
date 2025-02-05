# 📌 Dokumentasi: Guard untuk Autentikasi di NestJS  

## 🎯 Tujuan  
Guard digunakan untuk **melindungi endpoint** di aplikasi **NestJS** dengan memverifikasi **JWT token** dari cookie. Jika token tidak valid atau tidak ditemukan, maka akses akan **ditolak** dengan **UnauthorizedException**.

---

## 📦 Instalasi  
Pastikan **JwtService** telah terinstal dalam proyek NestJS:  

```sh
npm install @nestjs/jwt
```

---

## 🏗️ Implementasi Guard  

### 1️⃣ Buat file guard  
Buat file `auth.guard.ts` di dalam folder `guards/`.  

### 2️⃣ Implementasi kode guard  
Kode lengkapnya adalah sebagai berikut:  

```ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();

        const access_token = request.cookies?.access_token as unknown;
        console.log('Dari cookie guard:', access_token);
        console.log('Tipe:', typeof access_token);

        if (!access_token || typeof access_token !== 'string') {
            throw new UnauthorizedException('Access token tidak ditemukan atau invalid');
        }

        const option: JwtVerifyOptions = {
            secret: process.env.JWT_SECRET,
        };

        try {
            const decodedToken = this.jwtService.verify(access_token, option) as unknown;
            if (decodedToken) {
                return true;
            }
            return false;
        } catch (error) {
            throw new UnauthorizedException('Access token invalid: ' + error.message);
        }
    }
}
```

---

## 🛠️ Cara Menggunakan Guard  

### 1️⃣ Terapkan pada Controller (Metode Spesifik)  
Guard bisa diterapkan hanya pada metode tertentu dalam controller:  

```ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';

@Controller('profile')
export class ProfileController {
    @Get()
    @UseGuards(AuthGuard)
    getProfile() {
        return { message: 'You have access to this profile' };
    }
}
```

### 2️⃣ Terapkan pada Seluruh Controller  
Jika ingin semua metode dalam controller dilindungi:  

```ts
@UseGuards(AuthGuard)
@Controller('profile')
export class ProfileController {
    @Get()
    getProfile() {
        return { message: 'You have access to this profile' };
    }
}
```

### 3️⃣ Terapkan Secara Global  
Jika ingin guard ini berlaku untuk seluruh aplikasi:  

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './guards/auth.guard';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    
    // Gunakan guard secara global
    app.useGlobalGuards(new AuthGuard(new JwtService()));

    await app.listen(3000);
}
bootstrap();
```

---

## 📋 Penjelasan Kode  
1. **Mengambil `access_token` dari cookie**  
   ```ts
   const access_token = request.cookies?.access_token as unknown;
   ```

2. **Validasi token**  
   - Jika token **tidak ditemukan atau bukan string**, maka akses **ditolak**:  
     ```ts
     if (!access_token || typeof access_token !== 'string') {
         throw new UnauthorizedException('Access token tidak ditemukan atau invalid');
     }
     ```

3. **Memverifikasi token dengan `JwtService`**  
   ```ts
   const option: JwtVerifyOptions = {
       secret: process.env.JWT_SECRET,
   };
   const decodedToken = this.jwtService.verify(access_token, option) as unknown;
   ```
   - **Jika token valid**, akses **diizinkan** (`return true`).  
   - **Jika token tidak valid**, akses **ditolak** (`UnauthorizedException`).  

---

## 🎯 Kesimpulan  
- **Guard** digunakan untuk **melindungi endpoint** di NestJS.  
- **JwtService** digunakan untuk **memverifikasi JWT token** dari cookie.  
- Jika token tidak valid atau tidak ditemukan, akses **ditolak** dengan **UnauthorizedException**.  
- Bisa digunakan **per metode, per controller, atau secara global**.  

Sekarang, aplikasi Anda lebih **aman** dengan **autentikasi berbasis token** 🚀.