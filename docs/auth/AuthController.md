# AuthController
Untuk melakukan **unit test** pada `AuthController`, kita perlu melakukan **mocking** pada `AuthService`. Karena fungsi `login()` bergantung pada `req` dan `res` dari Express, kita juga perlu membuat **mock request dan response**.

---

### **Penjelasan**
1. **Mocking Dependensi**:
   - **`mockAuthService`**: Simulasi fungsi `Register()` dan `Login()`.
   - **`mockRequest` dan `mockResponse`**: Simulasi objek `req` dan `res` dari Express.

2. **Mock `req` dan `res`**:
   - `req.cookies`: Digunakan untuk menyimpan token.
   - `res.json()`, `res.cookie()`: Dimock agar kita bisa **mengecek apakah metode ini dipanggil**.

3. **Skenario Pengujian**:
   - **Panggilan ke `Register()`** → `AuthService.Register()` harus dipanggil dengan parameter yang benar.
   - **Panggilan ke `Login()`** → `AuthService.Login()` harus dipanggil dengan parameter yang benar.
   - **Login Berhasil** → Mengembalikan response yang sesuai.

---

### **Hasil yang Diharapkan**
✅ Jika `register()` dipanggil, `AuthService.Register()` harus dipanggil dengan parameter yang benar.  
✅ Jika `login()` dipanggil, `AuthService.Login()` harus dipanggil dengan parameter yang benar.  
✅ Jika login berhasil, response yang dikembalikan sesuai dengan yang diharapkan.  

---
