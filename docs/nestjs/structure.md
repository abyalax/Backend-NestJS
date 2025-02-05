# 📌 **Dokumentasi Struktur Proyek NestJS**  

Dokumentasi ini menjelaskan **jenis, konsep, dan fungsi design pattern** yang digunakan dalam proyek **Final NestJS**, serta **kelebihan dan fungsionalitas** singkat dari setiap folder.  

## Full Structur Project
```
└── 📁Final Nest JS
    └── 📁docs
        └── 📁auth
            └── AuthController.md
            └── AuthService.md
        └── challenge.png
        └── 📁nestjs
            └── dto.md
            └── guard.md
            └── interceptor.md
            └── structure.md
        └── 📁test
            └── 📁jest
                └── mock.md
            └── README.md
    └── 📁prisma
        └── 📁migrations
            └── 📁20250201133230_create_table_users
                └── migration.sql
            └── 📁20250201164458_modify_field_email_to_be_unique
                └── migration.sql
            └── 📁20250202060043_create_model_products_and_change_name_model_user_to_users
                └── migration.sql
            └── 📁20250202060545_adding_field_price_product
                └── migration.sql
            └── migration_lock.toml
        └── schema.prisma
    └── 📁src
        └── app.controller.spec.ts
        └── app.controller.ts
        └── app.module.ts
        └── app.service.ts
        └── 📁common
            └── authcookie.guard.ts
            └── example.interceptor.ts
            └── http-exception.filter.ts
            └── response-api.dto.ts
        └── main.ts
        └── 📁modules
            └── 📁auth
                └── auth.controller.spec.ts
                └── auth.controller.ts
                └── auth.dto.ts
                └── auth.module.ts
                └── auth.service.ts
            └── 📁prisma
                └── prisma.module.ts
                └── prisma.service.ts
            └── 📁product
                └── product.controller.spec.ts
                └── product.controller.ts
                └── product.entity.ts
                └── product.module.ts
                └── product.service.ts
            └── 📁user
                └── user.controller.ts
                └── user.dto.ts
                └── user.module.ts
                └── user.service.ts
    └── 📁tests
        └── 📁jest
            └── app.e2e-spec.ts
            └── auth.e2e-spec.ts
            └── jest-e2e.json
        └── 📁playwright
            └── auth.spec.ts
    └── 📁views
        └── hello.html
        └── index.html
        └── login.html
        └── register.html
    └── .env
    └── .env.development
    └── .env.test
    └── .gitignore
    └── eslint.config.mjs
    └── nest-cli.json
    └── package-lock.json
    └── package.json
    └── playwright.config.ts
    └── README.md
    └── tsconfig.build.json
    └── tsconfig.json
```

---

## **🛠️ Design Pattern yang Digunakan**  

### 1️⃣ **Modular Monolith Architecture**  
- Struktur ini membagi aplikasi menjadi **beberapa module**, masing-masing menangani fitur spesifik, seperti **auth**, **product**, dan **user**.  
- Setiap module memiliki **controller, service, dan DTO**, sehingga **mudah diperluas dan dikelola**.  

### 2️⃣ **Dependency Injection (DI)**  
- **NestJS menggunakan DI** untuk mengelola ketergantungan antara service dan repository.  
- Contoh: `auth.service.ts` tidak membuat instance `PrismaService` secara langsung, melainkan mendapatkannya dari **DI Container**.  

### 3️⃣ **Repository Pattern**  
- Digunakan dalam `prisma.service.ts` untuk mengakses database.  
- **Memisahkan logika bisnis dari akses database**, membuat kode lebih bersih dan terstruktur.  

### 4️⃣ **Middleware & Interceptor Pattern**  
- **Middleware** (`authcookie.guard.ts`) untuk memproses request sebelum masuk ke controller.  
- **Interceptor** (`example.interceptor.ts`) untuk memodifikasi response sebelum dikirim ke client.  

---

## **📂 Penjelasan Tiap Folder**  

### 📁 `docs/` – Dokumentasi Proyek  
> Berisi catatan tentang berbagai aspek proyek, termasuk **auth, DTO, guard, interceptor**, dan **struktur proyek**.  

- 📁 `auth/` – Dokumentasi **AuthController** dan **AuthService**.  
- 📁 `nestjs/` – Dokumentasi tentang berbagai fitur **NestJS**, seperti **DTO, Guard, dan Interceptor**.  
- 📁 `test/` – Dokumentasi terkait **unit test dan e2e test**.  

📌 **Kelebihan:**  
✅ Memudahkan pengembang dalam memahami dan mengembangkan proyek.  
✅ Dokumentasi **terorganisir** berdasarkan fitur dan komponen.  

---

### 📁 `prisma/` – Database Management  
> Berisi skema database dan file migrasi untuk **PostgreSQL** menggunakan **Prisma ORM**.  

