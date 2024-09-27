# Basic Banking System Challenge Chapter 2
[STUDI INDEPENDEN BINAR ACADEMY-BACKEND JAVASCRIPT]

## Deskripsi
Basic Banking System adalah aplikasi sederhana yang menggunakan konsep Pemrograman Berorientasi Objek (OOP) untuk melakukan operasi transaksi perbankan seperti deposit dan penarikan. Sistem ini mensimulasikan operasi transaksi yang asynchronous dan dilengkapi dengan fitur login menggunakan username dan password.

## Fitur
- Menyimpan saldo akun
- Melakukan deposit ke akun
- Melakukan penarikan dari akun dengan saldo minimal 50
- Sistem login menggunakan username dan password

## Prerequisites
- `Node.js` harus terinstal di komputer Anda.
- `NPM` (Node Package Manager) sudah terinstal bersama `Node.js`.

## Penggunaan
1. **Jalankan aplikasi:**
  ```bash
   node bank_system.js
  ```
2. **Ikuti instruksi di layar:**
   - Masukkan username dan password untuk login.
   - Pilih apakah ingin melakukan deposit atau penarikan.
   - Masukkan jumlah uang yang ingin disetor atau ditarik.
   - Sistem akan menginformasikan jika transaksi berhasil atau jika ada kesalahan.

## Contoh Input
**Login:**
  - Username: `binar123`
  - Password: `password123`

**Transaksi:**
  - Untuk deposit: `d`
  - Untuk withdraw: `w`
  - Masukkan jumlah uang yang valid.

## Flowchart
![challenge 2 binar drawio](https://github.com/user-attachments/assets/103280ac-c3d4-4ee2-8529-a7a33a011098)

## Catatan
  - Pastikan saldo minimal di akun Anda tidak kurang dari 50 sebelum melakukan penarikan.
  - Aplikasi ini menggunakan `prompt-sync` untuk input dari pengguna. Pastikan Anda telah menginstalnya jika Anda mengubah kode.

## Penulis
Alif Abdul Aziz
