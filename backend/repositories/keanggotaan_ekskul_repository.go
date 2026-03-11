package repositories

import (
	"daftar_induk_siswa/models"

	"gorm.io/gorm"
)

// KeanggotaanEkskulRepository handles extracurricular membership database operations
type KeanggotaanEkskulRepository struct {
	db *gorm.DB
}

// NewKeanggotaanEkskulRepository creates a new repository
func NewKeanggotaanEkskulRepository(db *gorm.DB) *KeanggotaanEkskulRepository {
	return &KeanggotaanEkskulRepository{db: db}
}

// Create creates a new membership
func (r *KeanggotaanEkskulRepository) Create(data *models.KeanggotaanEkskul) error {
	return r.db.Create(data).Error
}

// FindAll finds all memberships
func (r *KeanggotaanEkskulRepository) FindAll() ([]models.KeanggotaanEkskul, error) {
	var list []models.KeanggotaanEkskul
	if err := r.db.Preload("Siswa").Preload("Siswa.Kelas").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

// FindByID finds a membership by ID
func (r *KeanggotaanEkskulRepository) FindByID(id uint) (*models.KeanggotaanEkskul, error) {
	var data models.KeanggotaanEkskul
	if err := r.db.Preload("Siswa").First(&data, id).Error; err != nil {
		return nil, err
	}
	return &data, nil
}

// Update updates a membership
func (r *KeanggotaanEkskulRepository) Update(data *models.KeanggotaanEkskul) error {
	return r.db.Save(data).Error
}

// Delete deletes a membership
func (r *KeanggotaanEkskulRepository) Delete(id uint) error {
	return r.db.Delete(&models.KeanggotaanEkskul{}, id).Error
}
