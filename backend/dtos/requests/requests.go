package requests

import "time"

// LoginRequest for user login
type LoginRequest struct {
	Username string `json:"username" binding:"required,min=3,max=50" example:"admin"`
	Password string `json:"password" binding:"required,min=6" example:"admin123"`
}

// RegisterRequest for user registration
type RegisterRequest struct {
	Username string `json:"username" binding:"required,min=3,max=50" example:"newadmin"`
	Email    string `json:"email" binding:"required,email" example:"admin@example.com"`
	Password string `json:"password" binding:"required,min=6" example:"password123"`
}

// CreateSiswaRequest for creating a student
type CreateSiswaRequest struct {
	NoInduk         string `json:"no_induk" binding:"required,max=20" example:"2024001"`
	NISN            string `json:"nisn" binding:"required,len=10" example:"0012345678"`
	NamaLengkap     string `json:"nama_lengkap" binding:"required,max=100" example:"Ahmad Syafiq"`
	NamaPanggilan   string `json:"nama_panggilan" binding:"max=50" example:"Syafiq"`
	JenisKelamin    string `json:"jenis_kelamin" binding:"required,oneof=L P" example:"L"`
	TempatLahir     string `json:"tempat_lahir" binding:"required,max=100" example:"Jakarta"`
	TanggalLahir    string `json:"tanggal_lahir" binding:"required" example:"2008-05-15"`
	Agama           string `json:"agama" binding:"required,max=20" example:"Islam"`
	AnakKe          uint   `json:"anak_ke" binding:"min=1" example:"2"`
	JumlahSaudara   uint   `json:"jumlah_saudara" example:"3"`
	Kewarganegaraan string `json:"kewarganegaraan" binding:"max=50" example:"Indonesia"`
	BahasaRumah     string `json:"bahasa_rumah" binding:"max=50" example:"Indonesia"`
}

// UpdateSiswaRequest for updating a student
type UpdateSiswaRequest struct {
	NamaLengkap     string `json:"nama_lengkap" binding:"max=100" example:"Ahmad Syafiq Updated"`
	NamaPanggilan   string `json:"nama_panggilan" binding:"max=50" example:"Syafiq"`
	JenisKelamin    string `json:"jenis_kelamin" binding:"omitempty,oneof=L P" example:"L"`
	TempatLahir     string `json:"tempat_lahir" binding:"max=100" example:"Jakarta"`
	TanggalLahir    string `json:"tanggal_lahir" example:"2008-05-15"`
	Agama           string `json:"agama" binding:"max=20" example:"Islam"`
	AnakKe          uint   `json:"anak_ke" example:"2"`
	JumlahSaudara   uint   `json:"jumlah_saudara" example:"3"`
	Kewarganegaraan string `json:"kewarganegaraan" binding:"max=50" example:"Indonesia"`
	BahasaRumah     string `json:"bahasa_rumah" binding:"max=50" example:"Indonesia"`
}

// CreateAlamatRequest for creating address
type CreateAlamatRequest struct {
	AlamatLengkap  string  `json:"alamat_lengkap" binding:"required" example:"Jl. Merdeka No. 123"`
	Kelurahan      string  `json:"kelurahan" binding:"max=100" example:"Cibiru"`
	Kecamatan      string  `json:"kecamatan" binding:"max=100" example:"Cibiru"`
	Kota           string  `json:"kota" binding:"max=100" example:"Bandung"`
	Provinsi       string  `json:"provinsi" binding:"max=100" example:"Jawa Barat"`
	KodePos        string  `json:"kode_pos" binding:"max=10" example:"40615"`
	NoTelepon      string  `json:"no_telepon" binding:"max=20" example:"081234567890"`
	TinggalDengan  string  `json:"tinggal_dengan" binding:"max=50" example:"Orang Tua"`
	JarakKeSekolah float64 `json:"jarak_ke_sekolah" example:"2.5"`
	Transportasi   string  `json:"transportasi" binding:"max=50" example:"Motor"`
}

