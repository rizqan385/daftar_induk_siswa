# 📋 PROPOSAL APLIKASI
# Sistem Informasi Manajemen Daftar Induk Siswa (SIMDIS)

---

## 🏫 Latar Belakang

Pengelolaan data siswa di sekolah menengah atas/kejuruan (SMA/SMK) umumnya masih dilakukan secara manual menggunakan buku induk fisik atau dokumen spreadsheet yang tersebar dan tidak terintegrasi. Kondisi ini menyebabkan berbagai permasalahan, antara lain:

- **Sulitnya pencarian data** siswa secara cepat dan akurat
- **Risiko kehilangan data** akibat kerusakan fisik dokumen
- **Redudansi data** karena tidak ada satu sumber data tunggal (*single source of truth*)
- **Lambatnya pembuatan laporan** yang membutuhkan rekap manual dari berbagai sumber
- **Tidak adanya jejak audit** (audit trail) ketika data diubah atau dihapus

Untuk menjawab permasalahan tersebut, dikembangkanlah **Sistem Informasi Manajemen Daftar Induk Siswa (SIMDIS)** — sebuah platform digital berbasis web yang terintegrasi, aman, dan mudah digunakan oleh tenaga kependidikan.

---

## 🎯 Tujuan Aplikasi

1. Mendigitalisasi dan memusatkan seluruh data induk siswa dalam satu sistem yang aman.
2. Mempermudah pengelolaan data akademik, kesehatan, kepribadian, dan prestasi siswa.
3. Menghasilkan laporan dan dokumen cetak secara otomatis dan cepat.
4. Memberikan kemudahan akses informasi bagi pihak sekolah kapan saja dan di mana saja.
5. Menjamin keamanan data melalui sistem autentikasi berbasis token (JWT).

---

## 🧩 Deskripsi Aplikasi

**SIMDIS** adalah aplikasi web *full-stack* yang terdiri dari:

| Komponen | Teknologi |
|---|---|
| **Backend** | Go (Golang), Gin Framework, GORM |
| **Frontend** | React (TypeScript), Vite |
| **Database** | MySQL / MariaDB |
| **Autentikasi** | JSON Web Token (JWT) |
| **Dokumentasi API** | Swagger UI |

Aplikasi ini dirancang dengan arsitektur **RESTful API** yang memisahkan antara *backend* (server) dan *frontend* (antarmuka pengguna), sehingga memudahkan pengembangan dan pemeliharaan di masa mendatang.

---

## 👥 Pengguna Sistem

Sistem ini dirancang untuk digunakan oleh:

- **Admin / Tata Usaha Sekolah** — Mengelola seluruh data siswa, akademik, dan laporan.
- **Wali Kelas** — Menginput nilai rapor, catatan semester, dan data kehadiran siswa.
- **Kepala Sekolah** *(akses baca)* — Memantau data rekap dan laporan siswa.

---

## 🚀 Fitur-Fitur Utama Aplikasi

### 1. 🔐 Manajemen Autentikasi & Keamanan

- **Login Admin** dengan username dan password yang terenkripsi (bcrypt).
- Sistem keamanan berbasis **JWT (JSON Web Token)** — setiap request API dilindungi token.
- **Rate Limiting** untuk mencegah serangan brute-force.
- **Activity Log / Audit Trail** — Setiap perubahan data dicatat beserta informasi pengguna, waktu, dan IP address.
- Auto-pembuatan akun admin default saat pertama kali aplikasi dijalankan.

---

### 2. 📊 Dashboard Ringkasan

- Menampilkan **statistik umum** jumlah total siswa, siswa aktif, siswa lulus, dan siswa pindah.
- Ringkasan data terkini yang dapat dipantau sekilas oleh admin.

---

### 3. 👨‍🎓 Manajemen Data Siswa

Modul inti yang mencakup pengelolaan lengkap profil setiap siswa:

