-- =============================================
-- DATABASE: db_siswa_induk
-- Sistem Data Induk Siswa SMK
-- =============================================

CREATE DATABASE IF NOT EXISTS db_siswa_induk_api
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE db_siswa_induk_api;

-- =============================================
-- TABLE: users (Admin Authentication Only)
-- =============================================
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: siswa (Data Utama Siswa)
-- =============================================
CREATE TABLE siswa (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    no_induk VARCHAR(20) NOT NULL UNIQUE COMMENT 'Nomor Induk Sekolah',
    nisn VARCHAR(20) NOT NULL UNIQUE COMMENT 'Nomor Induk Siswa Nasional',
    nama_lengkap VARCHAR(100) NOT NULL,
    nama_panggilan VARCHAR(50),
    jenis_kelamin ENUM('L', 'P') NOT NULL,
    tempat_lahir VARCHAR(100) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    agama VARCHAR(20) NOT NULL,
    anak_ke INT UNSIGNED DEFAULT 1,
    jumlah_saudara INT UNSIGNED DEFAULT 0,
    kewarganegaraan VARCHAR(50) DEFAULT 'Indonesia',
    bahasa_rumah VARCHAR(50) DEFAULT 'Indonesia',
    foto_path VARCHAR(255) COMMENT 'Path ke file foto siswa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL COMMENT 'Soft delete',
    INDEX idx_siswa_nama (nama_lengkap),
    INDEX idx_siswa_nisn (nisn),
    INDEX idx_siswa_no_induk (no_induk),
    INDEX idx_siswa_deleted (deleted_at)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: alamat_siswa
-- =============================================
CREATE TABLE alamat_siswa (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    siswa_id BIGINT UNSIGNED NOT NULL,
    alamat_lengkap TEXT NOT NULL,
    kelurahan VARCHAR(100),
    kecamatan VARCHAR(100),
    kota VARCHAR(100),
    provinsi VARCHAR(100),
    kode_pos VARCHAR(10),
    no_telepon VARCHAR(20),
    tinggal_dengan VARCHAR(50) COMMENT 'Orang Tua/Wali/Kos/Lainnya',
    jarak_ke_sekolah DECIMAL(5,2) COMMENT 'Dalam kilometer',
    transportasi VARCHAR(50) COMMENT 'Jalan Kaki/Sepeda/Motor/Angkot',
    FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE,
    INDEX idx_alamat_siswa (siswa_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: orang_tua
-- =============================================
CREATE TABLE orang_tua (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    siswa_id BIGINT UNSIGNED NOT NULL,
    tipe ENUM('ayah', 'ibu') NOT NULL,
    nama VARCHAR(100) NOT NULL,
    tempat_lahir VARCHAR(100),
    tanggal_lahir DATE,
    kewarganegaraan VARCHAR(50) DEFAULT 'Indonesia',
    pendidikan_terakhir VARCHAR(50),
    pekerjaan VARCHAR(100),
    penghasilan_bulanan DECIMAL(15,2),
    alamat TEXT,
    no_telepon VARCHAR(20),
    masih_hidup BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE,
    INDEX idx_ortu_siswa (siswa_id),
    INDEX idx_ortu_tipe (tipe)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: wali
-- =============================================
CREATE TABLE wali (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    siswa_id BIGINT UNSIGNED NOT NULL,
    nama VARCHAR(100) NOT NULL,
    jenis_kelamin ENUM('L', 'P') NOT NULL,
    tempat_lahir VARCHAR(100),
    tanggal_lahir DATE,
    kewarganegaraan VARCHAR(50) DEFAULT 'Indonesia',
    pendidikan_terakhir VARCHAR(50),
    pekerjaan VARCHAR(100),
    penghasilan_bulanan DECIMAL(15,2),
    alamat TEXT,
    no_telepon VARCHAR(20),
    hubungan_dengan_siswa VARCHAR(50) COMMENT 'Paman/Bibi/Kakek/Nenek/dll',
    FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_wali_siswa (siswa_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: kesehatan_siswa
-- =============================================
CREATE TABLE kesehatan_siswa (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    siswa_id BIGINT UNSIGNED NOT NULL,
    berat_badan_masuk DECIMAL(5,2) COMMENT 'kg saat masuk',
    tinggi_badan_masuk DECIMAL(5,2) COMMENT 'cm saat masuk',
    berat_badan_keluar DECIMAL(5,2) COMMENT 'kg saat keluar',
    tinggi_badan_keluar DECIMAL(5,2) COMMENT 'cm saat keluar',
    golongan_darah ENUM('A', 'B', 'AB', 'O'),
    kesanggupan_jasmani TEXT,
    FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_kesehatan_siswa (siswa_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: riwayat_penyakit
-- =============================================
CREATE TABLE riwayat_penyakit (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    kesehatan_id BIGINT UNSIGNED NOT NULL,
    jenis_penyakit VARCHAR(100) NOT NULL,
    tahun INT UNSIGNED,
    lama_sakit VARCHAR(50),
    keterangan TEXT,
    FOREIGN KEY (kesehatan_id) REFERENCES kesehatan_siswa(id) ON DELETE CASCADE,
    INDEX idx_penyakit_kesehatan (kesehatan_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: pendidikan_sebelumnya
-- =============================================
CREATE TABLE pendidikan_sebelumnya (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    siswa_id BIGINT UNSIGNED NOT NULL,
    tipe ENUM('siswa_baru', 'pindahan') NOT NULL,
    tanggal_diterima DATE NOT NULL,
    asal_sekolah VARCHAR(200) NOT NULL,
    alamat_sekolah TEXT,
    no_ijazah VARCHAR(50),
    tanggal_ijazah DATE,
    no_skhun VARCHAR(50),
    tanggal_skhun DATE,
    kelas_diterima ENUM('X', 'XI', 'XII') NOT NULL,
    alasan_pindah TEXT,
    FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE,
    INDEX idx_pendidikan_siswa (siswa_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: kepribadian
-- =============================================
CREATE TABLE kepribadian (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    siswa_id BIGINT UNSIGNED NOT NULL,
    aspek VARCHAR(100) NOT NULL COMMENT 'Disiplin/Ketertiban, Tanggung Jawab, dll',
    nilai ENUM('Baik', 'Cukup', 'Kurang') NOT NULL,
    tahun_pelajaran VARCHAR(20),
    FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE,
    INDEX idx_kepribadian_siswa (siswa_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: prestasi
-- =============================================
CREATE TABLE prestasi (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    siswa_id BIGINT UNSIGNED NOT NULL,
    bidang ENUM('Kesenian', 'Olahraga', 'Kemasyarakatan', 'Pramuka', 'Karya Tulis', 'Lainnya') NOT NULL,
    keterangan TEXT,
    tahun INT UNSIGNED,
    tingkat ENUM('Sekolah', 'Kecamatan', 'Kota', 'Provinsi', 'Nasional', 'Internasional'),
    FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE,
    INDEX idx_prestasi_siswa (siswa_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: beasiswa
-- =============================================
CREATE TABLE beasiswa (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    siswa_id BIGINT UNSIGNED NOT NULL,
    tahun_pelajaran VARCHAR(20) NOT NULL,
    pemberi VARCHAR(100) NOT NULL COMMENT 'Pemerintah/Swasta/Yayasan',
    keterangan TEXT,
    FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE,
    INDEX idx_beasiswa_siswa (siswa_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: kehadiran
-- =============================================
CREATE TABLE kehadiran (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    siswa_id BIGINT UNSIGNED NOT NULL,
    kelas ENUM('X', 'XI', 'XII') NOT NULL,
    semester TINYINT UNSIGNED NOT NULL,
    jumlah_hadir INT UNSIGNED DEFAULT 0,
    persentase_hadir DECIMAL(5,2),
    jumlah_sakit INT UNSIGNED DEFAULT 0,
    jumlah_izin INT UNSIGNED DEFAULT 0,
    jumlah_alpa INT UNSIGNED DEFAULT 0,
    jumlah_hari_efektif INT UNSIGNED DEFAULT 0,
    FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_kehadiran_unique (siswa_id, kelas, semester),
    INDEX idx_kehadiran_siswa (siswa_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: mata_pelajaran (Master Data)
-- =============================================
CREATE TABLE mata_pelajaran (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    kode VARCHAR(20) NOT NULL UNIQUE,
    nama VARCHAR(100) NOT NULL,
    kelompok ENUM('A', 'B', 'C') NOT NULL COMMENT 'A=Muatan Nasional, B=Muatan Kewilayahan, C=Muatan Peminatan',
    sub_kelompok VARCHAR(50) COMMENT 'C1=Dasar Bidang, C2=Dasar Program, C3=Kompetensi Keahlian',
    aktif BOOLEAN DEFAULT TRUE,
    INDEX idx_mapel_kelompok (kelompok)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: nilai_semester
-- =============================================
CREATE TABLE nilai_semester (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    siswa_id BIGINT UNSIGNED NOT NULL,
    mata_pelajaran_id BIGINT UNSIGNED NOT NULL,
    kelas ENUM('X', 'XI', 'XII') NOT NULL,
    semester TINYINT UNSIGNED NOT NULL,
    tahun_pelajaran VARCHAR(20) NOT NULL COMMENT '2024/2025',
    nilai_pengetahuan INT UNSIGNED,
    predikat_pengetahuan ENUM('A', 'B', 'C', 'D'),
    deskripsi_pengetahuan TEXT,
    nilai_keterampilan INT UNSIGNED,
    predikat_keterampilan ENUM('A', 'B', 'C', 'D'),
    deskripsi_keterampilan TEXT,
    FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE,
    FOREIGN KEY (mata_pelajaran_id) REFERENCES mata_pelajaran(id) ON DELETE RESTRICT,
    UNIQUE INDEX idx_nilai_unique (siswa_id, mata_pelajaran_id, kelas, semester, tahun_pelajaran),
    INDEX idx_nilai_siswa (siswa_id),
    INDEX idx_nilai_filter (kelas, semester, tahun_pelajaran)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: nilai_sikap
-- =============================================
CREATE TABLE nilai_sikap (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    siswa_id BIGINT UNSIGNED NOT NULL,
    kelas ENUM('X', 'XI', 'XII') NOT NULL,
    semester TINYINT UNSIGNED NOT NULL,
    deskripsi_spiritual TEXT,
    deskripsi_sosial TEXT,
    FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_sikap_unique (siswa_id, kelas, semester),
    INDEX idx_sikap_siswa (siswa_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: catatan_akhir_semester
-- =============================================
CREATE TABLE catatan_akhir_semester (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    siswa_id BIGINT UNSIGNED NOT NULL,
    kelas ENUM('X', 'XI', 'XII') NOT NULL,
    semester TINYINT UNSIGNED NOT NULL,
    FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_catatan_unique (siswa_id, kelas, semester),
    INDEX idx_catatan_siswa (siswa_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: praktik_kerja_lapangan
-- =============================================
CREATE TABLE praktik_kerja_lapangan (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    catatan_id BIGINT UNSIGNED NOT NULL,
    nama_dudi VARCHAR(200) NOT NULL COMMENT 'Nama DU/DI atau Instansi',
    lokasi VARCHAR(200),
    lama_bulan INT UNSIGNED,
    keterangan TEXT,
    FOREIGN KEY (catatan_id) REFERENCES catatan_akhir_semester(id) ON DELETE CASCADE,
    INDEX idx_pkl_catatan (catatan_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: ekstrakurikuler
-- =============================================
CREATE TABLE ekstrakurikuler (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    catatan_id BIGINT UNSIGNED NOT NULL,
    nama_kegiatan VARCHAR(100) NOT NULL COMMENT 'Kepramukaan, Taruna, dll',
    keterangan TEXT,
    FOREIGN KEY (catatan_id) REFERENCES catatan_akhir_semester(id) ON DELETE CASCADE,
    INDEX idx_ekskul_catatan (catatan_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: prestasi_semester
-- =============================================
CREATE TABLE prestasi_semester (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    catatan_id BIGINT UNSIGNED NOT NULL,
    jenis_prestasi VARCHAR(200) NOT NULL,
    keterangan TEXT,
    FOREIGN KEY (catatan_id) REFERENCES catatan_akhir_semester(id) ON DELETE CASCADE,
    INDEX idx_prestasi_sem_catatan (catatan_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: ketidakhadiran_catatan
-- =============================================
CREATE TABLE ketidakhadiran_catatan (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    catatan_id BIGINT UNSIGNED NOT NULL,
    karena_sakit INT UNSIGNED DEFAULT 0,
    dengan_izin INT UNSIGNED DEFAULT 0,
    tanpa_keterangan INT UNSIGNED DEFAULT 0,
    FOREIGN KEY (catatan_id) REFERENCES catatan_akhir_semester(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_ketidakhadiran_catatan (catatan_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: nilai_ijazah
-- =============================================
CREATE TABLE nilai_ijazah (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    siswa_id BIGINT UNSIGNED NOT NULL,
    mata_pelajaran_id BIGINT UNSIGNED NOT NULL,
    nilai_akhir INT UNSIGNED NOT NULL,
    tahun_lulus VARCHAR(10),
    no_ijazah VARCHAR(50),
    tanggal_lulus DATE,
    FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE,
    FOREIGN KEY (mata_pelajaran_id) REFERENCES mata_pelajaran(id) ON DELETE RESTRICT,
    UNIQUE INDEX idx_ijazah_unique (siswa_id, mata_pelajaran_id),
    INDEX idx_ijazah_siswa (siswa_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: meninggalkan_sekolah
-- =============================================
CREATE TABLE meninggalkan_sekolah (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    siswa_id BIGINT UNSIGNED NOT NULL,
    tipe ENUM('tamat', 'pindah', 'putus') NOT NULL,
    tanggal DATE NOT NULL,
    sekolah_tujuan VARCHAR(200),
    alamat_sekolah_tujuan TEXT,
    no_ijazah VARCHAR(50),
    alasan TEXT,
    FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_keluar_siswa (siswa_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: pemeriksaan_buku
-- =============================================
CREATE TABLE pemeriksaan_buku (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    no_urut INT UNSIGNED NOT NULL,
    tanggal DATE NOT NULL,
    nama_pemeriksa VARCHAR(100) NOT NULL,
    jabatan VARCHAR(100),
    keterangan TEXT,
    INDEX idx_pemeriksaan_tanggal (tanggal)
) ENGINE=InnoDB;

-- =============================================
-- INSERT: Default Mata Pelajaran SMK
-- =============================================
INSERT INTO mata_pelajaran (kode, nama, kelompok, sub_kelompok) VALUES
-- Kelompok A (Muatan Nasional)
('PAI', 'Pendidikan Agama dan Budi Pekerti', 'A', NULL),
('PKN', 'PPKn', 'A', NULL),
('BIN', 'Bahasa Indonesia', 'A', NULL),
('MTK', 'Matematika', 'A', NULL),
('SJI', 'Sejarah Indonesia', 'A', NULL),
('BIG', 'Bahasa Inggris', 'A', NULL),
-- Kelompok B (Muatan Kewilayahan)
('SBD', 'Seni Budaya', 'B', NULL),
('PKW', 'Prakarya dan Kewirausahaan', 'B', NULL),
('PJO', 'Penjaskes', 'B', NULL),
('KKPI', 'KKPI', 'B', NULL),
-- Kelompok C (Kompetensi Keahlian - contoh TKJ)
('SIO', 'Sistem Komputer', 'C', 'C1'),
('KOM', 'Komputer dan Jaringan Dasar', 'C', 'C2'),
('PRO', 'Pemrograman Dasar', 'C', 'C2'),
('DDG', 'Desain Grafis', 'C', 'C2'),
('TLJ', 'Teknologi Layanan Jaringan', 'C', 'C3'),
('AIJ', 'Administrasi Infrastruktur Jaringan', 'C', 'C3'),
('ASJ', 'Administrasi Sistem Jaringan', 'C', 'C3'),
('TKJ', 'Teknologi Jaringan Berbasis Luas', 'C', 'C3'),
('PKK', 'Produk Kreatif dan Kewirausahaan', 'C', 'C3');

-- =============================================
-- INSERT: Default Admin User (password: admin123)
-- =============================================
INSERT INTO users (username, email, password_hash, is_active) VALUES
('admin', 'admin@siswa.local', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4pMJ.CqYWt1nlMOe', TRUE);
