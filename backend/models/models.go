package models

import (
	"time"

	"gorm.io/gorm"
)

// User model for admin authentication
type User struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Username     string    `gorm:"uniqueIndex;size:50;not null" json:"username"`
	Email        string    `gorm:"uniqueIndex;size:100;not null" json:"email"`
	PasswordHash string    `gorm:"size:255;not null" json:"-"`
	IsActive     bool      `gorm:"default:true" json:"is_active"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// TableName returns the table name for User
func (User) TableName() string {
	return "users"
}

// Siswa model for student data
type Siswa struct {
	ID              uint           `gorm:"primaryKey" json:"id"`
	NoInduk         string         `gorm:"uniqueIndex;size:20;not null" json:"no_induk"`
	NISN            string         `gorm:"uniqueIndex;size:20;not null" json:"nisn"`
	Nama            string         `gorm:"size:100;not null" json:"nama"`
	NamaPanggilan   string         `gorm:"size:50" json:"nama_panggilan"`
	JenisKelamin    string         `gorm:"type:enum('L','P');not null" json:"jenis_kelamin"`
	TempatLahir     string         `gorm:"size:100;not null" json:"tempat_lahir"`
	TanggalLahir    time.Time      `gorm:"type:date;not null" json:"tanggal_lahir"`
	Agama           string         `gorm:"size:20;not null" json:"agama"`
	AnakKe          uint           `gorm:"default:1" json:"anak_ke"`
	JumlahSaudara   uint           `gorm:"default:0" json:"jumlah_saudara"`
	Kewarganegaraan string         `gorm:"size:50;default:'Indonesia'" json:"kewarganegaraan"`
	BahasaRumah     string         `gorm:"size:50;default:'Indonesia'" json:"bahasa_rumah"`
	FotoPath        string         `gorm:"size:255" json:"foto_path"`
	KelasID         *uint          `json:"kelas_id"`
	Status          string         `gorm:"type:enum('aktif','lulus','pindah','tinggal_kelas','putus','keluar');default:'aktif'" json:"status"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`

	// Kelas relation
	Kelas            *Kelas         `gorm:"foreignKey:KelasID" json:"kelas_ref,omitempty"`

	// Relations
	Alamat               *AlamatSiswa           `gorm:"foreignKey:SiswaID" json:"alamat,omitempty"`
	OrangTua             []OrangTua             `gorm:"foreignKey:SiswaID" json:"orang_tua,omitempty"`
	Wali                 *Wali                  `gorm:"foreignKey:SiswaID" json:"wali,omitempty"`
	Kesehatan            *KesehatanSiswa        `gorm:"foreignKey:SiswaID" json:"kesehatan,omitempty"`
	PendidikanSebelumnya []PendidikanSebelumnya `gorm:"foreignKey:SiswaID" json:"pendidikan_sebelumnya,omitempty"`
	Kepribadian          []Kepribadian          `gorm:"foreignKey:SiswaID" json:"kepribadian,omitempty"`
	Prestasi             []Prestasi             `gorm:"foreignKey:SiswaID" json:"prestasi,omitempty"`
	Beasiswa             []Beasiswa             `gorm:"foreignKey:SiswaID" json:"beasiswa,omitempty"`
	Kehadiran            []Kehadiran            `gorm:"foreignKey:SiswaID" json:"kehadiran,omitempty"`
	NilaiSemester        []NilaiSemester        `gorm:"foreignKey:SiswaID" json:"nilai_semester,omitempty"`
	NilaiSikap           []NilaiSikap           `gorm:"foreignKey:SiswaID" json:"nilai_sikap,omitempty"`
	CatatanAkhirSemester []CatatanAkhirSemester `gorm:"foreignKey:SiswaID" json:"catatan_akhir_semester,omitempty"`
	NilaiIjazah          []NilaiIjazah          `gorm:"foreignKey:SiswaID" json:"nilai_ijazah,omitempty"`
	MeninggalkanSekolah  *MeninggalkanSekolah   `gorm:"foreignKey:SiswaID" json:"meninggalkan_sekolah,omitempty"`
	KeanggotaanEkskul    []KeanggotaanEkskul    `gorm:"foreignKey:SiswaID" json:"keanggotaan_ekskul,omitempty"`
}

// TableName returns the table name for Siswa
func (Siswa) TableName() string {
	return "siswa"
}

// AlamatSiswa model for student address
type AlamatSiswa struct {
	ID             uint    `gorm:"primaryKey" json:"id"`
	SiswaID        uint    `gorm:"not null;index" json:"siswa_id"`
	AlamatLengkap  string  `gorm:"type:text;not null" json:"alamat_lengkap"`
	Jalan          string  `gorm:"size:100" json:"jalan"`
	Kelurahan      string  `gorm:"size:100" json:"kelurahan"`
	Kecamatan      string  `gorm:"size:100" json:"kecamatan"`
	Kota           string  `gorm:"size:100" json:"kota"`
	Provinsi       string  `gorm:"size:100" json:"provinsi"`
	KodePos        string  `gorm:"size:10" json:"kode_pos"`
	NoTelepon      string  `gorm:"size:20" json:"no_telepon"`
	TinggalDengan  string  `gorm:"size:50" json:"tinggal_dengan"`
	JarakKeSekolah float64 `gorm:"type:decimal(5,2)" json:"jarak_ke_sekolah"`
	Transportasi   string  `gorm:"size:50" json:"transportasi"`
}

// TableName returns the table name for AlamatSiswa
func (AlamatSiswa) TableName() string {
	return "alamat_siswa"
}

// OrangTua model for parents
type OrangTua struct {
	ID                 uint       `gorm:"primaryKey" json:"id"`
	SiswaID            uint       `gorm:"not null;index" json:"siswa_id"`
	Tipe               string     `gorm:"type:enum('ayah','ibu');not null" json:"tipe"`
	Nama               string     `gorm:"size:100;not null" json:"nama"`
	TempatLahir        string     `gorm:"size:100" json:"tempat_lahir"`
	TanggalLahir       *time.Time `gorm:"type:date" json:"tanggal_lahir"`
	Kewarganegaraan    string     `gorm:"size:50;default:'Indonesia'" json:"kewarganegaraan"`
	PendidikanTerakhir string     `gorm:"size:50" json:"pendidikan_terakhir"`
	Pekerjaan          string     `gorm:"size:100" json:"pekerjaan"`
	PenghasilanBulanan float64    `gorm:"type:decimal(15,2)" json:"penghasilan_bulanan"`
	Alamat             string     `gorm:"type:text" json:"alamat"`
	Jalan              string     `gorm:"size:100" json:"jalan"`
	Kelurahan          string     `gorm:"size:100" json:"kelurahan"`
	Kecamatan          string     `gorm:"size:100" json:"kecamatan"`
	Kota               string     `gorm:"size:100" json:"kota"`
	Provinsi           string     `gorm:"size:100" json:"provinsi"`
	KodePos            string     `gorm:"size:10" json:"kode_pos"`
	NoTelepon          string     `gorm:"size:20" json:"no_telepon"`
	MasihHidup         bool       `gorm:"default:true" json:"masih_hidup"`
}

// TableName returns the table name for OrangTua
func (OrangTua) TableName() string {
	return "orang_tua"
}

// Wali model for guardian
type Wali struct {
	ID                  uint       `gorm:"primaryKey" json:"id"`
	SiswaID             uint       `gorm:"uniqueIndex;not null" json:"siswa_id"`
	NamaWali            string     `gorm:"size:100;not null" json:"nama_wali"`
	JenisKelamin        string     `gorm:"type:enum('L','P');not null" json:"jenis_kelamin"`
	TempatLahir         string     `gorm:"size:100" json:"tempat_lahir"`
	TanggalLahir        *time.Time `gorm:"type:date" json:"tanggal_lahir"`
	Kewarganegaraan     string     `gorm:"size:50;default:'Indonesia'" json:"kewarganegaraan"`
	PendidikanTerakhir  string     `gorm:"size:50" json:"pendidikan_terakhir"`
	PekerjaanWali       string     `gorm:"size:100" json:"pekerjaan_wali"`
	PenghasilanBulanan  float64    `gorm:"type:decimal(15,2)" json:"penghasilan_bulanan"`
	Alamat              string     `gorm:"type:text" json:"alamat"`
	NoTelpWali          string     `gorm:"size:20" json:"no_telp_wali"`
	Hubungan            string     `gorm:"size:50" json:"hubungan"`
}

// TableName returns the table name for Wali
func (Wali) TableName() string {
	return "wali"
}

// KesehatanSiswa model for student health
type KesehatanSiswa struct {
	ID                 uint    `gorm:"primaryKey" json:"id"`
	SiswaID            uint    `gorm:"uniqueIndex;not null" json:"siswa_id"`
	BeratBadan         float64 `gorm:"type:decimal(5,2)" json:"berat_badan"`
	TinggiBadan        float64 `gorm:"type:decimal(5,2)" json:"tinggi_badan"`
	BeratBadanKeluar   float64 `gorm:"type:decimal(5,2)" json:"berat_badan_keluar"`
	TinggiBadanKeluar  float64 `gorm:"type:decimal(5,2)" json:"tinggi_badan_keluar"`
	GolonganDarah      string  `gorm:"type:enum('A','B','AB','O')" json:"golongan_darah"`
	KesanggupanJasmani string  `gorm:"type:text" json:"kesanggupan_jasmani"`

	// Relations
	RiwayatPenyakit []RiwayatPenyakit `gorm:"foreignKey:KesehatanID" json:"riwayat_penyakit,omitempty"`
}

// TableName returns the table name for KesehatanSiswa
func (KesehatanSiswa) TableName() string {
	return "kesehatan_siswa"
}

// RiwayatPenyakit model for disease history
type RiwayatPenyakit struct {
	ID            uint   `gorm:"primaryKey" json:"id"`
	KesehatanID   uint   `gorm:"not null;index" json:"kesehatan_id"`
	NamaPenyakit  string `gorm:"size:100;not null" json:"nama_penyakit"`
	TahunSakit    uint   `json:"tahun_sakit"`
	LamaSakit     string `gorm:"size:50" json:"lama_sakit"`
	Keterangan    string `gorm:"type:text" json:"keterangan"`
}

// TableName returns the table name for RiwayatPenyakit
func (RiwayatPenyakit) TableName() string {
	return "riwayat_penyakit"
}

// PendidikanSebelumnya model for previous education
type PendidikanSebelumnya struct {
	ID              uint       `gorm:"primaryKey" json:"id"`
	SiswaID         uint       `gorm:"not null;index" json:"siswa_id"`
	Tipe            string     `gorm:"type:enum('siswa_baru','pindahan');not null" json:"tipe"`
	TanggalDiterima time.Time  `gorm:"type:date;not null" json:"tanggal_diterima"`
	NamaSekolah     string     `gorm:"size:200;not null" json:"nama_sekolah"`
	AlamatSekolah   string     `gorm:"type:text" json:"alamat_sekolah"`
	NoIjazah        string     `gorm:"size:50" json:"no_ijazah"`
	TanggalIjazah   *time.Time `gorm:"type:date" json:"tanggal_ijazah"`
	NoSKHUN         string     `gorm:"size:50" json:"no_skhun"`
	TanggalSKHUN    *time.Time `gorm:"type:date" json:"tanggal_skhun"`
	KelasDiterima   string     `gorm:"type:enum('X','XI','XII');not null" json:"kelas_diterima"`
	AlasanPindah    string     `gorm:"type:text" json:"alasan_pindah"`
}

// TableName returns the table name for PendidikanSebelumnya
func (PendidikanSebelumnya) TableName() string {
	return "pendidikan_sebelumnya"
}

// Kepribadian model for personality assessment
type Kepribadian struct {
	ID             uint   `gorm:"primaryKey" json:"id"`
	SiswaID        uint   `gorm:"not null;index" json:"siswa_id"`
	Aspek          string `gorm:"size:100;not null" json:"aspek"`
	Nilai          string `gorm:"type:enum('Baik','Cukup','Kurang');not null" json:"nilai"`
	TahunPelajaran string `gorm:"size:20" json:"tahun_pelajaran"`
}

// TableName returns the table name for Kepribadian
func (Kepribadian) TableName() string {
	return "kepribadian"
}

// Prestasi model for achievements
type Prestasi struct {
	ID           uint   `gorm:"primaryKey" json:"id"`
	SiswaID      uint   `gorm:"not null;index" json:"siswa_id"`
	Bidang       string `gorm:"type:enum('Kesenian','Olahraga','Kemasyarakatan','Pramuka','Karya Tulis','Lainnya');not null" json:"bidang"`
	NamaPrestasi string `gorm:"size:255" json:"nama_prestasi"`
	Keterangan   string `gorm:"type:text" json:"keterangan"`
	Tahun        uint   `json:"tahun"`
	Tingkat      string `gorm:"type:enum('Sekolah','Kecamatan','Kota','Provinsi','Nasional','Internasional')" json:"tingkat"`
}

// TableName returns the table name for Prestasi
func (Prestasi) TableName() string {
	return "prestasi"
}

// Beasiswa model for scholarships
type Beasiswa struct {
	ID             uint   `gorm:"primaryKey" json:"id"`
	SiswaID        uint   `gorm:"not null;index" json:"siswa_id"`
	TahunPelajaran string `gorm:"size:20;not null" json:"tahun_pelajaran"`
	Pemberi        string `gorm:"size:100;not null" json:"pemberi"`
	Keterangan     string `gorm:"type:text" json:"keterangan"`
}

// TableName returns the table name for Beasiswa
func (Beasiswa) TableName() string {
	return "beasiswa"
}

// Kehadiran model for attendance
type Kehadiran struct {
	ID                uint    `gorm:"primaryKey" json:"id"`
	SiswaID           uint    `gorm:"not null;index" json:"siswa_id"`
	Kelas             string  `gorm:"type:enum('X','XI','XII');not null" json:"kelas"`
	Semester          uint8   `gorm:"not null" json:"semester"`
	JumlahHadir       uint    `gorm:"default:0" json:"jumlah_hadir"`
	PersentaseHadir   float64 `gorm:"type:decimal(5,2)" json:"persentase_hadir"`
	JumlahSakit       uint    `gorm:"default:0" json:"jumlah_sakit"`
	JumlahIzin        uint    `gorm:"default:0" json:"jumlah_izin"`
	JumlahAlpa        uint    `gorm:"default:0" json:"jumlah_alpa"`
	JumlahHariEfektif uint    `gorm:"default:0" json:"jumlah_hari_efektif"`
}

// TableName returns the table name for Kehadiran
func (Kehadiran) TableName() string {
	return "kehadiran"
}

// MataPelajaran model for subjects
type MataPelajaran struct {
	ID           uint   `gorm:"primaryKey" json:"id"`
	Kode         string `gorm:"uniqueIndex;size:20;not null" json:"kode"`
	Nama         string `gorm:"size:100;not null" json:"nama_mapel"`
	Kelompok     string `gorm:"type:enum('A','B','C');not null" json:"kelompok_mapel"`
	SubKelompok  string `gorm:"size:50" json:"nama_sekolor"`
	KelasTarget1 string `gorm:"column:kelas_target_1;size:100;default:'Semua'" json:"kelas_target_1"`
	KelasTarget2 string `gorm:"column:kelas_target_2;size:100;default:'Tidak ada'" json:"kelas_target_2"`
	Aktif        bool   `gorm:"default:true" json:"aktif"`
	Keterangan   string `gorm:"type:text" json:"keterangan"`
}

// TableName returns the table name for MataPelajaran
func (MataPelajaran) TableName() string {
	return "mata_pelajaran"
}

// NilaiSemester model for semester grades
type NilaiSemester struct {
	ID                    uint   `gorm:"primaryKey" json:"id"`
	SiswaID               uint   `gorm:"not null;index" json:"siswa_id"`
	MataPelajaranID       uint   `gorm:"not null;index" json:"mata_pelajaran_id"`
	Kelas                 string `gorm:"type:enum('X','XI','XII');not null" json:"kelas"`
	Semester              uint8  `gorm:"not null" json:"semester"`
	TahunPelajaran        string `gorm:"size:20;not null" json:"tahun_pelajaran"`
	NilaiPengetahuan      uint   `json:"nilai_pengetahuan"`
	PredikatPengetahuan   string `gorm:"type:enum('A','B','C','D')" json:"predikat_pengetahuan"`
	DeskripsiPengetahuan  string `gorm:"type:text" json:"deskripsi_pengetahuan"`
	NilaiKeterampilan     uint   `json:"nilai_keterampilan"`
	PredikatKeterampilan  string `gorm:"type:enum('A','B','C','D')" json:"predikat_keterampilan"`
	DeskripsiKeterampilan string `gorm:"type:text" json:"deskripsi_keterampilan"`

	// Relations
	MataPelajaran *MataPelajaran `gorm:"foreignKey:MataPelajaranID" json:"mata_pelajaran,omitempty"`
}

// TableName returns the table name for NilaiSemester
func (NilaiSemester) TableName() string {
	return "nilai_semester"
}

// NilaiSikap model for attitude grades
type NilaiSikap struct {
	ID                 uint   `gorm:"primaryKey" json:"id"`
	SiswaID            uint   `gorm:"not null;index" json:"siswa_id"`
	Kelas              string `gorm:"type:enum('X','XI','XII');not null" json:"kelas"`
	Semester           uint8  `gorm:"not null" json:"semester"`
	DeskripsiSpiritual string `gorm:"type:text" json:"deskripsi_spiritual"`
	DeskripsiSosial    string `gorm:"type:text" json:"deskripsi_sosial"`
}

// TableName returns the table name for NilaiSikap
func (NilaiSikap) TableName() string {
	return "nilai_sikap"
}

// CatatanAkhirSemester model for end of semester notes
type CatatanAkhirSemester struct {
	ID                uint   `gorm:"primaryKey" json:"id"`
	SiswaID           uint   `gorm:"not null;index" json:"siswa_id"`
	Kelas             string `gorm:"type:enum('X','XI','XII');not null" json:"kelas"`
	Semester          uint8  `gorm:"not null" json:"semester"`
	CatatanWaliKelas  string `gorm:"type:text" json:"catatan_wali_kelas"`

	// Relations
	PKL              []PraktikKerjaLapangan `gorm:"foreignKey:CatatanID" json:"pkl,omitempty"`
	Ekstrakurikuler  []Ekstrakurikuler      `gorm:"foreignKey:CatatanID" json:"ekstrakurikuler,omitempty"`
	PrestasiSemester []PrestasiSemester     `gorm:"foreignKey:CatatanID" json:"prestasi_semester,omitempty"`
	KetidakhadiranCatatan *KetidakhadiranCatatan `gorm:"foreignKey:CatatanID" json:"ketidakhadiran_catatan,omitempty"`
}

// TableName returns the table name for CatatanAkhirSemester
func (CatatanAkhirSemester) TableName() string {
	return "catatan_akhir_semester"
}

// PraktikKerjaLapangan model for internship
type PraktikKerjaLapangan struct {
	ID         uint   `gorm:"primaryKey" json:"id"`
	CatatanID  uint   `gorm:"not null;index" json:"catatan_id"`
	NamaDUDI   string `gorm:"size:200;not null" json:"nama_dudi"`
	Lokasi     string `gorm:"size:200" json:"lokasi"`
	LamaBulan  uint   `json:"lama_bulan"`
	Keterangan string `gorm:"type:text" json:"keterangan"`
}

// TableName returns the table name for PraktikKerjaLapangan
func (PraktikKerjaLapangan) TableName() string {
	return "praktik_kerja_lapangan"
}

// KeanggotaanEkskul model for student extracurricular membership (not tied to semester)
type KeanggotaanEkskul struct {
	ID           uint   `gorm:"primaryKey" json:"id"`
	SiswaID      uint   `gorm:"not null;index" json:"siswa_id"`
	NamaKegiatan string `gorm:"size:100;not null" json:"nama_kegiatan"`
	Keterangan   string `gorm:"type:text" json:"keterangan"`
	
	// Relations
	Siswa *Siswa `gorm:"foreignKey:SiswaID" json:"siswa,omitempty"`
}

// TableName returns the table name for KeanggotaanEkskul
func (KeanggotaanEkskul) TableName() string {
	return "keanggotaan_ekskul"
}

// Ekstrakurikuler model for extracurricular grades (tied to semester)
type Ekstrakurikuler struct {
	ID           uint   `gorm:"primaryKey" json:"id"`
	CatatanID    uint   `gorm:"not null;index" json:"catatan_id"`
	NamaEkskul   string `gorm:"size:100;not null" json:"nama_ekskul"`
	Nilai        string `gorm:"size:10" json:"nilai"`
	Deskripsi    string `gorm:"type:text" json:"deskripsi"`
}

// TableName returns the table name for Ekstrakurikuler
func (Ekstrakurikuler) TableName() string {
	return "ekstrakurikuler"
}

// PrestasiSemester model for semester achievements
type PrestasiSemester struct {
	ID            uint   `gorm:"primaryKey" json:"id"`
	CatatanID     uint   `gorm:"not null;index" json:"catatan_id"`
	NamaPrestasi  string `gorm:"size:200;not null" json:"nama_prestasi"`
	Keterangan    string `gorm:"type:text" json:"keterangan"`
}

// TableName returns the table name for PrestasiSemester
func (PrestasiSemester) TableName() string {
	return "prestasi_semester"
}

// KetidakhadiranCatatan model for absence notes
type KetidakhadiranCatatan struct {
	ID              uint `gorm:"primaryKey" json:"id"`
	CatatanID       uint `gorm:"uniqueIndex;not null" json:"catatan_id"`
	KarenaSakit     uint `gorm:"default:0" json:"karena_sakit"`
	DenganIzin      uint `gorm:"default:0" json:"dengan_izin"`
	TanpaKeterangan uint `gorm:"default:0" json:"tanpa_keterangan"`
}

// TableName returns the table name for KetidakhadiranCatatan
func (KetidakhadiranCatatan) TableName() string {
	return "ketidakhadiran_catatan"
}

// NilaiIjazah model for certificate grades
type NilaiIjazah struct {
	ID              uint       `gorm:"primaryKey" json:"id"`
	SiswaID         uint       `gorm:"not null;index" json:"siswa_id"`
	MataPelajaranID uint       `gorm:"not null;index" json:"mata_pelajaran_id"`
	NilaiAkhir      uint       `gorm:"not null" json:"nilai_akhir"`
	NilaiRataRata   float64    `gorm:"type:decimal(5,2)" json:"nilai_rata_rata"`
	TahunLulus      string     `gorm:"size:10" json:"tahun_lulus"`
	NoIjazah        string     `gorm:"size:50" json:"no_ijazah"`
	NomorIjazah     string     `gorm:"size:50" json:"nomor_ijazah"`
	TanggalLulus    *time.Time `gorm:"type:date" json:"tanggal_lulus"`

	// Relations
	MataPelajaran *MataPelajaran `gorm:"foreignKey:MataPelajaranID" json:"mata_pelajaran,omitempty"`
}

// TableName returns the table name for NilaiIjazah
func (NilaiIjazah) TableName() string {
	return "nilai_ijazah"
}

// MeninggalkanSekolah model for leaving school
type MeninggalkanSekolah struct {
	ID                  uint      `gorm:"primaryKey" json:"id"`
	SiswaID             uint      `gorm:"uniqueIndex;not null" json:"siswa_id"`
	Tipe                string    `gorm:"type:enum('tamat','pindah','putus');not null" json:"tipe"`
	TanggalKeluar       time.Time `gorm:"type:date;not null" json:"tanggal_keluar"`
	SekolahTujuan       string    `gorm:"size:200" json:"sekolah_tujuan"`
	AlamatSekolahTujuan string    `gorm:"type:text" json:"alamat_sekolah_tujuan"`
	NoIjazah            string    `gorm:"size:50" json:"no_ijazah"`
	Alasan              string    `gorm:"type:text" json:"alasan"`
	Tujuan              string    `gorm:"size:200" json:"tujuan"`
}

// TableName returns the table name for MeninggalkanSekolah
func (MeninggalkanSekolah) TableName() string {
	return "meninggalkan_sekolah"
}

// ActivityLog model for audit trail
type ActivityLog struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	UserID      uint      `gorm:"not null;index" json:"user_id"`
	Username    string    `gorm:"size:50;not null" json:"username"`
	Action      string    `gorm:"size:20;not null" json:"action"`
	EntityType  string    `gorm:"size:50;not null" json:"entity_type"`
	EntityID    uint      `gorm:"default:0" json:"entity_id"`
	Description string    `gorm:"type:text" json:"description"`
	IPAddress   string    `gorm:"size:50" json:"ip_address"`
	CreatedAt   time.Time `json:"created_at"`
}

// TableName returns the table name for ActivityLog
func (ActivityLog) TableName() string {
	return "activity_logs"
}

// PemeriksaanBuku model for book inspection
type PemeriksaanBuku struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	SiswaID       uint      `gorm:"not null;index" json:"siswa_id"`
	NoUrut        uint      `gorm:"not null" json:"no_urut"`
	TanggalPeriksa time.Time `gorm:"type:date;not null" json:"tanggal_periksa"`
	NamaPemeriksa string    `gorm:"size:100;not null" json:"nama_pemeriksa"`
	Jabatan       string    `gorm:"size:100" json:"jabatan"`
	CatatanPetugas string   `gorm:"type:text" json:"catatan_petugas"`
}

// TableName returns the table name for PemeriksaanBuku
func (PemeriksaanBuku) TableName() string {
	return "pemeriksaan_buku"
}

// Kelas model for class data
type Kelas struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	Nama           string    `gorm:"size:50;not null" json:"nama"`
	Tingkat        string    `gorm:"type:enum('X','XI','XII');not null" json:"tingkat"`
	Jurusan        string    `gorm:"size:50" json:"jurusan"`
	TahunPelajaran string    `gorm:"size:20;not null" json:"tahun_pelajaran"`
	WaliKelas      string    `gorm:"size:100" json:"wali_kelas"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// TableName returns the table name for Kelas
