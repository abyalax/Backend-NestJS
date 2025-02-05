# 📌 Dokumentasi: Data Transfer Object (DTO) di NestJS  

## 🎯 Tujuan  
DTO (**Data Transfer Object**) digunakan untuk memastikan bahwa data yang masuk ke dalam aplikasi NestJS telah **divalidasi** sebelum diteruskan ke logika bisnis.  

---

## 📦 Instalasi  
Sebelum menggunakan DTO, pastikan Anda telah menginstal **class-validator** dan **class-transformer**:  

```sh
npm install class-validator class-transformer
```

---

## 🏗️ Implementasi DTO  

### 1️⃣ `LoginDTO`  
Digunakan untuk validasi saat user melakukan login.  

```ts
import { IsNotEmpty, IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDTO {
    @IsNotEmpty()
    @IsEmail({}, { message: 'Please enter correct email' })
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    access_token?: string;
}
```

**Penjelasan:**  
- `@IsNotEmpty()` → Field tidak boleh kosong.  
- `@IsEmail({}, { message: 'Please enter correct email' })` → Memvalidasi format email.  
- `@IsString()` → Memastikan nilai berupa string.  
- `@MinLength(6, { message: 'Password must be at least 6 characters long' })` → Password minimal 6 karakter.  
- `access_token` bersifat opsional (`?`) dan tidak memiliki validasi karena tidak selalu diperlukan.  

---

### 2️⃣ `RegisterDTO`  
Digunakan untuk validasi saat user melakukan registrasi.  

```ts
import { IsNotEmpty, IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDTO {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Please enter correct email' })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    readonly password: string;
}
```

**Perbedaan dengan `LoginDTO`:**  
- Memiliki **`name`** sebagai field tambahan untuk nama pengguna.  
- Semua properti menggunakan `readonly`, yang berarti tidak bisa diubah setelah DTO dibuat.  

---

## 🛠️ Cara Menggunakan DTO dalam Controller  

Gunakan DTO dalam controller dengan **Pipes** untuk validasi otomatis.  

```ts
import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
    @Post('login')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    login(@Body() loginDto: LoginDTO) {
        return {
            message: 'Login success',
            email: loginDto.email,
        };
    }

    @Post('register')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    register(@Body() registerDto: RegisterDTO) {
        return {
            message: 'Register success',
            name: registerDto.name,
        };
    }
}
```

**Penjelasan:**  
- `@Body()` → Mengambil data dari request body dan memetakannya ke DTO.  
- `@UsePipes(new ValidationPipe({ whitelist: true }))`  
  - **`ValidationPipe`** akan otomatis memvalidasi input sesuai DTO.  
  - **`whitelist: true`** akan menghapus properti yang tidak didefinisikan dalam DTO dari request body.  

---

## 📋 Kesimpulan  
- **DTO** digunakan untuk validasi data sebelum diproses di controller.  
- **class-validator** memungkinkan validasi otomatis berdasarkan decorator.  
- **ValidationPipe** digunakan untuk memvalidasi request agar sesuai dengan DTO.  
- Menggunakan DTO meningkatkan **keamanan** dan **konsistensi** data dalam aplikasi.  

Sekarang, semua request akan **divalidasi secara otomatis** sebelum diproses lebih lanjut 🚀.