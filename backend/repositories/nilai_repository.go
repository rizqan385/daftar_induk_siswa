package repositories

import (
	"github.com/kampunk/backend/models"
	"gorm.io/gorm"
)

// MataPelajaranRepository handles subject database operations
type MataPelajaranRepository struct {
	db *gorm.DB
}

func NewMataPelajaranRepository(db *gorm.DB) *MataPelajaranRepository {
	return &MataPelajaranRepository{db: db}
}

func (r *MataPelajaranRepository) FindAll() ([]models.MataPelajaran, error) {
	var mapel []models.MataPelajaran
	if err := r.db.Where("aktif = ?", true).Order("kelompok, nama").Find(&mapel).Error; err != nil {
		return nil, err
	}
	return mapel, nil
}

func (r *MataPelajaranRepository) FindByID(id uint) (*models.MataPelajaran, error) {
	var mapel models.MataPelajaran
	if err := r.db.First(&mapel, id).Error; err != nil {
		return nil, err
	}
	return &mapel, nil
}

func (r *MataPelajaranRepository) FindByKelompok(kelompok string) ([]models.MataPelajaran, error) {
	var mapel []models.MataPelajaran
	if err := r.db.Where("kelompok = ? AND aktif = ?", kelompok, true).Find(&mapel).Error; err != nil {
		return nil, err
	}
	return mapel, nil
}

// NilaiSemesterRepository handles semester grade database operations
type NilaiSemesterRepository struct {
	db *gorm.DB
}

func NewNilaiSemesterRepository(db *gorm.DB) *NilaiSemesterRepository {
	return &NilaiSemesterRepository{db: db}
}

func (r *NilaiSemesterRepository) Create(nilai *models.NilaiSemester) error {
	return r.db.Create(nilai).Error
}

func (r *NilaiSemesterRepository) CreateBatch(nilai []models.NilaiSemester) error {
	return r.db.Create(&nilai).Error
}

func (r *NilaiSemesterRepository) FindBySiswaID(siswaID uint) ([]models.NilaiSemester, error) {
	var nilai []models.NilaiSemester
	if err := r.db.Preload("MataPelajaran").
		Where("siswa_id = ?", siswaID).
		Order("kelas, semester, mata_pelajaran_id").
		Find(&nilai).Error; err != nil {
		return nil, err
	}
	return nilai, nil
}

func (r *NilaiSemesterRepository) FindBySiswaIDPaginated(siswaID uint, filter map[string]interface{}, page, pageSize int, sortBy, sortDir string) ([]models.NilaiSemester, int64, error) {
	var nilai []models.NilaiSemester
	var total int64

	query := r.db.Model(&models.NilaiSemester{}).Preload("MataPelajaran").Where("siswa_id = ?", siswaID)

	// Apply filters
	if val, ok := filter["kelas"].(string); ok && val != "" {
		query = query.Where("kelas = ?", val)
	}
	if val, ok := filter["semester"].(uint8); ok && val > 0 {
		query = query.Where("semester = ?", val)
	}
	if val, ok := filter["tahun_pelajaran"].(string); ok && val != "" {
		query = query.Where("tahun_pelajaran = ?", val)
	}

	// Count total
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Sorting
	if sortBy == "" {
		sortBy = "kelas" // Default sort
	}
	if sortDir == "" {
		sortDir = "asc"
	}
	query = query.Order(sortBy + " " + sortDir)

	// Pagination
	offset := (page - 1) * pageSize
	if err := query.Offset(offset).Limit(pageSize).Find(&nilai).Error; err != nil {
		return nil, 0, err
	}

	return nilai, total, nil
}

func (r *NilaiSemesterRepository) FindBySiswaIDFiltered(siswaID uint, kelas string, semester uint8, tahunPelajaran string) ([]models.NilaiSemester, error) {
	var nilai []models.NilaiSemester
	query := r.db.Preload("MataPelajaran").Where("siswa_id = ?", siswaID)

	if kelas != "" {
		query = query.Where("kelas = ?", kelas)
	}
	if semester > 0 {
		query = query.Where("semester = ?", semester)
	}
	if tahunPelajaran != "" {
		query = query.Where("tahun_pelajaran = ?", tahunPelajaran)
	}

	if err := query.Order("kelas, semester, mata_pelajaran_id").Find(&nilai).Error; err != nil {
		return nil, err
	}
	return nilai, nil
}

func (r *NilaiSemesterRepository) FindByID(id uint) (*models.NilaiSemester, error) {
	var nilai models.NilaiSemester
	if err := r.db.Preload("MataPelajaran").First(&nilai, id).Error; err != nil {
		return nil, err
	}
	return &nilai, nil
}

func (r *NilaiSemesterRepository) Update(nilai *models.NilaiSemester) error {
	return r.db.Save(nilai).Error
}

func (r *NilaiSemesterRepository) Delete(id uint) error {
	return r.db.Delete(&models.NilaiSemester{}, id).Error
}

// NilaiSikapRepository handles attitude grade database operations
type NilaiSikapRepository struct {
	db *gorm.DB
}

func NewNilaiSikapRepository(db *gorm.DB) *NilaiSikapRepository {
	return &NilaiSikapRepository{db: db}
}

func (r *NilaiSikapRepository) Create(sikap *models.NilaiSikap) error {
	return r.db.Create(sikap).Error
}

