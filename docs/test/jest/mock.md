jenis-jenis **mock** di Jest beserta penjelasan singkat tentang penggunaannya:

1. **`jest.fn()`**

    Membuat fungsi mock yang dapat di-**spy** dan di-**stub** untuk memeriksa pemanggilan dan hasilnya.

1. **`jest.mock(moduleName)`**

    Mengganti modul atau dependensi eksternal dengan versi mock untuk pengujian.

2. **`jest.spyOn(object, methodName)`**

    Membuat spy di metode objek tertentu, memungkinkan untuk memantau dan memodifikasi perilakunya tanpa mengubah implementasi aslinya.

3. **`jest.mockImplementation(fn)`**

    Menetapkan implementasi baru untuk fungsi yang dimock, menggantikan implementasi asli.

4. **`jest.mockImplementationOnce(fn)`**

    Menetapkan implementasi baru untuk satu kali pemanggilan fungsi yang dimock (hanya sekali, selanjutnya akan mengikuti implementasi default).

5. **`jest.clearAllMocks()`**

    Membersihkan semua mock dan spy yang telah dipanggil, digunakan untuk mereset status mock di antara pengujian.

6. **`jest.resetAllMocks()`**

    Mengembalikan mock dan spy ke kondisi semula, menghapus semua status yang dimodifikasi (termasuk hasil mock).

7. **`jest.restoreAllMocks()`**

    Mengembalikan metode yang dipantau (`spyOn`) ke implementasi asli setelah mock diterapkan.

8. **`jest.fn().mockReturnValue(value)`**

    Mengatur nilai yang dikembalikan setiap kali fungsi mock dipanggil.

9.  **`jest.fn().mockResolvedValue(value)`**

    Mengatur nilai yang dikembalikan ketika fungsi mock dipanggil dan mengembalikan `Promise.resolve(value)` (untuk asinkron).

10. **`jest.fn().mockRejectedValue(value)`**

    Mengatur nilai yang dikembalikan ketika fungsi mock dipanggil dan mengembalikan `Promise.reject(value)` (untuk asinkron).

11. **`jest.fn().mockReturnValueOnce(value)`**

    Menetapkan nilai yang dikembalikan hanya sekali pada pemanggilan pertama fungsi mock.

12. **`jest.fn().mockResolvedValueOnce(value)`**

    Menetapkan nilai yang dikembalikan hanya sekali pada pemanggilan pertama fungsi mock dalam bentuk resolved promise.

13. **`jest.fn().mockRejectedValueOnce(value)`**

    Menetapkan nilai yang dikembalikan hanya sekali pada pemanggilan pertama fungsi mock dalam bentuk rejected promise.

Jenis-jenis mock ini untuk mensimulasikan dan mengendalikan perilaku fungsi, metode, dan dependensi dalam pengujian unit untuk mengisolasi komponen yang diuji.