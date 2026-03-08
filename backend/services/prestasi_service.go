package services

import (
	"errors"

	"daftar_induk_siswa/dtos/requests"
	"daftar_induk_siswa/dtos/responses"
	"daftar_induk_siswa/models"
	"daftar_induk_siswa/repositories"
	"daftar_induk_siswa/utils"
	"gorm.io/gorm"
)

// PrestasiService handles achievement business logic
type PrestasiService struct {
	siswaRepo    *repositories.SiswaRepository
	prestasiRepo *repositories.PrestasiRepository
}

// NewPrestasiService creates a new PrestasiService
func NewPrestasiService(siswaRepo *repositories.SiswaRepository, prestasiRepo *repositories.PrestasiRepository) *PrestasiService {
	return &PrestasiService{siswaRepo: siswaRepo, prestasiRepo: prestasiRepo}
}

// Add adds achievement record to a student
func (s *PrestasiService) Add(siswaID uint, req requests.CreatePrestasiRequest) (*responses.PrestasiResponse, error) {
	// Validate student exists
	_, err := s.siswaRepo.FindByID(siswaID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("student not found")
		}
		return nil, err
	}

	prestasi := &models.Prestasi{
		SiswaID:    siswaID,
		Bidang:     utils.SanitizeString(req.Bidang),
		Keterangan: utils.SanitizeString(req.Keterangan),
		Tahun:      req.Tahun,
		Tingkat:    utils.SanitizeString(req.Tingkat),
	}

	if err := s.prestasiRepo.Create(prestasi); err != nil {
		return nil, err
	}

	return s.toResponse(prestasi), nil
}

// Delete deletes achievement record
func (s *PrestasiService) Delete(id uint) error {
	_, err := s.prestasiRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("achievement not found")
		}
		return err
	}

	return s.prestasiRepo.Delete(id)
}

// toResponse converts to DTO
func (s *PrestasiService) toResponse(p *models.Prestasi) *responses.PrestasiResponse {
	return &responses.PrestasiResponse{
		ID:         p.ID,
		Bidang:     p.Bidang,
		Keterangan: p.Keterangan,
		Tahun:      p.Tahun,
		Tingkat:    p.Tingkat,
	}
}
