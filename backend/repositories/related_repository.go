package repositories

import (
	"daftar_induk_siswa/models"
	"gorm.io/gorm"
)

// AlamatRepository handles address database operations
type AlamatRepository struct {
	db *gorm.DB
}

func NewAlamatRepository(db *gorm.DB) *AlamatRepository {
	return &AlamatRepository{db: db}
}

func (r *AlamatRepository) Create(alamat *models.AlamatSiswa) error {
	return r.db.Create(alamat).Error
}

func (r *AlamatRepository) FindBySiswaID(siswaID uint) (*models.AlamatSiswa, error) {
	var alamat models.AlamatSiswa
	if err := r.db.Where("siswa_id = ?", siswaID).First(&alamat).Error; err != nil {
		return nil, err
	}
	return &alamat, nil
}

func (r *AlamatRepository) Update(alamat *models.AlamatSiswa) error {
	return r.db.Save(alamat).Error
}

func (r *AlamatRepository) Delete(id uint) error {
	return r.db.Delete(&models.AlamatSiswa{}, id).Error
}

// OrangTuaRepository handles parent database operations
type OrangTuaRepository struct {
	db *gorm.DB
}

func NewOrangTuaRepository(db *gorm.DB) *OrangTuaRepository {
	return &OrangTuaRepository{db: db}
}

func (r *OrangTuaRepository) Create(orangTua *models.OrangTua) error {
	return r.db.Create(orangTua).Error
}

func (r *OrangTuaRepository) FindBySiswaID(siswaID uint) ([]models.OrangTua, error) {
	var orangTua []models.OrangTua
	if err := r.db.Where("siswa_id = ?", siswaID).Find(&orangTua).Error; err != nil {
		return nil, err
	}
	return orangTua, nil
}

func (r *OrangTuaRepository) FindByID(id uint) (*models.OrangTua, error) {
	var orangTua models.OrangTua
	if err := r.db.First(&orangTua, id).Error; err != nil {
		return nil, err
	}
	return &orangTua, nil
}

func (r *OrangTuaRepository) Update(orangTua *models.OrangTua) error {
	return r.db.Save(orangTua).Error
}

func (r *OrangTuaRepository) Delete(id uint) error {
	return r.db.Delete(&models.OrangTua{}, id).Error
}

// WaliRepository handles guardian database operations
type WaliRepository struct {
	db *gorm.DB
}

func NewWaliRepository(db *gorm.DB) *WaliRepository {
	return &WaliRepository{db: db}
}

func (r *WaliRepository) Create(wali *models.Wali) error {
	return r.db.Create(wali).Error
}

func (r *WaliRepository) FindBySiswaID(siswaID uint) (*models.Wali, error) {
	var wali models.Wali
	if err := r.db.Where("siswa_id = ?", siswaID).First(&wali).Error; err != nil {
		return nil, err
	}
	return &wali, nil
}

func (r *WaliRepository) FindByID(id uint) (*models.Wali, error) {
	var wali models.Wali
	if err := r.db.First(&wali, id).Error; err != nil {
		return nil, err
	}
	return &wali, nil
}

func (r *WaliRepository) Update(wali *models.Wali) error {
	return r.db.Save(wali).Error
}

func (r *WaliRepository) Delete(id uint) error {
	return r.db.Delete(&models.Wali{}, id).Error
}

// KesehatanRepository handles health database operations
type KesehatanRepository struct {
	db *gorm.DB
}

func NewKesehatanRepository(db *gorm.DB) *KesehatanRepository {
	return &KesehatanRepository{db: db}
}

func (r *KesehatanRepository) Create(kesehatan *models.KesehatanSiswa) error {
	return r.db.Create(kesehatan).Error
}

func (r *KesehatanRepository) FindBySiswaID(siswaID uint) (*models.KesehatanSiswa, error) {
	var kesehatan models.KesehatanSiswa
	if err := r.db.Preload("RiwayatPenyakit").Where("siswa_id = ?", siswaID).First(&kesehatan).Error; err != nil {
		return nil, err
	}
	return &kesehatan, nil
}

func (r *KesehatanRepository) FindByID(id uint) (*models.KesehatanSiswa, error) {
	var kesehatan models.KesehatanSiswa
	if err := r.db.Preload("RiwayatPenyakit").First(&kesehatan, id).Error; err != nil {
		return nil, err
	}
	return &kesehatan, nil
}

func (r *KesehatanRepository) Update(kesehatan *models.KesehatanSiswa) error {
	return r.db.Save(kesehatan).Error
}

func (r *KesehatanRepository) AddRiwayatPenyakit(penyakit *models.RiwayatPenyakit) error {
	return r.db.Create(penyakit).Error
}

func (r *KesehatanRepository) DeleteRiwayatPenyakit(id uint) error {
	return r.db.Delete(&models.RiwayatPenyakit{}, id).Error
}

// PendidikanRepository handles previous education database operations
type PendidikanRepository struct {
	db *gorm.DB
}

func NewPendidikanRepository(db *gorm.DB) *PendidikanRepository {
	return &PendidikanRepository{db: db}
}

func (r *PendidikanRepository) Create(pendidikan *models.PendidikanSebelumnya) error {
	return r.db.Create(pendidikan).Error
}

func (r *PendidikanRepository) FindBySiswaID(siswaID uint) ([]models.PendidikanSebelumnya, error) {
	var pendidikan []models.PendidikanSebelumnya
	if err := r.db.Where("siswa_id = ?", siswaID).Find(&pendidikan).Error; err != nil {
		return nil, err
	}
	return pendidikan, nil
}

