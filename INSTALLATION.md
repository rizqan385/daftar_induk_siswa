# Panduan Instalasi Lengkap (API Siswa)

Dokumen ini berisi panduan lengkap untuk setup pengembangan, kustomisasi project, integrasi Frontend, hingga deployment ke server produksi.

---

## 1. Prasyarat Sistem
Sebelum memulai, pastikan perangkat Anda sudah terinstal:
- **Go** (Versi 1.24 atau lebih baru)
- **MariaDB** atau **MySQL**
- **Make** (Opsional, untuk mempermudah eksekusi command)
- **Git**

---

## 2. Instalasi Lokal & Setup Database

### Langkah 1: Clone Project
```bash
git clone <url-repository>
cd api-siswa
```

### Langkah 2: Konfigurasi Environment
Salin file `.env.example` menjadi `.env` dan sesuaikan konfigurasinya:
```bash
cp .env.example .env
```
Edit `.env`:
- Sesuaikan `DB_USER`, `DB_PASSWORD`, dan `DB_NAME`.
- Ubah `JWT_SECRET` dengan string acak yang kuat.

### Langkah 3: Setup Database
Buat database di MySQL/MariaDB:
```sql
CREATE DATABASE db_siswa_induk;
```
Impor skema database (jika ada file SQL di `database/migrations/`):
```bash
mysql -u root -p db_siswa_induk < database/migrations/001_schema.sql
```

### Langkah 4: Menjalankan Aplikasi
**Menggunakan Go langsung:**
```bash
go mod download
go run cmd/server/main.go
```
**Menggunakan Makefile (Direkomendasikan):**
```bash
make deps    # Install dependensi
make run     # Menjalankan aplikasi
```

---

## 3. Penggabungan Folder Frontend (FE) & Backend (BE)

Jika Anda ingin menggabungkan folder Frontend dan Backend dalam satu repository (Monorepo), ada dua cara umum:

### Cara A: Struktur Folder Berdampingan (Direkomendasikan)
Buat struktur folder seperti ini:
```text
project-utama/
├── backend/       # (Isi folder api-siswa ini)
└── frontend/      # (Isi folder aplikasi React/Vue/Next.js Anda)
```

### Cara B: Frontend di dalam Backend
Jika ingin menaruh folder FE langsung di dalam root project Go:
```text
api-siswa/
├── cmd/
├── handlers/
├── ...
└── web-frontend/  # Folder project frontend Anda
```

### Cara Setup Integrasi FE-BE:
1.  **Base URL**: Di project Frontend, arahkan API Base URL ke `http://localhost:8080/api/v1` (sesuaikan port di `.env` backend).
2.  **CORS**: Pastikan Backend mengizinkan request dari port Frontend (biasanya port 3000 atau 5173). Cek di `middlewares/` jika ada pengaturan CORS.

---

## 4. Cara Ganti Nama Folder & Module Go

Jika Anda ingin mengganti nama project dari `api-siswa` menjadi nama lain (misal: `daftar_induk_siswa`):

### Langkah 1: Ganti Nama Folder Root
Ubah nama folder di File Explorer atau terminal:
```bash
mv api-siswa api-sekolah
cd api-sekolah
```

### Langkah 2: Ganti Nama Module di `go.mod`
Buka file `go.mod`, ubah baris pertama:
```go
// Dari:
module daftar_induk_siswa

// Menjadi:
module github.com/kampunk/api-sekolah
```

### Langkah 3: Update Seluruh Import (SANGAT PENTING)
Gunakan fitur **"Replace in Files"** di VS Code atau IDE Anda:
- **Search**: `daftar_induk_siswa`
- **Replace**: `github.com/kampunk/api-sekolah`

Atau menggunakan command `sed` di Linux/Mac:
```bash
grep -rl 'daftar_induk_siswa' . | xargs sed -i 's/github.com\/kampunk\/api-siswa/github.com\/kampunk\/daftar_induk_siswa/g'
```
Setelah itu jalankan:
```bash
go mod tidy
```

---

## 5. Setup Deployment ke Server (VPS)

Berikut langkah-langkah untuk mendeploy aplikasi ini ke server Linux (Ubuntu/Debian):

### Langkah 1: Compile Binary
Jangan jalankan `go run` di server. Compile menjadi binary untuk performa terbaik:
```bash
# Compile untuk Linux 64-bit
GOOS=linux GOARCH=amd64 go build -o bin/api-siswa cmd/server/main.go
```

### Langkah 2: Pindahkan ke Server
Gunakan `scp` atau Git untuk memindahkan folder project dan file binary ke VPS.

### Langkah 3: Setup Systemd (Auto-Restart)
Buat file service agar aplikasi berjalan otomatis di background dan restart jika crash:
```bash
sudo nano /etc/systemd/system/api-siswa.service
```
Isi dengan:
```ini
[Unit]
Description=API Siswa Go Service
After=network.target mysql.service

[Service]
Type=simple
User=username_vps_anda
WorkingDirectory=/home/username_vps_anda/api-siswa
ExecStart=/home/username_vps_anda/api-siswa/bin/api-siswa
Restart=always
EnvironmentFile=/home/username_vps_anda/api-siswa/.env

[Install]
WantedBy=multi-user.target
```
Aktifkan service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable api-siswa
sudo systemctl start api-siswa
```

### Langkah 4: Reverse Proxy dengan Nginx
Gunakan Nginx agar API bisa diakses melalui domain/subdomain:
```bash
sudo nano /etc/nginx/sites-available/api.domainanda.com
```
Contoh konfigurasi sederhana:
```nginx
server {
    listen 80;
    server_name api.domainanda.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
Aktifkan dan restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/api.domainanda.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 6. Dokumentasi API (Swagger)
Aplikasi ini dilengkapi Swagger. Untuk memperbarui dokumentasi setelah mengubah kode:
1. Pastikan `swag` terinstal: `go install github.com/swaggo/swag/cmd/swag@latest`.
2. Jalankan: `make swagger` atau `swag init -g cmd/server/main.go -o docs`.
3. Akses di browser: `http://localhost:8080/swagger/index.html`.
