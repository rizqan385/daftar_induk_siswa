# Frontend - Sistem Data Induk Siswa

Aplikasi frontend untuk **Sistem Manajemen Data Induk Siswa**, dibangun menggunakan **React**, **TypeScript**, dan **Vite**. Aplikasi ini dirancang untuk memudahkan tenaga pendidik dan admin sekolah dalam menyimpan, mengelola, dan melacak perkembangan siswa secara digital.

## 🚀 Fitur Utama

Sistem ini memiliki berbagai fitur lengkap, dengan update dan pengembangan terbaru yang mencakup hal-hal berikut:

### 1. 🖨️ Cetak Laporan (Print-Ready A4 Format) - *[Fitur Terbaru]*
Fitur ini dipanggil dari laman Detail Siswa untuk mengglorifikasi data digital menjadi dokumen fisik yang rapi:
- **Cetak Keterangan Tentang Diri Peserta Didik**: Mencetak lembar identitas awal siswa (biasanya diletakan di halaman depan Rapor). Jika siswa telah memiliki pas foto yang di-_upload_ pada sistem, foto tersebut akan otomatis tersemat pada _box_ Pas Foto dokumen cetak.
- **Cetak Laporan Hasil Belajar (Rapor Semester)**: Mencetak lembaran nilai, catatan ekstrakurikuler, serta tabel absensi untuk semester tertentu.
  - **Dynamic Class Detection**: Fitur ini cerdas—secara otomatis mendeteksi keterangan Kelas untuk dicetak (Semester 1-2 = Kelas X, Semester 3-4 = Kelas XI, Semester 5-6 = Kelas XII).
  - **Customizable Footer**: Sebelum di-print, pengguna dapat memasukan tempat cetak, menetapkan tanggal, dan memasukan Nama/NIP Kepala Sekolah & Wali Kelas untuk dicetak sebagai peletakan tanda tangan.
  - **CSS \`@media print\`**: Desain HTML dan CSS murni yang telah dikemas khusus agar ketika dokumen dipanggil metode `window.print()` / `Ctrl+P`, output di kertas A4 menjadi presisi dan tidak _overlap_.

### 2. Manajemen Data Siswa Terpadu
- **CRUD Siswa Lengkap**: Input dan kelola informasi yang berkaitan dengan siswa; Data Identitas, Alamat, Orang Tua/Wali, Riwayat Kesehatan, hingga Asal Sekolah.
- **Upload Foto**: Integrasi multipart upload untuk menambahkan visual profile siswa.
- **Import Data via Excel**: Kemampuan sakti untuk _onboard_ ratusan dan ribuan data siswa baru cukup dengan mengunduh template `.xlsx`, mengisinya, lalu meng-_upload_-nya ke sistem.

### 3. Modul Akademik & Evaluasi
- **Manajemen Nilai**: Merekam rekam jejak akademik! Memungkinkan form pencatatan Nilai Pengetahuan & Keterampilan per setiap mata pelajaran yang ada di setiap semester (Semester 1 sampai Semester 6).
- **Catatan Wali Kelas**: Terintegrasi form untuk absensi (Sakit, Izin, Alpha) yang terikat langsung di rapor, serta pergerakan prestasi dan ekstrakurikuler.

### 4. 📝 Log Aktivitas (Riwayat Perubahan)
Setiap ada CRUD yang berdampak langsung pada database (cth: User 'A' membaharui data Nilai si 'B'), sistem ini kini melacak aksi-aksi tersebut! Fitur Log Aktivitas dapat digunakan layaknya audit _trail_ untuk melihat _history_ pengerjaan sistem oleh user-user terkait.

### 5. Keamanan & Autentikasi
- **JWT Auth & Protected Routes**: Hanya staff/user terautentikasi yang bisa menembus masuk ke portal Dashboard dan merubah data.
- **Role-Based Experience**: Memisahkan kendali mutlak Admin dengan scope akses untuk User.

---

## 🛠 Teknologi yang Digunakan
- **Framework Utama**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Routing**: React Router DOM (v6)
- **Styling**: Vanilla CSS / Modular CSS
- **API Request**: Axios
- **Icons**: Lucide React

---

## 💻 Cara Menjalankan di Development Lokal

### 1. Install Dependencies
Pastikan Node.js ter-install, lalu jalankan perintah ini di dalam folder `frontend`:
```bash
npm install
```

### 2. Konfigurasi Environment Endpoint
Rename atau berikan file `.env`, lalu pastikan target API backend sesuai dengan _port_ backend Go Anda:
```env
VITE_API_URL=http://localhost:8080/api/v1
```

### 3. Start Development Server
```bash
npm run dev
```
Buka akses project ini secara default di `http://localhost:5173`.

### 4. Building The App (Production)
```bash
npm run build
```

---
*Dibuat dan dipelihara khusus untuk Sistem Data Induk Siswa - 2026.*
