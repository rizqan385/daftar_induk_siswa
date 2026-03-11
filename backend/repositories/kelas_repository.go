package repositories

import (
	"daftar_induk_siswa/models"
	"gorm.io/gorm"
)

type KelasRepository struct {
	db *gorm.DB
}

func NewKelasRepository(db *gorm.DB) *KelasRepository {
	return &KelasRepository{db: db}
}

func (r *KelasRepository) FindAll() ([]models.Kelas, error) {
	var kelasList []models.Kelas
	if err := r.db.Order("tingkat ASC, jurusan ASC").Find(&kelasList).Error; err != nil {
		return nil, err
	}
	return kelasList, nil
}

func (r *KelasRepository) FindByID(id uint) (*models.Kelas, error) {
	var kelas models.Kelas
	if err := r.db.First(&kelas, id).Error; err != nil {
		return nil, err
	}
	return &kelas, nil
}

func (r *KelasRepository) FindByName(name string) (*models.Kelas, error) {
	var kelas models.Kelas
	if err := r.db.Where("nama = ?", name).First(&kelas).Error; err != nil {
		return nil, err
	}
	return &kelas, nil
}

func (r *KelasRepository) Create(kelas *models.Kelas) error {
	return r.db.Create(kelas).Error
}

func (r *KelasRepository) Update(kelas *models.Kelas) error {
	return r.db.Save(kelas).Error
}

func (r *KelasRepository) Delete(id uint) error {
	return r.db.Delete(&models.Kelas{}, id).Error
}

func (r *KelasRepository) CountSiswaByKelas() ([]map[string]interface{}, error) {
	var results []map[string]interface{}
	r.db.Raw(`
		SELECT k.id, k.nama, k.tingkat, k.jurusan, COUNT(s.id) as jumlah_siswa
		FROM kelas k
		LEFT JOIN siswa s ON s.kelas_id = k.id AND s.deleted_at IS NULL
		GROUP BY k.id, k.nama, k.tingkat, k.jurusan
		ORDER BY k.tingkat, k.jurusan
	`).Scan(&results)
	return results, nil
}
