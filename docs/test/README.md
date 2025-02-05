**standar penamaan file test** untuk membedakan antara **unit test** dan **end-to-end (E2E) test**:  

| Jenis Test  | File Test |
|-------------|-------------|
| **Unit Test** (Service, Repository, Util) | `*.spec.ts` |
| **End-to-End Test** (Controller, API) | `*.e2e-spec.ts` |

---

### 📌 **Standar Penamaan**
1. **Unit Test** (`*.spec.ts`)  
   - Digunakan untuk **mengisolasi dan menguji satu unit kode**, seperti **service atau repository**.  
   - Tidak bergantung pada database atau HTTP request langsung.  
   - Contoh: `auth.service.spec.ts`, `user.repository.spec.ts`.

2. **End-to-End (E2E) Test** (`*.e2e-spec.ts`)  
   - Menguji **skenario lengkap dari request hingga response**, termasuk middleware, interceptor, dan filter.  
   - Menggunakan **supertest** untuk melakukan request ke controller.  
   - Biasanya dilakukan untuk **testing controller atau API endpoint**.  
   - Contoh: `auth.e2e-spec.ts`, `user.e2e-spec.ts`.

---

### 📌 **Contoh Struktur Folder Testing di NestJS**
📂 **project-root**  
 ┣ 📂 **src**  
 ┃ ┣ 📂 **auth**  
 ┃ ┃ ┣ 📜 `auth.service.ts`  
 ┃ ┃ ┣ 📜 `auth.controller.ts`  
 ┃ ┃ ┣ 📜 `auth.service.spec.ts`  **⬅ Unit test untuk service**  
 ┃ ┃ ┗ 📜 `auth.module.ts`  
 ┣ 📂 **test**  
 ┃ ┣ 📜 `setup.ts`  **⬅ Setup E2E testing**  
 ┃ ┣ 📜 `auth.e2e-spec.ts`  **⬅ End-to-End test untuk controller**  
 ┃ ┗ 📜 `user.e2e-spec.ts`  

---

### 📌 **Cara Menjalankan Test**
- **Unit Test (Service, Repository, etc.)**
  ```sh
  npm run test auth.service.spec.ts
  ```
- **E2E Test (Controller, API)**
  ```sh
  npm run test:e2e auth.e2e-spec.ts
  ```
- **Jalankan Semua Test**
  ```sh
  npm run test
  ```

🔥 **Kesimpulan**  
✔ **`*.spec.ts` untuk unit test (service, repository, helper).**  
✔ **`*.e2e-spec.ts` untuk end-to-end test (controller, API).**  
✔ **`supertest` di E2E test untuk simulasi HTTP request.**  

Dengan pattern ini, struktur testing akan lebih **bersih, rapi, dan konsisten**! 🚀