| Sub-Fitur | Keterangan |
|---|---|
| **Daftar Siswa** | Tabel seluruh siswa dengan fitur pencarian (nama, NISN, No. Induk) dan paginasi |
| **Tambah Siswa Baru** | Form pendaftaran siswa baru secara digital |
| **Edit Data Siswa** | Pembaruan data kapan saja dengan mudah |
| **Hapus Siswa** | *Soft delete* — data tidak benar-benar hilang dari sistem |
| **Upload Foto Profil** | Setiap siswa dapat memiliki foto yang tersimpan di server |
| **Filter & Pencarian** | Cari siswa berdasarkan nama, NISN, atau nomor induk secara real-time |
| **Filter per Kelas** | Tampilkan siswa berdasarkan kelas yang dipilih |

**Data yang dikelola per siswa:**
- Nomor Induk & NISN
- Nama lengkap & nama panggilan
- Jenis kelamin, tempat/tanggal lahir, agama
- Kewarganegaraan & bahasa di rumah
- Anak ke-berapa & jumlah saudara
- Status siswa: `Aktif`, `Lulus`, `Pindah`, `Tinggal Kelas`
- Kelas yang sedang ditempuh

---

### 4. 📑 Detail Siswa (10 Tab Lengkap)

Setiap profil siswa memiliki 10 tab data yang terorganisir:

#### Tab 1 — 🪪 Identitas
Data diri lengkap siswa beserta informasi keluarga:
- **Data Siswa**: Biodata, foto, status, kelas
- **Data Ayah**: Nama, TTL, pekerjaan, penghasilan, pendidikan, alamat, no. telepon, status hidup
- **Data Ibu**: Sama seperti data ayah
- **Data Wali** *(opsional)*: Nama wali, hubungan, pekerjaan, penghasilan, alamat, no. telepon

#### Tab 2 — 🏠 Alamat & Transportasi
- Alamat lengkap (jalan, kelurahan, kecamatan, kota, provinsi, kode pos)
- No. telepon rumah
- Keterangan tinggal bersama siapa
- Jarak ke sekolah (km)
- Moda transportasi yang digunakan

#### Tab 3 — ❤️ Kesehatan
- Berat badan & tinggi badan (saat masuk & keluar sekolah)
- Golongan darah
- Kesanggupan jasmani / keterangan fisik
- **Riwayat penyakit**: Nama penyakit, tahun sakit, lama sakit, keterangan

#### Tab 4 — 🎓 Pendidikan Sebelumnya
- Tipe penerimaan: `Siswa Baru` atau `Pindahan`
- Tanggal diterima & kelas diterima
- Nama & alamat sekolah asal
- No. Ijazah SMP/MTs & tanggal ijazah
- No. SKHUN & tanggalnya
- Alasan pindah *(untuk siswa pindahan)*

#### Tab 5 — 📝 Akademik (Nilai Rapor)
Input dan tampilan nilai untuk **6 semester** (Kelas X s.d. XII):
- **Nilai Pengetahuan**: Angka + Predikat (A/B/C/D) + Deskripsi
- **Nilai Keterampilan**: Angka + Predikat (A/B/C/D) + Deskripsi
- **Nilai Sikap**: Deskripsi spiritual & deskripsi sosial per semester
- **Nilai Ijazah SMK** (khusus Semester 6): Nilai akhir kelulusan per mata pelajaran
- **Kehadiran per Semester**: Jumlah hadir, sakit, izin, alpa, dan persentase kehadiran

#### Tab 6 — 📒 Catatan Semester
Catatan tambahan dari wali kelas setiap semester:
- Catatan naratif wali kelas
- Daftar kegiatan **Ekstrakurikuler** beserta nilai/predikat per semester
- Data **PKL (Praktik Kerja Lapangan)**: Nama DUDI, lokasi, durasi
- Prestasi yang diraih per semester