func (r *NilaiSikapRepository) FindBySiswaID(siswaID uint) ([]models.NilaiSikap, error) {
	var sikap []models.NilaiSikap
	if err := r.db.Where("siswa_id = ?", siswaID).Order("kelas, semester").Find(&sikap).Error; err != nil {
		return nil, err
	}
	return sikap, nil
}

func (r *NilaiSikapRepository) Update(sikap *models.NilaiSikap) error {
	return r.db.Save(sikap).Error
}

// CatatanRepository handles semester notes database operations
type CatatanRepository struct {
	db *gorm.DB
}

func NewCatatanRepository(db *gorm.DB) *CatatanRepository {
	return &CatatanRepository{db: db}
}

func (r *CatatanRepository) Create(catatan *models.CatatanAkhirSemester) error {
	return r.db.Create(catatan).Error
}

func (r *CatatanRepository) FindBySiswaID(siswaID uint) ([]models.CatatanAkhirSemester, error) {
	var catatan []models.CatatanAkhirSemester
	if err := r.db.
		Preload("PKL").
		Preload("Ekstrakurikuler").
		Preload("PrestasiSemester").
		Preload("Ketidakhadiran").
		Where("siswa_id = ?", siswaID).
		Order("kelas, semester").
		Find(&catatan).Error; err != nil {
		return nil, err
	}
	return catatan, nil
}

func (r *CatatanRepository) FindByID(id uint) (*models.CatatanAkhirSemester, error) {
	var catatan models.CatatanAkhirSemester
	if err := r.db.
		Preload("PKL").
		Preload("Ekstrakurikuler").
		Preload("PrestasiSemester").
		Preload("Ketidakhadiran").
		First(&catatan, id).Error; err != nil {
		return nil, err
	}
	return &catatan, nil
}

func (r *CatatanRepository) AddPKL(pkl *models.PraktikKerjaLapangan) error {
	return r.db.Create(pkl).Error
}

func (r *CatatanRepository) AddEkstrakurikuler(ekskul *models.Ekstrakurikuler) error {
	return r.db.Create(ekskul).Error
}

func (r *CatatanRepository) AddPrestasiSemester(prestasi *models.PrestasiSemester) error {
	return r.db.Create(prestasi).Error
}

func (r *CatatanRepository) SetKetidakhadiran(ketidakhadiran *models.KetidakhadiranCatatan) error {
	return r.db.Save(ketidakhadiran).Error
}

// NilaiIjazahRepository handles certificate grade database operations
type NilaiIjazahRepository struct {
	db *gorm.DB
}

func NewNilaiIjazahRepository(db *gorm.DB) *NilaiIjazahRepository {
	return &NilaiIjazahRepository{db: db}
}

func (r *NilaiIjazahRepository) Create(nilai *models.NilaiIjazah) error {
	return r.db.Create(nilai).Error
}

func (r *NilaiIjazahRepository) FindBySiswaID(siswaID uint) ([]models.NilaiIjazah, error) {
	var nilai []models.NilaiIjazah
	if err := r.db.Preload("MataPelajaran").Where("siswa_id = ?", siswaID).Find(&nilai).Error; err != nil {
		return nil, err
	}
	return nilai, nil
}

func (r *NilaiIjazahRepository) Update(nilai *models.NilaiIjazah) error {
	return r.db.Save(nilai).Error
}

// MeninggalkanSekolahRepository handles leaving school database operations
type MeninggalkanSekolahRepository struct {
	db *gorm.DB
}

func NewMeninggalkanSekolahRepository(db *gorm.DB) *MeninggalkanSekolahRepository {
	return &MeninggalkanSekolahRepository{db: db}
}

func (r *MeninggalkanSekolahRepository) Create(keluar *models.MeninggalkanSekolah) error {
	return r.db.Create(keluar).Error
}

func (r *MeninggalkanSekolahRepository) FindBySiswaID(siswaID uint) (*models.MeninggalkanSekolah, error) {
	var keluar models.MeninggalkanSekolah
	if err := r.db.Where("siswa_id = ?", siswaID).First(&keluar).Error; err != nil {
		return nil, err
	}
	return &keluar, nil
}

func (r *MeninggalkanSekolahRepository) Update(keluar *models.MeninggalkanSekolah) error {
	return r.db.Save(keluar).Error
}

// PemeriksaanRepository handles book inspection database operations
type PemeriksaanRepository struct {
	db *gorm.DB
}

func NewPemeriksaanRepository(db *gorm.DB) *PemeriksaanRepository {
	return &PemeriksaanRepository{db: db}
}

func (r *PemeriksaanRepository) Create(pemeriksaan *models.PemeriksaanBuku) error {
	return r.db.Create(pemeriksaan).Error
}

func (r *PemeriksaanRepository) FindAll() ([]models.PemeriksaanBuku, error) {
	var pemeriksaan []models.PemeriksaanBuku
	if err := r.db.Order("tanggal DESC").Find(&pemeriksaan).Error; err != nil {
		return nil, err
	}
	return pemeriksaan, nil
}

func (r *PemeriksaanRepository) Update(pemeriksaan *models.PemeriksaanBuku) error {
	return r.db.Save(pemeriksaan).Error
}

func (r *PemeriksaanRepository) Delete(id uint) error {
	return r.db.Delete(&models.PemeriksaanBuku{}, id).Error
}