// CreateOrangTuaRequest for creating parent
type CreateOrangTuaRequest struct {
	Tipe               string  `json:"tipe" binding:"required,oneof=ayah ibu" example:"ayah"`
	Nama               string  `json:"nama" binding:"required,max=100" example:"Budi Santoso"`
	TempatLahir        string  `json:"tempat_lahir" binding:"max=100" example:"Jakarta"`
	TanggalLahir       string  `json:"tanggal_lahir" example:"1975-03-20"`
	Kewarganegaraan    string  `json:"kewarganegaraan" binding:"max=50" example:"Indonesia"`
	PendidikanTerakhir string  `json:"pendidikan_terakhir" binding:"max=50" example:"S1"`
	Pekerjaan          string  `json:"pekerjaan" binding:"max=100" example:"Wiraswasta"`
	PenghasilanBulanan float64 `json:"penghasilan_bulanan" example:"5000000"`
	Alamat             string  `json:"alamat" example:"Jl. Merdeka No. 123"`
	NoTelepon          string  `json:"no_telepon" binding:"max=20" example:"081234567890"`
	MasihHidup         bool    `json:"masih_hidup" example:"true"`
}

// CreateWaliRequest for creating guardian
type CreateWaliRequest struct {
	Nama                string  `json:"nama" binding:"required,max=100" example:"Paman Ahmad"`
	JenisKelamin        string  `json:"jenis_kelamin" binding:"required,oneof=L P" example:"L"`
	TempatLahir         string  `json:"tempat_lahir" binding:"max=100" example:"Bandung"`
	TanggalLahir        string  `json:"tanggal_lahir" example:"1970-01-15"`
	Kewarganegaraan     string  `json:"kewarganegaraan" binding:"max=50" example:"Indonesia"`
	PendidikanTerakhir  string  `json:"pendidikan_terakhir" binding:"max=50" example:"SMA"`
	Pekerjaan           string  `json:"pekerjaan" binding:"max=100" example:"Petani"`
	PenghasilanBulanan  float64 `json:"penghasilan_bulanan" example:"3000000"`
	Alamat              string  `json:"alamat" example:"Jl. Desa No. 5"`
	NoTelepon           string  `json:"no_telepon" binding:"max=20" example:"081234567891"`
	HubunganDenganSiswa string  `json:"hubungan_dengan_siswa" binding:"max=50" example:"Paman"`
}

// CreateKesehatanRequest for creating health data
type CreateKesehatanRequest struct {
	BeratBadanMasuk    float64 `json:"berat_badan_masuk" example:"50.5"`
	TinggiBadanMasuk   float64 `json:"tinggi_badan_masuk" example:"160.0"`
	BeratBadanKeluar   float64 `json:"berat_badan_keluar" example:"55.0"`
	TinggiBadanKeluar  float64 `json:"tinggi_badan_keluar" example:"165.0"`
	GolonganDarah      string  `json:"golongan_darah" binding:"omitempty,oneof=A B AB O" example:"A"`
	KesanggupanJasmani string  `json:"kesanggupan_jasmani" example:"Baik"`
}

// CreateRiwayatPenyakitRequest for adding disease history
type CreateRiwayatPenyakitRequest struct {
	JenisPenyakit string `json:"jenis_penyakit" binding:"required,max=100" example:"Demam"`
	Tahun         uint   `json:"tahun" example:"2020"`
	LamaSakit     string `json:"lama_sakit" binding:"max=50" example:"1 Minggu"`
	Keterangan    string `json:"keterangan" example:"Sembuh total"`
}

// CreatePendidikanRequest for creating previous education
type CreatePendidikanRequest struct {
	Tipe            string `json:"tipe" binding:"required,oneof=siswa_baru pindahan" example:"siswa_baru"`
	TanggalDiterima string `json:"tanggal_diterima" binding:"required" example:"2024-07-15"`
	AsalSekolah     string `json:"asal_sekolah" binding:"required,max=200" example:"SMP Negeri 1 Bandung"`
	AlamatSekolah   string `json:"alamat_sekolah" example:"Jl. Pendidikan No. 1"`
	NoIjazah        string `json:"no_ijazah" binding:"max=50" example:"DN-01/MI-2024"`
	TanggalIjazah   string `json:"tanggal_ijazah" example:"2024-06-10"`
	NoSKHUN         string `json:"no_skhun" binding:"max=50" example:"DN-01/SK-2024"`
	TanggalSKHUN    string `json:"tanggal_skhun" example:"2024-06-10"`
	KelasDiterima   string `json:"kelas_diterima" binding:"required,oneof=X XI XII" example:"X"`
	AlasanPindah    string `json:"alasan_pindah" example:""`
}

