# API Sistem Data Induk Siswa (Backend)

Backend API untuk sistem manajemen data induk siswa, dibangun menggunakan **Go (Golang)**, **Gin Framework**, dan **GORM**. Sistem ini menyediakan layanan RESTful API untuk mengelola data siswa, nilai akademik, rekam medis, hingga prestasi.

> 📚 **Dokumentasi Lengkap:**
> - [Panduan Frontend (API Guide)](FRONTEND_API_GUIDE.md) - Khusus untuk tim Frontend.
> - [Panduan Instalasi & Deployment](INSTALLATION.md) - Setup, VPS, & Kustomisasi.

---

## 📋 Daftar Isi
1. [Fitur Utama](#-fitur-utama)
2. [Persyaratan Sistem](#-persyaratan-sistem)
3. [Instalasi & Setup](#-instalasi--setup)
4. [Konfigurasi Environment](#-konfigurasi-environment)
5. [Panduan Integrasi Frontend](#-panduan-integrasi-frontend)
    - [Autentikasi](#1-autentikasi)
    - [Format Response](#2-format-response-standar)
    - [Pagination & Search](#3-pagination--search)
6. [Modul Data](#-modul-data-tersedia)
7. [Testing](#-testing)

---

## 🚀 Fitur Utama

- **Otorisasi Admin**: Sistem login menggunakan JWT (JSON Web Token).
- **Manajemen Siswa**: CRUD lengkap dengan foto profil.
- **Data Detail**: Orang Tua, Wali, Riwayat Kesehatan, Pendidikan Sebelumnya.
- **Akademik**: Input Nilai Semester, Kehadiran, Catatan Wali Kelas, Nilai Ijazah.
- **Ekstrakurikuler**: Catatan prestasi, beasiswa, dan kepribadian.
- **Optimasi**: Kompresi Gzip, Rate Limiting, dan Pagination.

---

## 💻 Persyaratan Sistem

Pastikan environment Anda memiliki:
- **Go**: Versi 1.21 ke atas.
- **Database**: MariaDB atau MySQL (Versi 8.0+ direkomendasikan).
- **Git**: Untuk cloning repository.

---

## 🛠 Instalasi & Setup

Ikuti langkah ini untuk menjalankan server di lokal:

### 1. Clone Repository
```bash
git clone https://daftar_induk_siswa.git
cd api-siswa
```

### 2. Setup Database
Buat database baru di MySQL/MariaDB Anda:
```sql
CREATE DATABASE db_siswa_induk_api;
```
*Note: Tabel akan otomatis dibuat (Auto-Migrate) saat aplikasi pertama kali dijalankan.*

### 3. Konfigurasi Environment
Salin file contoh `.env` dan sesuaikan dengan setting lokal Anda:
```bash
cp .env.example .env
```
Edit file `.env`:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password_database_anda
DB_NAME=db_siswa_induk_api
JWT_SECRET=rahasia_super_aman
```

### 4. Install Dependencies
```bash
go mod tidy
```

### 5. Jalankan Server
Menggunakan perintah Go langsung:
```bash
go run cmd/server/main.go
```
Atau jika menggunakan Makefile:
```bash
make run
```

Server akan berjalan di `http://localhost:8080`.

> **Info Login Default:**
> Saat pertama kali dijalankan, sistem akan membuat user admin otomatis:
> - **Username**: `admin`
> - **Password**: `admin123`

---

## 🔌 Panduan Integrasi Frontend

Bagian ini penting untuk tim Frontend yang akan mengonsumsi API.

### 1. Autentikasi
Semua endpoint (kecuali Login) dilindungi oleh **JWT**. Frontend wajib menyertakan token di setiap request header.

- **Header Key**: `Authorization`
- **Header Value**: `Bearer <token_anda>`

**Flow Login:**
1.  POST ke `/api/v1/auth/login` dengan `username` & `password`.
2.  Ambil `token` dari response JSON (`data.token`).
3.  Simpan token (Local Storage / Cookie).
4.  Gunakan token tersebut untuk request selanjutnya.

### 2. Format Response Standar
API selalu mengembalikan response JSON dengan struktur konsisten:

**Sukses (200/201):**
```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": { ... } // Object atau Array
}
```

**Gagal (400/401/404/500):**
```json
{
  "success": false,
  "message": "Pesan error yang bisa ditampilkan ke user",
  "data": null
}
```

### 3. Pagination & Search
Endpoint List (seperti `GET /api/v1/siswa`) mendukung parameter query:

| Parameter | Default | Deskripsi |
|-----------|---------|-----------|
| `page` | 1 | Halaman ke-berapa |
| `page_size` | 10 | Jumlah item per halaman |
| `search` | - | Cari berdasarkan Nama, NISN, atau No Induk |

**Contoh Request:**
`GET /api/v1/siswa?page=1&page_size=20&search=budi`

**Contoh Response Pagination:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_records": 50,
    "page_size": 20
  }
}
```

---

## 📦 Modul Data Tersedia

Berikut adalah data-data yang bisa dikelola oleh Frontend:

### A. Data Utama
- **Profil Siswa**: `/api/v1/siswa` (Termasuk upload foto)
- **Data Orang Tua**: Ayah & Ibu (`/orang-tua`)
- **Data Wali**: Opsional (`/wali`)
- **Alamat**: Terintegrasi di detail siswa

### B. Detail Pribadi
- **Kesehatan**: Berat/Tinggi badan, Golongan darah, Riwayat Penyakit.
- **Pendidikan Sebelumnya**: Asal sekolah, No Ijazah SMP/Mts.
- **Kepribadian**: Penilaian perilaku/karakter.

### C. Akademik & Prestasi
- **Nilai Semester**: Input nilai per Mapel. Mendukung 6 semester:
    - Kelas X (Semester 1 & 2)
    - Kelas XI (Semester 1 & 2)
    - Kelas XII (Semester 1 & 2)
    - *Frontend bisa memfilter berdasarkan query `?kelas=X&semester=1`.*
- **Kehadiran**: Sakit, Izin, Alpa per semester.
- **Catatan Semester**: PKL, Ekstrakurikuler.
- **Prestasi & Beasiswa**: Pencatatan penghargaan.
- **Nilai Ijazah**: Nilai akhir kelulusan.

### D. Referensi
- **Mata Pelajaran**: List semua mapel aktif untuk dropdown input nilai.

---

## 🧪 Testing

### Menggunakan Postman
Kami menyediakan file koleksi Postman lengkap untuk testing tanpa coding.

1.  Download file: `api_siswa_postman_collection.json` (ada di root folder).
2.  Import ke aplikasi Postman.
3.  Jalankan request **Auth > Login** terlebih dahulu.
4.  Script otomatis akan menyimpan Token, jadi Anda bisa langsung coba request lain.

### Swagger UI
Dokumentasi interaktif juga tersedia saat server berjalan:
- URL: `http://localhost:8080/swagger/index.html`

### Struktur Data Nilai (Semester 1-6)
Sistem ini menggunakan pendekatan dinamis. Nilai tidak disimpan dalam kolom `semester_1`, `semester_2`, dst, melainkan sebagai baris data (rows) dengan penanda:
- `kelas`: ENUM ('X', 'XI', 'XII')
- `semester`: INT (1 atau 2)

**Contoh Response JSON:**
```json
[
  {
    "mata_pelajaran": "Matematika",
    "kelas": "X",
    "semester": 1,
    "nilai_pengetahuan": 85
  },
  {
    "mata_pelajaran": "Matematika",
    "kelas": "X",
    "semester": 2,
    "nilai_pengetahuan": 88
  }
]
```
Frontend cukup melakukan filter atau grouping data ini untuk menampilkannya dalam format rapor 6 semester.


---

## 📝 Troubleshooting

- **Error "Authorization header is required"**:
  Pastikan Anda sudah Login dan menyertakan Header `Authorization: Bearer <token>`.
- **Login Gagal Terus**:
  Restart server. Sistem akan otomatis mereset password admin ke `admin123`.

---
*Created for API Siswa Induk Project.*
