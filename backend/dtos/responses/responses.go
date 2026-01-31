package responses

import "time"

// LoginResponse for login result
type LoginResponse struct {
	Token     string       `json:"token" example:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`
	ExpiresIn int          `json:"expires_in" example:"86400"`
	User      UserResponse `json:"user"`
}

// UserResponse for user data
type UserResponse struct {
	ID       uint   `json:"id" example:"1"`
	Username string `json:"username" example:"admin"`
	Email    string `json:"email" example:"admin@example.com"`
	IsActive bool   `json:"is_active" example:"true"`
}

// SiswaListResponse for student list
type SiswaListResponse struct {
	ID           uint      `json:"id" example:"1"`
	NoInduk      string    `json:"no_induk" example:"2024001"`
	NISN         string    `json:"nisn" example:"0012345678"`
	NamaLengkap  string    `json:"nama_lengkap" example:"Ahmad Syafiq"`
	JenisKelamin string    `json:"jenis_kelamin" example:"L"`
	Kelas        string    `json:"kelas" example:"X"`
	FotoPath     string    `json:"foto_path" example:"photos/123456.jpg"`
	CreatedAt    time.Time `json:"created_at"`
}

// SiswaDetailResponse for detailed student data
type SiswaDetailResponse struct {
	ID              uint      `json:"id"`
	NoInduk         string    `json:"no_induk"`
	NISN            string    `json:"nisn"`
	NamaLengkap     string    `json:"nama_lengkap"`
	NamaPanggilan   string    `json:"nama_panggilan"`
	JenisKelamin    string    `json:"jenis_kelamin"`
	TempatLahir     string    `json:"tempat_lahir"`
	TanggalLahir    time.Time `json:"tanggal_lahir"`
	Agama           string    `json:"agama"`
	AnakKe          uint      `json:"anak_ke"`
	JumlahSaudara   uint      `json:"jumlah_saudara"`
	Kewarganegaraan string    `json:"kewarganegaraan"`
	BahasaRumah     string    `json:"bahasa_rumah"`
	FotoPath        string    `json:"foto_path"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`

	// Related data
	Alamat               *AlamatResponse              `json:"alamat,omitempty"`
	OrangTua             []OrangTuaResponse           `json:"orang_tua,omitempty"`
	Wali                 *WaliResponse                `json:"wali,omitempty"`
	Kesehatan            *KesehatanResponse           `json:"kesehatan,omitempty"`
	PendidikanSebelumnya []PendidikanResponse         `json:"pendidikan_sebelumnya,omitempty"`
	Kepribadian          []KepribadianResponse        `json:"kepribadian,omitempty"`
	Prestasi             []PrestasiResponse           `json:"prestasi,omitempty"`
	Beasiswa             []BeasiswaResponse           `json:"beasiswa,omitempty"`
	Kehadiran            []KehadiranResponse          `json:"kehadiran,omitempty"`
	NilaiSemester        []NilaiSemesterResponse      `json:"nilai_semester,omitempty"`
	NilaiSikap           []NilaiSikapResponse         `json:"nilai_sikap,omitempty"`
	CatatanSemester      []CatatanSemesterResponse    `json:"catatan_semester,omitempty"`
	NilaiIjazah          []NilaiIjazahResponse        `json:"nilai_ijazah,omitempty"`
	MeninggalkanSekolah  *MeninggalkanSekolahResponse `json:"meninggalkan_sekolah,omitempty"`
}

// AlamatResponse for address
type AlamatResponse struct {
	ID             uint    `json:"id"`
	AlamatLengkap  string  `json:"alamat_lengkap"`
	Kelurahan      string  `json:"kelurahan"`
	Kecamatan      string  `json:"kecamatan"`
	Kota           string  `json:"kota"`
	Provinsi       string  `json:"provinsi"`
	KodePos        string  `json:"kode_pos"`
	NoTelepon      string  `json:"no_telepon"`
	TinggalDengan  string  `json:"tinggal_dengan"`
	JarakKeSekolah float64 `json:"jarak_ke_sekolah"`
	Transportasi   string  `json:"transportasi"`
}

// OrangTuaResponse for parent
type OrangTuaResponse struct {
	ID                 uint       `json:"id"`
	Tipe               string     `json:"tipe"`
	Nama               string     `json:"nama"`
	TempatLahir        string     `json:"tempat_lahir"`
	TanggalLahir       *time.Time `json:"tanggal_lahir"`
	Kewarganegaraan    string     `json:"kewarganegaraan"`
	PendidikanTerakhir string     `json:"pendidikan_terakhir"`
	Pekerjaan          string     `json:"pekerjaan"`
	PenghasilanBulanan float64    `json:"penghasilan_bulanan"`
	Alamat             string     `json:"alamat"`
	NoTelepon          string     `json:"no_telepon"`
	MasihHidup         bool       `json:"masih_hidup"`
}

