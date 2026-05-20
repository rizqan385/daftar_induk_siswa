package repositories

import (
	"daftar_induk_siswa/models"
	"gorm.io/gorm"
)

// SiswaRepository handles student database operations
type SiswaRepository struct {
	db *gorm.DB
}

// NewSiswaRepository creates a new SiswaRepository
func NewSiswaRepository(db *gorm.DB) *SiswaRepository {
	return &SiswaRepository{db: db}
}

// Create creates a new student
func (r *SiswaRepository) Create(siswa *models.Siswa) error {
	return r.db.Create(siswa).Error
}

// FindByID finds a student by ID with all related data
func (r *SiswaRepository) FindByID(id uint) (*models.Siswa, error) {
	var siswa models.Siswa
	if err := r.db.First(&siswa, id).Error; err != nil {
		return nil, err
	}
	return &siswa, nil
}

// FindByIDWithRelations finds a student by ID with all related data
func (r *SiswaRepository) FindByIDWithRelations(id uint) (*models.Siswa, error) {
	var siswa models.Siswa
	if err := r.db.
		Preload("Alamat").
		Preload("OrangTua").
		Preload("Wali").
		Preload("Kesehatan").
		Preload("Kesehatan.RiwayatPenyakit").
		Preload("PendidikanSebelumnya").
		Preload("Kepribadian").
		Preload("Prestasi").
		Preload("Beasiswa").
		Preload("Kehadiran").
		Preload("NilaiSemester").
		Preload("NilaiSemester.MataPelajaran").
		Preload("NilaiSikap").
		Preload("CatatanAkhirSemester").
		Preload("CatatanAkhirSemester.PKL").
		Preload("CatatanAkhirSemester.Ekstrakurikuler").
		Preload("CatatanAkhirSemester.PrestasiSemester").
		Preload("CatatanAkhirSemester.KetidakhadiranCatatan").
		Preload("NilaiIjazah").
		Preload("NilaiIjazah.MataPelajaran").
		Preload("MeninggalkanSekolah").
		First(&siswa, id).Error; err != nil {
		return nil, err
	}
	return &siswa, nil
}

// FindByNISN finds a student by NISN
func (r *SiswaRepository) FindByNISN(nisn string) (*models.Siswa, error) {
	var siswa models.Siswa
	if err := r.db.Where("nisn = ?", nisn).First(&siswa).Error; err != nil {
		return nil, err
	}
	return &siswa, nil
}

// FindByNoInduk finds a student by school registration number
func (r *SiswaRepository) FindByNoInduk(noInduk string) (*models.Siswa, error) {
	var siswa models.Siswa
	if err := r.db.Where("no_induk = ?", noInduk).First(&siswa).Error; err != nil {
		return nil, err
	}
	return &siswa, nil
}

// FindAll finds all students with pagination
func (r *SiswaRepository) FindAll(page, pageSize int, search, sortBy, sortDir string) ([]models.Siswa, int64, error) {
	var siswa []models.Siswa
	var total int64

	query := r.db.Model(&models.Siswa{})

	// Search filter
	if search != "" {
		searchPattern := "%" + search + "%"
		query = query.Where("nama LIKE ? OR nisn LIKE ? OR no_induk LIKE ?",
			searchPattern, searchPattern, searchPattern)
	}

	// Count total
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Sorting
	if sortBy == "" {
		sortBy = "created_at"
	}
	if sortDir == "" {
		sortDir = "desc"
	}
	query = query.Order(sortBy + " " + sortDir)

	// Pagination
	offset := (page - 1) * pageSize
	if err := query.Preload("Kelas").Offset(offset).Limit(pageSize).Find(&siswa).Error; err != nil {
		return nil, 0, err
	}

	return siswa, total, nil
}

// Update updates a student
func (r *SiswaRepository) Update(siswa *models.Siswa) error {
	return r.db.Save(siswa).Error
}

// Delete soft deletes a student
func (r *SiswaRepository) Delete(id uint) error {
	return r.db.Delete(&models.Siswa{}, id).Error
}

// ExistsByNISN checks if NISN exists (including soft-deleted records)
func (r *SiswaRepository) ExistsByNISN(nisn string) (bool, error) {
	var count int64
	if err := r.db.Unscoped().Model(&models.Siswa{}).Where("nisn = ?", nisn).Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

// ExistsByNoInduk checks if school registration number exists (including soft-deleted records)
func (r *SiswaRepository) ExistsByNoInduk(noInduk string) (bool, error) {
	var count int64
	if err := r.db.Unscoped().Model(&models.Siswa{}).Where("no_induk = ?", noInduk).Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

// UpdateFotoPath updates student photo path
func (r *SiswaRepository) UpdateFotoPath(id uint, fotoPath string) error {
	return r.db.Model(&models.Siswa{}).Where("id = ?", id).Update("foto_path", fotoPath).Error
}

// UpdateStatus updates student status
func (r *SiswaRepository) UpdateStatus(id uint, status string) error {
	return r.db.Model(&models.Siswa{}).Where("id = ?", id).Update("status", status).Error
}

// AddMeninggalkanSekolah adds leaving school record
func (r *SiswaRepository) AddMeninggalkanSekolah(data *models.MeninggalkanSekolah) error {
	var existing models.MeninggalkanSekolah
	if err := r.db.Where("siswa_id = ?", data.SiswaID).First(&existing).Error; err == nil {
		data.ID = existing.ID
		return r.db.Save(data).Error
	}
	return r.db.Create(data).Error
}

// DeleteMeninggalkanSekolah deletes leaving school record
func (r *SiswaRepository) DeleteMeninggalkanSekolah(siswaID uint) error {
	return r.db.Where("siswa_id = ?", siswaID).Delete(&models.MeninggalkanSekolah{}).Error
}