- 📁 `migrations/` – Berisi **script migrasi database** untuk melacak perubahan struktur tabel.  
- `schema.prisma` – **Definisi skema database**, termasuk model **users** dan **products**.  

📌 **Kelebihan:**  
✅ **Database Schema as Code** – Semua perubahan database terdokumentasi dan bisa di-rollback.  
✅ **Mudah digunakan dengan TypeScript** berkat integrasi Prisma.  

---

### 📁 `src/` – **Source Code Aplikasi**  
> Folder utama yang berisi **logika aplikasi**, termasuk controller, service, DTO, dan middleware.  

#### 📁 `common/` – **Utility dan Middleware**  
- `authcookie.guard.ts` – Guard untuk **autentikasi** menggunakan cookie.  
- `example.interceptor.ts` – Interceptor untuk **memodifikasi response API**.  
- `http-exception.filter.ts` – Filter untuk menangani **error global**.  
- `response-api.dto.ts` – Data Transfer Object (DTO) untuk **struktur response API**.  

📌 **Kelebihan:**  
✅ **Reusable components** – Middleware dan utility bisa digunakan di seluruh aplikasi.  
✅ **Centralized error handling** – **Memudahkan debugging** dan meningkatkan keamanan.  

#### 📁 `modules/` – **Modular Structure**  
> Setiap module adalah **unit independen**, yang memiliki controller, service, DTO, dan konfigurasi sendiri.  

📌 **Modul yang ada:**  
1. 📁 `auth/` – **Manajemen autentikasi pengguna**.  
   - `auth.controller.ts` – Menangani request dari **client**.  
   - `auth.service.ts` – Logika autentikasi dan JWT.  
   - `auth.dto.ts` – DTO untuk validasi input.  
2. 📁 `prisma/` – **Database Service**.  
   - `prisma.service.ts` – Menyediakan akses ke database.  
3. 📁 `product/` – **Manajemen produk**.  
   - `product.controller.ts` – Menangani request **produk**.  
   - `product.service.ts` – Logika bisnis produk.  
4. 📁 `user/` – **Manajemen pengguna**.  
   - `user.controller.ts` – Menangani request pengguna.  
   - `user.service.ts` – Logika bisnis pengguna.  

📌 **Kelebihan:**  
✅ **Mudah dikembangkan** – Modul dapat ditambahkan tanpa mengganggu kode lain.  
✅ **High Cohesion & Low Coupling** – Modul saling **terpisah**, sehingga lebih terstruktur.  

---

### 📁 `tests/` – **Unit & Integration Testing**  
> Berisi **unit test dan e2e test** untuk menguji fungsionalitas aplikasi.  

#### 📁 `jest/` – **Unit & E2E Test dengan Jest**  
- `app.e2e-spec.ts` – **End-to-end testing** untuk aplikasi utama.  
- `auth.e2e-spec.ts` – **End-to-end testing** untuk autentikasi.  
- `jest-e2e.json` – Konfigurasi **Jest** untuk E2E test.  

#### 📁 `playwright/` – **Testing UI dengan Playwright**  
- `auth.spec.ts` – **Test autentikasi menggunakan Playwright**.  

📌 **Kelebihan:**  
✅ **Meningkatkan Keamanan** – Menghindari bug sebelum **deployment**.  
✅ **Automated Testing** – Memastikan **endpoint bekerja dengan baik**.  

---

### 📁 `views/` – **Halaman HTML untuk Frontend**  
> Berisi file **HTML statis** untuk tampilan sederhana.  

- `index.html` – Halaman utama.  
- `login.html` – Halaman login.  
- `register.html` – Halaman registrasi.  

📌 **Kelebihan:**  
✅ **Mempermudah debugging** jika ingin menguji endpoint tanpa frontend framework.  

---

### 📁 **File Konfigurasi Utama**  
> File yang digunakan untuk konfigurasi aplikasi.  

- `.env` – Konfigurasi **environment variables**.  
- `nest-cli.json` – Konfigurasi **NestJS CLI**.  
- `package.json` – **Dependency management** untuk proyek.  
- `tsconfig.json` – Konfigurasi **TypeScript**.  
- `eslint.config.mjs` – Konfigurasi **ESLint** untuk standarisasi kode.  

📌 **Kelebihan:**  
✅ **Memudahkan pengaturan environment dan dependency**.  
✅ **Membantu menjaga kualitas kode dengan linting**.  

---

## **🔍 Kesimpulan**  
Struktur proyek ini **modular dan terorganisir**, dengan beberapa **design pattern** utama:  
- **Modular Monolith** → Memudahkan pengelolaan fitur secara independen.  
- **Dependency Injection** → Mengurangi coupling dan meningkatkan skalabilitas.  
- **Repository Pattern** → Memisahkan logika bisnis dari database.  
- **Middleware & Interceptor** → Untuk validasi dan manipulasi request/response.  

Dengan struktur ini, proyek **mudah dikembangkan, diperluas, dan dikelola**, baik untuk **tim kecil maupun besar** 🚀.