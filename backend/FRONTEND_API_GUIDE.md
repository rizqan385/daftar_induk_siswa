# 📚 Panduan Integrasi API - Sistem Data Induk Siswa (SISDU)

## 🛠️ Informasi Dasar
- **Base URL**: `http://localhost:8080/api/v1`
- **Tipe Konten**: `application/json`
- **Keamanan**: `Bearer Token` (Header `Authorization`)

---

## 📑 Daftar Isi
1. [Autentikasi](#1-autentikasi)
2. [Modul Siswa (CRUD)](#2-modul-siswa-crud)
3. [Data Detail Siswa](#3-data-detail-siswa)
4. [Akademik & Nilai](#4-akademik--nilai)
5. [Contoh Implementasi Frontend (FE)](#-contoh-implementasi-frontend-fe)
6. [Troubleshooting & Testing](#-troubleshooting--testing)

---

## 1. Autentikasi
Semua request (kecuali Login) wajib menyertakan token.

| Fitur | Method | Endpoint | Payload | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| **Login** | `POST` | `/auth/login` | `username`, `password` | Mendapatkan token JWT. |
| **Register** | `POST` | `/auth/register` | `username`, `email`, `password` | Menambah admin baru. |
| **Profil** | `GET` | `/auth/profile` | - | Cek user yang sedang login. |

---

## 2. Modul Siswa (CRUD)
Menu utama untuk mengelola data dasar siswa.

| Fitur | Method | Endpoint | Keterangan |
| :--- | :--- | :--- | :--- |
| **List Siswa** | `GET` | `/siswa` | Kompatibel dengan `page`, `page_size`, `search`. |
| **Tambah Siswa** | `POST` | `/siswa` | Input data diri dasar (NISN, Nama, dll). |
| **Detail Siswa** | `GET` | `/siswa/:id` | Ambil profil lengkap (termasuk foto/alamat). |
| **Update Siswa** | `PUT` | `/siswa/:id` | Hanya kirim yang ingin diubah. |
| **Hapus Siswa** | `DELETE` | `/siswa/:id` | Soft Delete. |
| **Upload Foto** | `POST` | `/siswa/:id/foto` | Multipart key: `foto`. |

---

## 3. Data Detail Siswa (Internal Tabs)
Gunakan endpoint ini untuk mengisi form di dalam Tab detail siswa.

| Kategori | Method | Endpoint | Payload Utama |
| :--- | :--- | :--- | :--- |
| **Orang Tua** | `POST` | `/siswa/:id/orang-tua` | `tipe` (ayah/ibu), `nama`, `pekerjaan` |
| **Wali** | `POST` | `/siswa/:id/wali` | `nama`, `hubungan_dengan_siswa` |
| **Kesehatan** | `POST` | `/siswa/:id/kesehatan` | `golongan_darah`, `berat_badan_masuk` |
| **Riwayat Sakit**| `POST` | `/kesehatan/:id/riwayat-penyakit`| `jenis_penyakit`, `tahun` |
| **Pendidikan** | `POST` | `/siswa/:id/pendidikan` | `asal_sekolah`, `kelas_diterima` |
| **Tambahan** | `POST` | `/siswa/:id/kepribadian` | `aspek`, `nilai` (Baik/Cukup/Kurang) |
| **Prestasi** | `POST` | `/siswa/:id/prestasi` | `bidang`, `keterangan`, `tingkat` |
| **Beasiswa** | `POST` | `/siswa/:id/beasiswa` | `tahun_pelajaran`, `pemberi` |

---

## 4. Akademik & Nilai
| Fitur | Method | Endpoint | Keterangan |
| :--- | :--- | :--- | :--- |
| **Mata Pelajaran**| `GET` | `/mata-pelajaran` | Ambil referensi ID Mapel. |
| **Input Nilai** | `POST` | `/siswa/:id/nilai-semester` | Input satu mapel per request. |
| **Input Batch** | `POST` | `/siswa/:id/nilai-semester/batch` | Input banyak nilai sekaligus. |
| **Lihat Rapor** | `GET` | `/siswa/:id/nilai-semester` | Filter: `?kelas=X&semester=1`. |
| **Catatan Smtr** | `POST` | `/siswa/:id/catatan-semester` | Wadah untuk PKL/Ekskul. |
| **PKL/Ekskul** | `POST` | `/catatan-semester/:id/pkl` | Tambah detail kegiatan. |
| **Keluar/Lulus** | `POST` | `/siswa/:id/meninggalkan-sekolah`| Catatan siswa berhenti/lulus. |

---

## 🚀 Contoh Implementasi Frontend (FE)

### 1. Setup Axios & Auth
```javascript
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8080/api/v1' });

// Masukkan token otomatis ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### 2. Menampilkan Data Profil Siswa
```javascript
// Contoh memanggil data detail siswa untuk ditampilkan di UI
async function fetchProfilSiswa(siswaId) {
  try {
    const res = await api.get(`/siswa/${siswaId}`);
    const data = res.data.data;
    
    // Tampilkan ke UI:
    console.log("Nama:", data.nama_lengkap);
    console.log("NISN:", data.nisn);
    console.log("Alamat:", data.alamat?.alamat_lengkap || "Belum diisi");
  } catch (err) {
    alert("Gagal mengambil data siswa");
  }
}
```

### 3. Menampilkan Nilai Siswa (Rapor)
```javascript
// Menampilkan tabel nilai berdasarkan kelas dan semester
async function fetchRapor(siswaId, kelas, semester) {
  try {
    const res = await api.get(`/siswa/${siswaId}/nilai-semester`, {
      params: { kelas, semester }
    });
    
    const listNilai = res.data.data; // Array berisi objek nilai
    listNilai.forEach(n => {
      console.log(`Mapel: ${n.mata_pelajaran.nama} | Nilai: ${n.nilai_pengetahuan} (${n.predikat_pengetahuan})`);
    });
  } catch (err) {
    console.error("Gagal ambil rapor");
  }
}
```

### 4. Upload Foto (Multipart)
```javascript
async function uploadFoto(siswaId, file) {
  const formData = new FormData();
  formData.append('foto', file);
  
  return await api.post(`/siswa/${siswaId}/foto`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}
```

---

## 🧪 Troubleshooting & Testing

### Kode Status (HTTP Status)
- **200/201 Success**: Operasi berhasil.
- **400 Bad Request**: Validasi gagal (Cek field `message` & `errors`).
- **401 Unauthorized**: Token salah/expired. Harus Login ulang.
- **404 Not Found**: Data siswa/ID tidak ditemukan.
- **500 Server Error**: Masalah mendalam di Backend.