// WaliResponse for guardian
type WaliResponse struct {
	ID                  uint       `json:"id"`
	Nama                string     `json:"nama"`
	JenisKelamin        string     `json:"jenis_kelamin"`
	TempatLahir         string     `json:"tempat_lahir"`
	TanggalLahir        *time.Time `json:"tanggal_lahir"`
	Kewarganegaraan     string     `json:"kewarganegaraan"`
	PendidikanTerakhir  string     `json:"pendidikan_terakhir"`
	Pekerjaan           string     `json:"pekerjaan"`
	PenghasilanBulanan  float64    `json:"penghasilan_bulanan"`
	Alamat              string     `json:"alamat"`
	NoTelepon           string     `json:"no_telepon"`
	HubunganDenganSiswa string     `json:"hubungan_dengan_siswa"`
}

// KesehatanResponse for health data
type KesehatanResponse struct {
	ID                 uint                      `json:"id"`
	BeratBadanMasuk    float64                   `json:"berat_badan_masuk"`
	TinggiBadanMasuk   float64                   `json:"tinggi_badan_masuk"`
	BeratBadanKeluar   float64                   `json:"berat_badan_keluar"`
	TinggiBadanKeluar  float64                   `json:"tinggi_badan_keluar"`
	GolonganDarah      string                    `json:"golongan_darah"`
	KesanggupanJasmani string                    `json:"kesanggupan_jasmani"`
	RiwayatPenyakit    []RiwayatPenyakitResponse `json:"riwayat_penyakit,omitempty"`
}

// RiwayatPenyakitResponse for disease history
type RiwayatPenyakitResponse struct {
	ID            uint   `json:"id"`
	JenisPenyakit string `json:"jenis_penyakit"`
	Tahun         uint   `json:"tahun"`
	LamaSakit     string `json:"lama_sakit"`
	Keterangan    string `json:"keterangan"`
}

// PendidikanResponse for previous education
type PendidikanResponse struct {
	ID              uint       `json:"id"`
	Tipe            string     `json:"tipe"`
	TanggalDiterima time.Time  `json:"tanggal_diterima"`
	AsalSekolah     string     `json:"asal_sekolah"`
	AlamatSekolah   string     `json:"alamat_sekolah"`
	NoIjazah        string     `json:"no_ijazah"`
	TanggalIjazah   *time.Time `json:"tanggal_ijazah"`
	NoSKHUN         string     `json:"no_skhun"`
	TanggalSKHUN    *time.Time `json:"tanggal_skhun"`
	KelasDiterima   string     `json:"kelas_diterima"`
	AlasanPindah    string     `json:"alasan_pindah"`
}

// KepribadianResponse for personality
type KepribadianResponse struct {
	ID             uint   `json:"id"`
	Aspek          string `json:"aspek"`
	Nilai          string `json:"nilai"`
	TahunPelajaran string `json:"tahun_pelajaran"`
}

// PrestasiResponse for achievement
type PrestasiResponse struct {
	ID         uint   `json:"id"`
	Bidang     string `json:"bidang"`
	Keterangan string `json:"keterangan"`
	Tahun      uint   `json:"tahun"`
	Tingkat    string `json:"tingkat"`
}

// BeasiswaResponse for scholarship
type BeasiswaResponse struct {
	ID             uint   `json:"id"`
	TahunPelajaran string `json:"tahun_pelajaran"`
	Pemberi        string `json:"pemberi"`
	Keterangan     string `json:"keterangan"`
}

// KehadiranResponse for attendance
type KehadiranResponse struct {
	ID                uint    `json:"id"`
	Kelas             string  `json:"kelas"`
	Semester          uint8   `json:"semester"`
	JumlahHadir       uint    `json:"jumlah_hadir"`
	PersentaseHadir   float64 `json:"persentase_hadir"`
	JumlahSakit       uint    `json:"jumlah_sakit"`
	JumlahIzin        uint    `json:"jumlah_izin"`
	JumlahAlpa        uint    `json:"jumlah_alpa"`
	JumlahHariEfektif uint    `json:"jumlah_hari_efektif"`
}

// MataPelajaranResponse for subject
type MataPelajaranResponse struct {
	ID          uint   `json:"id"`
	Kode        string `json:"kode"`
	Nama        string `json:"nama"`
	Kelompok    string `json:"kelompok"`
	SubKelompok string `json:"sub_kelompok"`
}