// CreateKepribadianRequest for creating personality assessment
type CreateKepribadianRequest struct {
	Aspek          string `json:"aspek" binding:"required,max=100" example:"Disiplin/Ketertiban"`
	Nilai          string `json:"nilai" binding:"required,oneof=Baik Cukup Kurang" example:"Baik"`
	TahunPelajaran string `json:"tahun_pelajaran" binding:"max=20" example:"2024/2025"`
}

// CreatePrestasiRequest for creating achievement
type CreatePrestasiRequest struct {
	Bidang     string `json:"bidang" binding:"required,oneof=Kesenian Olahraga Kemasyarakatan Pramuka 'Karya Tulis' Lainnya" example:"Olahraga"`
	Keterangan string `json:"keterangan" example:"Juara 1 Lomba Lari"`
	Tahun      uint   `json:"tahun" example:"2024"`
	Tingkat    string `json:"tingkat" binding:"oneof=Sekolah Kecamatan Kota Provinsi Nasional Internasional" example:"Kota"`
}

// CreateBeasiswaRequest for creating scholarship
type CreateBeasiswaRequest struct {
	TahunPelajaran string `json:"tahun_pelajaran" binding:"required,max=20" example:"2024/2025"`
	Pemberi        string `json:"pemberi" binding:"required,max=100" example:"Pemerintah"`
	Keterangan     string `json:"keterangan" example:"Beasiswa prestasi akademik"`
}

// CreateKehadiranRequest for creating attendance
type CreateKehadiranRequest struct {
	Kelas             string  `json:"kelas" binding:"required,oneof=X XI XII" example:"X"`
	Semester          uint8   `json:"semester" binding:"required,min=1,max=2" example:"1"`
	JumlahHadir       uint    `json:"jumlah_hadir" example:"90"`
	PersentaseHadir   float64 `json:"persentase_hadir" example:"95.5"`
	JumlahSakit       uint    `json:"jumlah_sakit" example:"3"`
	JumlahIzin        uint    `json:"jumlah_izin" example:"2"`
	JumlahAlpa        uint    `json:"jumlah_alpa" example:"0"`
	JumlahHariEfektif uint    `json:"jumlah_hari_efektif" example:"95"`
}

// CreateNilaiSemesterRequest for creating semester grade
type CreateNilaiSemesterRequest struct {
	MataPelajaranID       uint   `json:"mata_pelajaran_id" binding:"required" example:"1"`
	Kelas                 string `json:"kelas" binding:"required,oneof=X XI XII" example:"X"`
	Semester              uint8  `json:"semester" binding:"required,min=1,max=2" example:"1"`
	TahunPelajaran        string `json:"tahun_pelajaran" binding:"required,max=20" example:"2024/2025"`
	NilaiPengetahuan      uint   `json:"nilai_pengetahuan" binding:"max=100" example:"85"`
	PredikatPengetahuan   string `json:"predikat_pengetahuan" binding:"omitempty,oneof=A B C D" example:"B"`
	DeskripsiPengetahuan  string `json:"deskripsi_pengetahuan" example:"Baik dalam memahami materi"`
	NilaiKeterampilan     uint   `json:"nilai_keterampilan" binding:"max=100" example:"88"`
	PredikatKeterampilan  string `json:"predikat_keterampilan" binding:"omitempty,oneof=A B C D" example:"B"`
	DeskripsiKeterampilan string `json:"deskripsi_keterampilan" example:"Mampu menerapkan dengan baik"`
}

// BatchNilaiSemesterRequest for bulk creating semester grades
type BatchNilaiSemesterRequest struct {
	Nilai []CreateNilaiSemesterRequest `json:"nilai" binding:"required,dive"`
}

// CreateNilaiSikapRequest for creating attitude grade
type CreateNilaiSikapRequest struct {
	Kelas              string `json:"kelas" binding:"required,oneof=X XI XII" example:"X"`
	Semester           uint8  `json:"semester" binding:"required,min=1,max=2" example:"1"`
	DeskripsiSpiritual string `json:"deskripsi_spiritual" example:"Taat beribadah"`
	DeskripsiSosial    string `json:"deskripsi_sosial" example:"Aktif dalam kegiatan sosial"`
}

// CreateCatatanSemesterRequest for creating semester notes
type CreateCatatanSemesterRequest struct {
	Kelas    string `json:"kelas" binding:"required,oneof=X XI XII" example:"X"`
	Semester uint8  `json:"semester" binding:"required,min=1,max=2" example:"1"`
}