func (r *PendidikanRepository) FindByID(id uint) (*models.PendidikanSebelumnya, error) {
	var pendidikan models.PendidikanSebelumnya
	if err := r.db.First(&pendidikan, id).Error; err != nil {
		return nil, err
	}
	return &pendidikan, nil
}

func (r *PendidikanRepository) Update(pendidikan *models.PendidikanSebelumnya) error {
	return r.db.Save(pendidikan).Error
}

func (r *PendidikanRepository) Delete(id uint) error {
	return r.db.Delete(&models.PendidikanSebelumnya{}, id).Error
}

// KepribadianRepository handles personality database operations
type KepribadianRepository struct {
	db *gorm.DB
}

func NewKepribadianRepository(db *gorm.DB) *KepribadianRepository {
	return &KepribadianRepository{db: db}
}

func (r *KepribadianRepository) Create(kepribadian *models.Kepribadian) error {
	return r.db.Create(kepribadian).Error
}

func (r *KepribadianRepository) FindBySiswaID(siswaID uint) ([]models.Kepribadian, error) {
	var kepribadian []models.Kepribadian
	if err := r.db.Where("siswa_id = ?", siswaID).Find(&kepribadian).Error; err != nil {
		return nil, err
	}
	return kepribadian, nil
}

func (r *KepribadianRepository) Update(kepribadian *models.Kepribadian) error {
	return r.db.Save(kepribadian).Error
}

func (r *KepribadianRepository) Delete(id uint) error {
	return r.db.Delete(&models.Kepribadian{}, id).Error
}

// PrestasiRepository handles achievement database operations
type PrestasiRepository struct {
	db *gorm.DB
}

func NewPrestasiRepository(db *gorm.DB) *PrestasiRepository {
	return &PrestasiRepository{db: db}
}

func (r *PrestasiRepository) Create(prestasi *models.Prestasi) error {
	return r.db.Create(prestasi).Error
}

func (r *PrestasiRepository) FindBySiswaID(siswaID uint) ([]models.Prestasi, error) {
	var prestasi []models.Prestasi
	if err := r.db.Where("siswa_id = ?", siswaID).Find(&prestasi).Error; err != nil {
		return nil, err
	}
	return prestasi, nil
}

func (r *PrestasiRepository) FindByID(id uint) (*models.Prestasi, error) {
	var prestasi models.Prestasi
	if err := r.db.First(&prestasi, id).Error; err != nil {
		return nil, err
	}
	return &prestasi, nil
}

func (r *PrestasiRepository) Update(prestasi *models.Prestasi) error {
	return r.db.Save(prestasi).Error
}

func (r *PrestasiRepository) Delete(id uint) error {
	return r.db.Delete(&models.Prestasi{}, id).Error
}

// BeasiswaRepository handles scholarship database operations
type BeasiswaRepository struct {
	db *gorm.DB
}

func NewBeasiswaRepository(db *gorm.DB) *BeasiswaRepository {
	return &BeasiswaRepository{db: db}
}

func (r *BeasiswaRepository) Create(beasiswa *models.Beasiswa) error {
	return r.db.Create(beasiswa).Error
}

func (r *BeasiswaRepository) FindBySiswaID(siswaID uint) ([]models.Beasiswa, error) {
	var beasiswa []models.Beasiswa
	if err := r.db.Where("siswa_id = ?", siswaID).Find(&beasiswa).Error; err != nil {
		return nil, err
	}
	return beasiswa, nil
}

func (r *BeasiswaRepository) Update(beasiswa *models.Beasiswa) error {
	return r.db.Save(beasiswa).Error
}

func (r *BeasiswaRepository) Delete(id uint) error {
	return r.db.Delete(&models.Beasiswa{}, id).Error
}

// KehadiranRepository handles attendance database operations
type KehadiranRepository struct {
	db *gorm.DB
}

func NewKehadiranRepository(db *gorm.DB) *KehadiranRepository {
	return &KehadiranRepository{db: db}
}

func (r *KehadiranRepository) Create(kehadiran *models.Kehadiran) error {
	return r.db.Create(kehadiran).Error
}

func (r *KehadiranRepository) FindBySiswaIDPaginated(siswaID uint, page, pageSize int) ([]models.Kehadiran, int64, error) {
	var kehadiran []models.Kehadiran
	var total int64

	query := r.db.Model(&models.Kehadiran{}).Where("siswa_id = ?", siswaID)

	// Count total
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Pagination
	offset := (page - 1) * pageSize
	if err := query.Order("kelas ASC, semester ASC").Offset(offset).Limit(pageSize).Find(&kehadiran).Error; err != nil {
		return nil, 0, err
	}

	return kehadiran, total, nil
}

func (r *KehadiranRepository) FindBySiswaID(siswaID uint) ([]models.Kehadiran, error) {
	var kehadiran []models.Kehadiran
	if err := r.db.Where("siswa_id = ?", siswaID).Order("kelas, semester").Find(&kehadiran).Error; err != nil {
		return nil, err
	}
	return kehadiran, nil
}

func (r *KehadiranRepository) FindBySiswaIDAndKelas(siswaID uint, kelas string, semester uint8) (*models.Kehadiran, error) {
	var kehadiran models.Kehadiran
	if err := r.db.Where("siswa_id = ? AND kelas = ? AND semester = ?", siswaID, kelas, semester).First(&kehadiran).Error; err != nil {
		return nil, err
	}
	return &kehadiran, nil
}

func (r *KehadiranRepository) Update(kehadiran *models.Kehadiran) error {
	return r.db.Save(kehadiran).Error
}

func (r *KehadiranRepository) Delete(id uint) error {
	return r.db.Delete(&models.Kehadiran{}, id).Error
}