#### Tab 7 — 🌟 Kepribadian
Penilaian karakter dan perilaku siswa per tahun pelajaran:
- Aspek kepribadian (contoh: Kedisiplinan, Kebersihan, dll.)
- Nilai: `Baik`, `Cukup`, atau `Kurang`

#### Tab 8 — 📈 Perkembangan
Ringkasan perkembangan siswa dari kelas X hingga XII yang mencakup data nilai, kehadiran, dan catatan per semester secara terkonsolidasi.

#### Tab 9 — 📚 Pemeriksaan Buku
Riwayat pemeriksaan buku induk oleh petugas:
- No. urut pemeriksaan
- Tanggal periksa
- Nama & jabatan pemeriksa
- Catatan petugas

#### Tab 10 — 🚪 Meninggalkan Sekolah
Data ketika siswa meninggalkan sekolah:
- Tipe: `Tamat`, `Pindah`, atau `Putus Sekolah`
- Tanggal keluar
- Sekolah/instansi tujuan & alamatnya
- No. ijazah (jika tamat)
- Alasan & tujuan

---

### 5. 📚 Manajemen Akademik

#### 5.1 Mata Pelajaran
- Tambah, edit, dan hapus mata pelajaran
- Informasi: Kode mapel, nama, kelompok (A/B/C), sub-kelompok
- **Target kelas** — mapel dapat dikonfigurasi untuk kelas tertentu atau semua kelas
- Status aktif/nonaktif mapel

#### 5.2 Input Nilai Rapor (Modul Tersendiri)
Halaman khusus untuk input nilai secara massal:
- Filter siswa berdasarkan kelas
- Pilih semester (1-6)
- Input nilai pengetahuan, predikat, deskripsi, keterampilan per mapel
- Input nilai ijazah SMK (otomatis muncul saat Semester 6 dipilih)
- Simpan semua nilai dalam satu klik

---

### 6. 🎭 Manajemen Kesiswaan

#### 6.1 Data Prestasi
- Catat prestasi siswa di berbagai bidang:
  - Kesenian, Olahraga, Kemasyarakatan, Pramuka, Karya Tulis, Lainnya
- Informasi: Nama prestasi, tingkat (Sekolah hingga Internasional), tahun
- CRUD lengkap (tambah, edit, hapus)

#### 6.2 Data Beasiswa
- Catat penerima beasiswa per siswa
- Informasi: Pemberi beasiswa, tahun pelajaran, keterangan
- CRUD lengkap

#### 6.3 Kegiatan Ekstrakurikuler
- Catat keanggotaan ekskul setiap siswa
- Informasi: Nama kegiatan, keterangan/status
- CRUD lengkap

#### 6.4 PKL (Praktik Kerja Lapangan)
- Data tempat PKL setiap siswa
- Informasi: Nama DUDI, lokasi, durasi (bulan), keterangan
- Filter berdasarkan kelas & semester

---

### 7. 🖨️ Cetak Laporan

Fitur mencetak data siswa ke format yang siap cetak (print-friendly):
- **Cetak Biodata Lengkap** — Seluruh identitas siswa, orang tua, dan wali
- **Cetak Rekap Nilai** — Nilai rapor semua semester dalam format tabel
- **Cetak Riwayat Kesehatan**
- **Cetak Data Kesiswaan** — Prestasi, ekstrakurikuler, beasiswa
- Tampilan cetak dioptimasi secara khusus agar rapi saat dicetak (`@media print`)

---

### 8. 🏫 Manajemen Kelas

- Tambah dan kelola data kelas (Kelas X, XI, XII beserta jurusan)
- Informasi: Nama kelas, tingkat, jurusan, tahun pelajaran, nama wali kelas
- Siswa dapat ditempatkan ke kelas tertentu
- Histori kenaikan kelas siswa (*KenaikanKelas*)

---

### 9. 📋 Activity Log

- Sistem mencatat **seluruh aktivitas** yang dilakukan pengguna:
  - Tindakan: CREATE, UPDATE, DELETE
  - Entitas yang diubah (contoh: "siswa", "nilai_semester")
  - ID entitas, deskripsi perubahan, IP address, waktu