// CreatePKLRequest for creating internship
type CreatePKLRequest struct {
	NamaDUDI   string `json:"nama_dudi" binding:"required,max=200" example:"PT. Teknologi Indonesia"`
	Lokasi     string `json:"lokasi" binding:"max=200" example:"Bandung"`
	LamaBulan  uint   `json:"lama_bulan" example:"3"`
	Keterangan string `json:"keterangan" example:"Praktek sebagai teknisi jaringan"`
}

// CreateEkstrakurikulerRequest for creating extracurricular
type CreateEkstrakurikulerRequest struct {
	NamaKegiatan string `json:"nama_kegiatan" binding:"required,max=100" example:"Kepramukaan"`
	Keterangan   string `json:"keterangan" example:"Aktif"`
}

// CreateNilaiIjazahRequest for creating certificate grade
type CreateNilaiIjazahRequest struct {
	MataPelajaranID uint   `json:"mata_pelajaran_id" binding:"required" example:"1"`
	NilaiAkhir      uint   `json:"nilai_akhir" binding:"required,max=100" example:"85"`
	TahunLulus      string `json:"tahun_lulus" binding:"max=10" example:"2027"`
	NoIjazah        string `json:"no_ijazah" binding:"max=50" example:"DN-01/IJ-2027"`
	TanggalLulus    string `json:"tanggal_lulus" example:"2027-06-15"`
}

// CreateMeninggalkanSekolahRequest for creating leaving school record
type CreateMeninggalkanSekolahRequest struct {
	Tipe                string `json:"tipe" binding:"required,oneof=tamat pindah putus" example:"tamat"`
	Tanggal             string `json:"tanggal" binding:"required" example:"2027-06-15"`
	SekolahTujuan       string `json:"sekolah_tujuan" binding:"max=200" example:"Universitas Indonesia"`
	AlamatSekolahTujuan string `json:"alamat_sekolah_tujuan" example:"Depok, Jawa Barat"`
	NoIjazah            string `json:"no_ijazah" binding:"max=50" example:"DN-01/IJ-2027"`
	Alasan              string `json:"alasan" example:"Melanjutkan studi"`
}

// CreatePemeriksaanRequest for creating book inspection
type CreatePemeriksaanRequest struct {
	NoUrut        uint      `json:"no_urut" binding:"required" example:"1"`
	Tanggal       time.Time `json:"tanggal" binding:"required" example:"2024-01-15"`
	NamaPemeriksa string    `json:"nama_pemeriksa" binding:"required,max=100" example:"Kepala Sekolah"`
	Jabatan       string    `json:"jabatan" binding:"max=100" example:"Kepala Sekolah"`
	Keterangan    string    `json:"keterangan" example:"Pemeriksaan rutin semester ganjil"`
}

// Pagination request params
type PaginationRequest struct {
	Page     int    `form:"page" json:"page"`
	PageSize int    `form:"page_size" json:"page_size"`
	Search   string `form:"search" json:"search"`
	SortBy   string `form:"sort_by" json:"sort_by"`
	SortDir  string `form:"sort_dir" binding:"omitempty,oneof=asc desc" json:"sort_dir"`
}

// NilaiFilterRequest for filtering grades
type NilaiFilterRequest struct {
	Kelas          string `form:"kelas" binding:"omitempty,oneof=X XI XII"`
	Semester       uint8  `form:"semester" binding:"omitempty,min=1,max=2"`
	TahunPelajaran string `form:"tahun_pelajaran"`
}

// UpdateOrangTuaRequest for updating parent
type UpdateOrangTuaRequest struct {
	Tipe               string  `json:"tipe" binding:"omitempty,oneof=ayah ibu" example:"ayah"`
	Nama               string  `json:"nama" binding:"omitempty,max=100" example:"Budi Santoso"`
	TempatLahir        string  `json:"tempat_lahir" binding:"max=100" example:"Jakarta"`
	TanggalLahir       string  `json:"tanggal_lahir" example:"1975-03-20"`
	Kewarganegaraan    string  `json:"kewarganegaraan" binding:"max=50" example:"Indonesia"`
	PendidikanTerakhir string  `json:"pendidikan_terakhir" binding:"max=50" example:"S1"`
	Pekerjaan          string  `json:"pekerjaan" binding:"max=100" example:"Wiraswasta"`
	PenghasilanBulanan float64 `json:"penghasilan_bulanan" example:"5000000"`
	Alamat             string  `json:"alamat" example:"Jl. Merdeka No. 123"`
	NoTelepon          string  `json:"no_telepon" binding:"max=20" example:"081234567890"`
	MasihHidup         *bool   `json:"masih_hidup" example:"true"`
}