// NilaiSemesterResponse for semester grade
type NilaiSemesterResponse struct {
	ID                    uint                   `json:"id"`
	MataPelajaran         *MataPelajaranResponse `json:"mata_pelajaran,omitempty"`
	Kelas                 string                 `json:"kelas"`
	Semester              uint8                  `json:"semester"`
	TahunPelajaran        string                 `json:"tahun_pelajaran"`
	NilaiPengetahuan      uint                   `json:"nilai_pengetahuan"`
	PredikatPengetahuan   string                 `json:"predikat_pengetahuan"`
	DeskripsiPengetahuan  string                 `json:"deskripsi_pengetahuan"`
	NilaiKeterampilan     uint                   `json:"nilai_keterampilan"`
	PredikatKeterampilan  string                 `json:"predikat_keterampilan"`
	DeskripsiKeterampilan string                 `json:"deskripsi_keterampilan"`
}

// NilaiSikapResponse for attitude grade
type NilaiSikapResponse struct {
	ID                 uint   `json:"id"`
	Kelas              string `json:"kelas"`
	Semester           uint8  `json:"semester"`
	DeskripsiSpiritual string `json:"deskripsi_spiritual"`
	DeskripsiSosial    string `json:"deskripsi_sosial"`
}

// CatatanSemesterResponse for semester notes
type CatatanSemesterResponse struct {
	ID               uint                       `json:"id"`
	Kelas            string                     `json:"kelas"`
	Semester         uint8                      `json:"semester"`
	PKL              []PKLResponse              `json:"pkl,omitempty"`
	Ekstrakurikuler  []EkstrakurikulerResponse  `json:"ekstrakurikuler,omitempty"`
	PrestasiSemester []PrestasiSemesterResponse `json:"prestasi_semester,omitempty"`
	Ketidakhadiran   *KetidakhadiranResponse    `json:"ketidakhadiran,omitempty"`
}

// PKLResponse for internship
type PKLResponse struct {
	ID         uint   `json:"id"`
	NamaDUDI   string `json:"nama_dudi"`
	Lokasi     string `json:"lokasi"`
	LamaBulan  uint   `json:"lama_bulan"`
	Keterangan string `json:"keterangan"`
}

// EkstrakurikulerResponse for extracurricular
type EkstrakurikulerResponse struct {
	ID           uint   `json:"id"`
	NamaKegiatan string `json:"nama_kegiatan"`
	Keterangan   string `json:"keterangan"`
}

// PrestasiSemesterResponse for semester achievement
type PrestasiSemesterResponse struct {
	ID            uint   `json:"id"`
	JenisPrestasi string `json:"jenis_prestasi"`
	Keterangan    string `json:"keterangan"`
}

// KetidakhadiranResponse for absence
type KetidakhadiranResponse struct {
	ID              uint `json:"id"`
	KarenaSakit     uint `json:"karena_sakit"`
	DenganIzin      uint `json:"dengan_izin"`
	TanpaKeterangan uint `json:"tanpa_keterangan"`
}

// NilaiIjazahResponse for certificate grade
type NilaiIjazahResponse struct {
	ID            uint                   `json:"id"`
	MataPelajaran *MataPelajaranResponse `json:"mata_pelajaran,omitempty"`
	NilaiAkhir    uint                   `json:"nilai_akhir"`
	TahunLulus    string                 `json:"tahun_lulus"`
	NoIjazah      string                 `json:"no_ijazah"`
	TanggalLulus  *time.Time             `json:"tanggal_lulus"`
}

// MeninggalkanSekolahResponse for leaving school
type MeninggalkanSekolahResponse struct {
	ID                  uint      `json:"id"`
	Tipe                string    `json:"tipe"`
	Tanggal             time.Time `json:"tanggal"`
	SekolahTujuan       string    `json:"sekolah_tujuan"`
	AlamatSekolahTujuan string    `json:"alamat_sekolah_tujuan"`
	NoIjazah            string    `json:"no_ijazah"`
	Alasan              string    `json:"alasan"`
}

// PemeriksaanResponse for book inspection
type PemeriksaanResponse struct {
	ID            uint      `json:"id"`
	NoUrut        uint      `json:"no_urut"`
	Tanggal       time.Time `json:"tanggal"`
	NamaPemeriksa string    `json:"nama_pemeriksa"`
	Jabatan       string    `json:"jabatan"`
	Keterangan    string    `json:"keterangan"`
}
