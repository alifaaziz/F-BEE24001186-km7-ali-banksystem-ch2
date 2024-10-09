# Basic Banking System Challenge
[STUDI INDEPENDEN BINAR ACADEMY-BACKEND JAVASCRIPT]

## Run Javascript Challange 2
### Deskripsi
Basic Banking System adalah aplikasi sederhana yang menggunakan konsep Pemrograman Berorientasi Objek (OOP) untuk melakukan operasi transaksi perbankan seperti deposit dan penarikan. Sistem ini mensimulasikan operasi transaksi yang asynchronous dan dilengkapi dengan fitur login menggunakan username dan password.

### Fitur
- Menyimpan saldo akun
- Melakukan deposit ke akun
- Melakukan penarikan dari akun dengan saldo minimal 50
- Sistem login menggunakan username dan password

### Prerequisites
- `Node.js` harus terinstal di komputer Anda.
- `NPM` (Node Package Manager) sudah terinstal bersama `Node.js`.

### Penggunaan
1. **Jalankan aplikasi:**
  ```bash
   node bank_system.js
  ```
2. **Ikuti instruksi di layar:**
   - Masukkan username dan password untuk login.
   - Pilih apakah ingin melakukan deposit atau penarikan.
   - Masukkan jumlah uang yang ingin disetor atau ditarik.
   - Sistem akan menginformasikan jika transaksi berhasil atau jika ada kesalahan.

### Contoh Input
**Login:**
  - Username: `binar123`
  - Password: `password123`

**Transaksi:**
  - Untuk deposit: `d`
  - Untuk withdraw: `w`
  - Masukkan jumlah uang yang valid.

### Flowchart
![challenge 2 binar drawio](https://github.com/user-attachments/assets/103280ac-c3d4-4ee2-8529-a7a33a011098)

### Catatan
  - Pastikan saldo minimal di akun Anda tidak kurang dari 50 sebelum melakukan penarikan.
  - Aplikasi ini menggunakan `prompt-sync` untuk input dari pengguna. Pastikan Anda telah menginstalnya jika Anda mengubah kode.

## Database Query Challange 3
### Deskripsi
Proyek ini menunjukkan sistem perbankan sederhana di mana nasabah dapat membuat akun, melakukan deposit, penarikan, memeriksa saldo, dan mengeluarkan bunga untuk akun investasi. Sistem ini dibangun menggunakan query SQL dan dirancang untuk mengelola nasabah, akun, dan transaksi secara efisien.

### Skema Basis Data
Basis data terdiri dari tiga tabel utama:
  - **Nasabah** (customers): Menyimpan detail nasabah.
  - **Akun (accounts)**: Mengelola akun nasabah (akun reguler dan investasi).
  - **Transaksi (transactions)**: Mencatat semua transaksi akun (deposit, penarikan, bunga).

### Gambaran Tabel
1. **customers**
  - `id_customer` (Primary Key)
  - `first_name` (Nama depan)
  - `last_name` (Nama belakang)
  
2. **accounts**
  - `id_account` (Primary Key)
  - `id_customer` (Foreign Key)
  - `account_type` (regular/invest)
  - `username`
  - `password`
  - `balance`
  - `created_at`
  - `updated_at`
  - `deleted_at` (untuk soft delete)

3. **transactions**
  - `id_transaction` (Primary Key)
  - `id_account` (Foreign Key)
  - `transaction_type` (deposit/withdraw/interest)
  - `amount`
  - `date` (Waktu terjadinya transaksi)

### Query
1. **Tambah Nasabah** (`add_customer.sql`)
  Menambahkan nasabah baru dan otomatis membuat akun terkait.

2. **Buat Akun** (`create_account.sql`)
  Membuat akun baru untuk nasabah yang sudah ada.

3. **Login** (`login.sql`)
  Memverifikasi login nasabah berdasarkan username dan password.

4. **Deposit** (`deposit.sql`)
  Menambah dana ke akun nasabah dan mencatat transaksi dalam tabel transactions.

5. **Withdraw** (`withdraw.sql`)
  Menarik dana dari akun nasabah, memastikan saldo mencukupi, dan mencatat transaksi.

6. **Cek Saldo** (`view_balance.sql`)
  Menampilkan saldo dari akun tertentu.

7. **Riwayat Transaksi** (`history_check.sql`)
  Menampilkan riwayat transaksi dari akun tertentu.

8. **Bunga Dikeluarkan** (`interest_issued`.sql)
  Mencatat bunga yang dikeluarkan untuk akun investasi.

9. **Tambah Bunga Otomatis** (`auto_interest.sql`)
  Menambahkan bunga secara otomatis ke semua akun investasi dan mencatatnya sebagai transaksi.

10. **Total Saldo Nasabah** (`total_customer_balance.sql`)
  Menghitung total saldo di semua akun milik nasabah tertentu.

11. **Hapus Akun** (`delete_account.sql`)
  Menghapus akun dan semua transaksi terkait dari sistem.

### Cara Penggunaan
1. **Persiapan Awal**
  Jalankan skrip SQL `create_insert.sql` di folder migrations untuk membuat tabel dan memasukkan data awal.

2. **Menambah Nasabah**
  Jalankan skrip SQL `add_customer.sql` untuk menambah nasabah baru beserta akun pertama mereka.

3. **Melakukan Transaksi**
  Gunakan `deposit.sql` untuk menambah dana ke akun dan `withdraw.sql` untuk menarik dana. Setiap transaksi akan tercatat otomatis di tabel transactions.

4. **Cek Saldo dan Riwayat**
  Gunakan `view_balance.sql` untuk melihat saldo akun dan `history_check.sql` untuk melihat riwayat transaksi.

5. **Mengeluarkan Bunga**
  Jalankan `auto_interest.sql` untuk secara otomatis menambah bunga pada semua akun investasi berdasarkan saldo mereka.

6. **Menghapus Akun**
  Untuk menghapus akun beserta semua transaksinya, gunakan skrip `delete_account.sql`.


## Penulis
Alif Abdul Aziz
