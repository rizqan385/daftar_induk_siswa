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

// KepribadianService handles personality business logic
type KepribadianService struct {
	siswaRepo       *repositories.SiswaRepository
	kepribadianRepo *repositories.KepribadianRepository
}

// NewKepribadianService creates a new KepribadianService
func NewKepribadianService(siswaRepo *repositories.SiswaRepository, kepribadianRepo *repositories.KepribadianRepository) *KepribadianService {
	return &KepribadianService{siswaRepo: siswaRepo, kepribadianRepo: kepribadianRepo}
}

// Add adds personality record to a student
func (s *KepribadianService) Add(siswaID uint, req requests.CreateKepribadianRequest) (*responses.KepribadianResponse, error) {
	// Validate student exists
	_, err := s.siswaRepo.FindByID(siswaID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("student not found")
		}
		return nil, err
	}

	kepribadian := &models.Kepribadian{
		SiswaID:        siswaID,
		Aspek:          utils.SanitizeString(req.Aspek),
		Nilai:          req.Nilai,
		TahunPelajaran: utils.SanitizeString(req.TahunPelajaran),
	}

	if err := s.kepribadianRepo.Create(kepribadian); err != nil {
		return nil, err
	}

	return s.toResponse(kepribadian), nil
}

// Delete deletes personality record
func (s *KepribadianService) Delete(id uint) error {
	// Currently repo doesn't have FindByID, so we trust ID exists or handle error from Delete
	// But standard practice is to check existence.
	// I should probably add FindByID to KepribadianRepo too.
	return s.kepribadianRepo.Delete(id)
}

// toResponse converts to DTO
func (s *KepribadianService) toResponse(k *models.Kepribadian) *responses.KepribadianResponse {
	return &responses.KepribadianResponse{
		ID:             k.ID,
		Aspek:          k.Aspek,
		Nilai:          k.Nilai,
		TahunPelajaran: k.TahunPelajaran,
	}
}