- Berguna untuk audit dan penelusuran riwayat perubahan data

---

## 🔌 Arsitektur API

Aplikasi ini menggunakan REST API dengan konvensi:

```
BASE URL: http://localhost:8080/api/v1/
```

### Endpoint Utama

| Method | Endpoint | Keterangan |
|---|---|---|
| `POST` | `/auth/login` | Login admin |
| `GET` | `/siswa` | Daftar semua siswa (+ paginasi & search) |
| `POST` | `/siswa` | Tambah siswa baru (+ upload foto) |
| `GET` | `/siswa/:id` | Detail lengkap satu siswa (semua relasi) |
| `PUT` | `/siswa/:id` | Update data siswa |
| `DELETE` | `/siswa/:id` | Hapus siswa (soft delete) |
| `GET/POST/PUT/DELETE` | `/siswa/:id/nilai-semester` | Nilai rapor |
| `GET/POST/PUT/DELETE` | `/siswa/:id/kehadiran` | Data kehadiran |
| `GET/POST/PUT/DELETE` | `/siswa/:id/prestasi` | Data prestasi |
| `GET/POST/PUT/DELETE` | `/siswa/:id/beasiswa` | Data beasiswa |
| `GET/POST/PUT/DELETE` | `/siswa/:id/kepribadian` | Nilai kepribadian |
| `GET/POST/PUT/DELETE` | `/siswa/:id/kesehatan` | Data kesehatan |
| `GET/POST/PUT/DELETE` | `/siswa/:id/pendidikan-sebelumnya` | Pendidikan sebelumnya |
| `GET/POST/PUT/DELETE` | `/mata-pelajaran` | Manajemen mata pelajaran |
| `GET/POST/PUT/DELETE` | `/kelas` | Manajemen kelas |
| `GET/POST/PUT/DELETE` | `/keanggotaan-ekskul` | Keanggotaan ekstrakurikuler |
| `GET` | `/dashboard` | Statistik ringkasan |
| `GET` | `/activity-log` | Log aktivitas |

### Fitur Teknis API
- ✅ **Paginasi** — Parameter `page` & `page_size`
- ✅ **Pencarian** — Parameter `search`
- ✅ **Filter** — Parameter `kelas`, `semester`, dll.
- ✅ **Gzip Compression** — Response dikompres otomatis
- ✅ **CORS** — Mendukung akses dari domain frontend yang berbeda
- ✅ **Swagger UI** — Dokumentasi interaktif di `/swagger/index.html`

---

## 🗃️ Struktur Database

Sistem menggunakan **18+ tabel** yang saling berelasi:

```
siswa (tabel utama)
├── alamat_siswa
├── orang_tua (ayah & ibu)
├── wali
├── kesehatan_siswa
│   └── riwayat_penyakit
├── pendidikan_sebelumnya
├── kepribadian
├── prestasi
├── beasiswa
├── kehadiran
├── nilai_semester → mata_pelajaran
├── nilai_sikap
├── catatan_akhir_semester
│   ├── praktik_kerja_lapangan
│   ├── ekstrakurikuler
│   ├── prestasi_semester
│   └── ketidakhadiran_catatan
├── nilai_ijazah → mata_pelajaran
├── meninggalkan_sekolah
├── keanggotaan_ekskul
└── kelas (kelas_id → kelas)

mata_pelajaran (referensi nilai)
kelas (referensi penempatan siswa)
users (akun admin)
activity_logs (audit trail)
kenaikan_kelas (histori kenaikan)
```

---

## 💻 Tampilan Antarmuka (Frontend)

Antarmuka aplikasi dibangun menggunakan **React + TypeScript** dengan desain modern:

- **Layout**: Sidebar navigasi tetap + Navbar atas + Area konten utama
- **Design System**: Dark/Light mode, warna ungu sebagai aksen utama, tipografi Inter
- **Komponen**: Tabel data dengan hover effect, form dengan validasi, modal konfirmasi
- **Responsif**: Layout menyesuaikan ukuran layar