func (Kelas) TableName() string {
	return "kelas"
}

// NilaiEkstrakurikuler model for extracurricular grades
type NilaiEkstrakurikuler struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	SiswaID   uint      `gorm:"not null;index" json:"siswa_id"`
	NamaEkskul string   `gorm:"size:100;not null" json:"nama_ekskul"`
	Kelas     string    `gorm:"type:enum('X','XI','XII');not null" json:"kelas"`
	Semester  uint8     `gorm:"not null" json:"semester"`
	Predikat  string    `gorm:"type:enum('A','B','C');not null" json:"predikat"`
	Keterangan string   `gorm:"type:text" json:"keterangan"`
	CreatedAt time.Time `json:"created_at"`

	// Relations
	Siswa *Siswa `gorm:"foreignKey:SiswaID" json:"siswa,omitempty"`
}

// TableName returns the table name for NilaiEkstrakurikuler
func (NilaiEkstrakurikuler) TableName() string {
	return "nilai_ekstrakurikuler"
}

// KenaikanKelas model for class promotion
type KenaikanKelas struct {
	ID                  uint      `gorm:"primaryKey" json:"id"`
	SiswaID             uint      `gorm:"not null;index" json:"siswa_id"`
	DariKelasID         uint      `gorm:"not null" json:"dari_kelas_id"`
	KeKelasID           *uint     `json:"ke_kelas_id"`
	TahunPelajaranLama  string    `gorm:"size:20;not null" json:"tahun_pelajaran_lama"`
	TahunPelajaranBaru  string    `gorm:"size:20;not null" json:"tahun_pelajaran_baru"`
	Status              string    `gorm:"type:enum('naik','lulus','tinggal_kelas');not null" json:"status"`
	CreatedAt           time.Time `json:"created_at"`

	// Relations
	Siswa     *Siswa `gorm:"foreignKey:SiswaID" json:"siswa,omitempty"`
	DariKelas *Kelas `gorm:"foreignKey:DariKelasID" json:"dari_kelas,omitempty"`
	KeKelas   *Kelas `gorm:"foreignKey:KeKelasID" json:"ke_kelas,omitempty"`
}

// TableName returns the table name for KenaikanKelas
func (KenaikanKelas) TableName() string {
	return "kenaikan_kelas"
}
