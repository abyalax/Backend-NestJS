# AuthService
Untuk melakukan **unit test** pada `AuthService`, kita perlu melakukan **mocking** pada dependensi `UserRepository` dan `JwtService`. Karena fungsi `Login` bergantung pada `req` dan `res` dari Express, kita juga perlu membuat **mock request dan response**.

---

### **Penjelasan**
1. **Mocking Dependensi**:
   - **`mockUserRepository`**: Simulasi fungsi `findByEmail()` & `create()`.
   - **`mockJwtService`**: Simulasi fungsi `signAsync()` & `verifyAsync()` untuk menangani token.

2. **Mock `req` dan `res`**:
   - `req.cookies`: Digunakan untuk menyimpan token.
   - `res.json()`, `res.cookie()`, `res.redirect()`: Dimock agar kita bisa **mengecek apakah metode ini dipanggil**.

3. **Skenario Pengujian**:
   - **Token Valid** → `verifyAsync()` berhasil → return data user and redirect to view.
   - **Token Invalid** → `verifyAsync()` gagal → return error.
   - **Email Tidak Ditemukan** → `findByEmail()` return `null` → throw `NotFoundException`.
   - **Password Salah** → `bcrypt.compare()` return `false` → throw `UnauthorizedException`.
   - **Login Berhasil** → `signAsync()` return token baru → set cookie → redirect to view/hello.
   - **Ketentuan Cookie**
   ```typescript
      const option: CookieOptions = {
         httpOnly: true,
         maxAge: 24 * 60 * 60 * 1000,
      }
   ```

---

### **Hasil yang Diharapkan**
✅ Jika token valid, user data dikembalikan dan di arahkan ke halaman view.  
✅ Jika token invalid, response berisi error.  
✅ Jika email tidak ditemukan, error `NotFoundException`.  
✅ Jika password salah, error `UnauthorizedException`.  
✅ Jika login sukses, token disimpan dalam cookie httpOnly.  

---