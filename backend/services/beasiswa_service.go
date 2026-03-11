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

// BeasiswaService handles scholarship business logic
type BeasiswaService struct {
	siswaRepo    *repositories.SiswaRepository
	beasiswaRepo *repositories.BeasiswaRepository
}

// NewBeasiswaService creates a new BeasiswaService
func NewBeasiswaService(siswaRepo *repositories.SiswaRepository, beasiswaRepo *repositories.BeasiswaRepository) *BeasiswaService {
	return &BeasiswaService{siswaRepo: siswaRepo, beasiswaRepo: beasiswaRepo}
}

// Add adds scholarship record to a student
func (s *BeasiswaService) Add(siswaID uint, req requests.CreateBeasiswaRequest) (*responses.BeasiswaResponse, error) {
	// Validate student exists
	_, err := s.siswaRepo.FindByID(siswaID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("student not found")
		}
		return nil, err
	}

	beasiswa := &models.Beasiswa{
		SiswaID:        siswaID,
		TahunPelajaran: utils.SanitizeString(req.TahunPelajaran),
		Pemberi:        utils.SanitizeString(req.Pemberi),
		Keterangan:     utils.SanitizeString(req.Keterangan),
	}

	if err := s.beasiswaRepo.Create(beasiswa); err != nil {
		return nil, err
	}

	return s.toResponse(beasiswa), nil
}

// Update updates scholarship record
func (s *BeasiswaService) Update(id uint, req requests.CreateBeasiswaRequest) (*responses.BeasiswaResponse, error) {
	beasiswa, err := s.beasiswaRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("scholarship record not found")
		}
		return nil, err
	}

	beasiswa.TahunPelajaran = utils.SanitizeString(req.TahunPelajaran)
	beasiswa.Pemberi = utils.SanitizeString(req.Pemberi)
	beasiswa.Keterangan = utils.SanitizeString(req.Keterangan)

	if err := s.beasiswaRepo.Update(beasiswa); err != nil {
		return nil, err
	}

	return s.toResponse(beasiswa), nil
}

// Delete deletes scholarship record
func (s *BeasiswaService) Delete(id uint) error {
	// BeasiswaRepo also might missing FindByID.
	// We'll trust ID for now or check repo.
	// BeasiswaRepo in related_repository.go only showed Create, FindBySiswaID, Update, Delete.
	return s.beasiswaRepo.Delete(id)
}

// toResponse converts to DTO
func (s *BeasiswaService) toResponse(b *models.Beasiswa) *responses.BeasiswaResponse {
	return &responses.BeasiswaResponse{
		ID:             b.ID,
		TahunPelajaran: b.TahunPelajaran,
		Pemberi:        b.Pemberi,
		Keterangan:     b.Keterangan,
	}
}