// UpdateWaliRequest for updating guardian
type UpdateWaliRequest struct {
	Nama                string  `json:"nama" binding:"omitempty,max=100" example:"Paman Ahmad"`
	JenisKelamin        string  `json:"jenis_kelamin" binding:"omitempty,oneof=L P" example:"L"`
	TempatLahir         string  `json:"tempat_lahir" binding:"max=100" example:"Bandung"`
	TanggalLahir        string  `json:"tanggal_lahir" example:"1970-01-15"`
	Kewarganegaraan     string  `json:"kewarganegaraan" binding:"max=50" example:"Indonesia"`
	PendidikanTerakhir  string  `json:"pendidikan_terakhir" binding:"max=50" example:"SMA"`
	Pekerjaan           string  `json:"pekerjaan" binding:"max=100" example:"Petani"`
	PenghasilanBulanan  float64 `json:"penghasilan_bulanan" example:"3000000"`
	Alamat              string  `json:"alamat" example:"Jl. Desa No. 5"`
	NoTelepon           string  `json:"no_telepon" binding:"max=20" example:"081234567891"`
	HubunganDenganSiswa string  `json:"hubungan_dengan_siswa" binding:"max=50" example:"Paman"`
}

// UpdateKesehatanRequest for updating health data
type UpdateKesehatanRequest struct {
	BeratBadanMasuk    float64 `json:"berat_badan_masuk" example:"50.5"`
	TinggiBadanMasuk   float64 `json:"tinggi_badan_masuk" example:"160.0"`
	BeratBadanKeluar   float64 `json:"berat_badan_keluar" example:"55.0"`
	TinggiBadanKeluar  float64 `json:"tinggi_badan_keluar" example:"165.0"`
	GolonganDarah      string  `json:"golongan_darah" binding:"omitempty,oneof=A B AB O" example:"A"`
	KesanggupanJasmani string  `json:"kesanggupan_jasmani" example:"Baik"`
}

// UpdatePendidikanRequest for updating previous education
type UpdatePendidikanRequest struct {
	Tipe            string `json:"tipe" binding:"omitempty,oneof=siswa_baru pindahan" example:"siswa_baru"`
	TanggalDiterima string `json:"tanggal_diterima" example:"2024-07-15"`
	AsalSekolah     string `json:"asal_sekolah" binding:"omitempty,max=200" example:"SMP Negeri 1 Bandung"`
	AlamatSekolah   string `json:"alamat_sekolah" example:"Jl. Pendidikan No. 1"`
	NoIjazah        string `json:"no_ijazah" binding:"max=50" example:"DN-01/MI-2024"`
	TanggalIjazah   string `json:"tanggal_ijazah" example:"2024-06-10"`
	NoSKHUN         string `json:"no_skhun" binding:"max=50" example:"DN-01/SK-2024"`
	TanggalSKHUN    string `json:"tanggal_skhun" example:"2024-06-10"`
	KelasDiterima   string `json:"kelas_diterima" binding:"omitempty,oneof=X XI XII" example:"X"`
	AlasanPindah    string `json:"alasan_pindah" example:""`
}

// UpdateAlamatRequest for updating address
type UpdateAlamatRequest struct {
	AlamatLengkap  string  `json:"alamat_lengkap" example:"Jl. Merdeka No. 123"`
	Kelurahan      string  `json:"kelurahan" binding:"max=100" example:"Cibiru"`
	Kecamatan      string  `json:"kecamatan" binding:"max=100" example:"Cibiru"`
	Kota           string  `json:"kota" binding:"max=100" example:"Bandung"`
	Provinsi       string  `json:"provinsi" binding:"max=100" example:"Jawa Barat"`
	KodePos        string  `json:"kode_pos" binding:"max=10" example:"40615"`
	NoTelepon      string  `json:"no_telepon" binding:"max=20" example:"081234567890"`
	TinggalDengan  string  `json:"tinggal_dengan" binding:"max=50" example:"Orang Tua"`
	JarakKeSekolah float64 `json:"jarak_ke_sekolah" example:"2.5"`
	Transportasi   string  `json:"transportasi" binding:"max=50" example:"Motor"`
}