### Halaman yang Tersedia

| Halaman | Path | Keterangan |
|---|---|---|
| Login | `/login` | Halaman masuk admin |
| Dashboard | `/dashboard` | Ringkasan statistik |
| Daftar Siswa | `/siswa` | Tabel semua siswa |
| Detail Siswa | `/siswa/:id` | 10 tab data siswa |
| Cetak Laporan | `/siswa/:id/cetak` | Pratinjau cetak |
| Mata Pelajaran | `/akademik/mata-pelajaran` | Kelola mapel |
| Input Nilai | `/akademik/input-nilai` | Input nilai massal |
| Prestasi | `/kesiswaan/prestasi` | Kelola prestasi |
| Beasiswa | `/kesiswaan/beasiswa` | Kelola beasiswa |
| Ekstrakurikuler | `/kesiswaan/ekstrakurikuler` | Kelola ekskul |
| PKL | `/kesiswaan/pkl` | Kelola data PKL |

---

## 🛠 Persyaratan Sistem

### Server / Backend
- **OS**: Linux / Windows
- **Runtime**: Go 1.21+
- **Database**: MySQL 8.0+ atau MariaDB
- **RAM**: Minimal 512 MB
- **Storage**: Minimal 2 GB (termasuk foto profil siswa)

### Client / Browser
- Browser modern (Chrome, Firefox, Edge versi terbaru)
- Koneksi internet / jaringan lokal ke server

---

## 📦 Instalasi Singkat

```bash
# 1. Clone repository
git clone <url-repository>

# 2. Setup database MySQL
CREATE DATABASE db_siswa_induk_api;

# 3. Konfigurasi environment backend
cp .env.example .env
# Edit DB_HOST, DB_USER, DB_PASSWORD, JWT_SECRET

# 4. Jalankan backend
cd backend
go mod tidy
make run   # atau: go run cmd/server/main.go

# 5. Jalankan frontend
cd frontend
npm install
npm run dev
```

Akun admin default:
- **Username**: `admin`
- **Password**: `admin123`

---

## 🧪 Testing & Dokumentasi

- **Postman Collection**: File `api_siswa_postman_collection.json` tersedia di root proyek
- **Swagger UI**: Akses dokumentasi interaktif di `http://localhost:8080/swagger/index.html`
- **Error Log**: Sistem mencatat error di file `backend/error.log`

---

## 📈 Rencana Pengembangan (Future Development)

| Fitur | Prioritas | Keterangan |
|---|---|---|
| Multi-role user | Tinggi | Pemisahan akses admin, wali kelas, kepala sekolah |
| Export Excel/PDF | Tinggi | Export data ke format spreadsheet dan PDF |
| Notifikasi sistem | Sedang | Notifikasi untuk data yang belum lengkap |
| Pencarian lanjutan | Sedang | Filter berdasarkan tahun masuk, status, jurusan |
| Backup otomatis | Sedang | Backup database terjadwal |
| Aplikasi mobile | Rendah | Versi mobile untuk akses cepat |

---

## 📝 Kesimpulan

**SIMDIS (Sistem Informasi Manajemen Daftar Induk Siswa)** adalah solusi digital komprehensif yang dirancang khusus untuk memenuhi kebutuhan pengelolaan data siswa di lingkungan SMA/SMK. Dengan fitur yang lengkap mulai dari biodata, kesehatan, akademik, hingga kesiswaan — serta didukung arsitektur modern yang aman dan skalabel — aplikasi ini siap membantu sekolah dalam mewujudkan administrasi yang lebih efisien, akurat, dan modern.

---

*Dokumen ini dibuat sebagai bahan proposal pengembangan Sistem Informasi Manajemen Daftar Induk Siswa.*

*Versi: 1.0 | Tanggal: Mei 2026*
