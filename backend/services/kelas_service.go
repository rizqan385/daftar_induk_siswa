package services

import (
	"daftar_induk_siswa/models"
	"daftar_induk_siswa/repositories"
	"errors"
	"gorm.io/gorm"
)

type KelasService struct {
	kelasRepo *repositories.KelasRepository
}

func NewKelasService(kelasRepo *repositories.KelasRepository) *KelasService {
	return &KelasService{kelasRepo: kelasRepo}
}

func (s *KelasService) FindAll() ([]models.Kelas, error) {
	return s.kelasRepo.FindAll()
}

func (s *KelasService) FindByID(id uint) (*models.Kelas, error) {
	kelas, err := s.kelasRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("kelas not found")
		}
		return nil, err
	}
	return kelas, nil
}

func (s *KelasService) Create(kelas *models.Kelas) error {
	return s.kelasRepo.Create(kelas)
}

func (s *KelasService) Update(id uint, data *models.Kelas) (*models.Kelas, error) {
	kelas, err := s.kelasRepo.FindByID(id)
	if err != nil {
		return nil, errors.New("kelas not found")
	}
	kelas.Nama = data.Nama
	kelas.Tingkat = data.Tingkat
	kelas.Jurusan = data.Jurusan
	kelas.TahunPelajaran = data.TahunPelajaran
	kelas.WaliKelas = data.WaliKelas
	if err := s.kelasRepo.Update(kelas); err != nil {
		return nil, err
	}
	return kelas, nil
}

func (s *KelasService) Delete(id uint) error {
	return s.kelasRepo.Delete(id)
}
