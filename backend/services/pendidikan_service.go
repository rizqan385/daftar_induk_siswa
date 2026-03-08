package services

import (
	"errors"
	"time"

	"daftar_induk_siswa/dtos/requests"
	"daftar_induk_siswa/dtos/responses"
	"daftar_induk_siswa/models"
	"daftar_induk_siswa/repositories"
	"daftar_induk_siswa/utils"
	"gorm.io/gorm"
)

// PendidikanService handles education history business logic
type PendidikanService struct {
	siswaRepo      *repositories.SiswaRepository
	pendidikanRepo *repositories.PendidikanRepository
}

// NewPendidikanService creates a new PendidikanService
func NewPendidikanService(siswaRepo *repositories.SiswaRepository, pendidikanRepo *repositories.PendidikanRepository) *PendidikanService {
	return &PendidikanService{siswaRepo: siswaRepo, pendidikanRepo: pendidikanRepo}
}

// Add adds previous education to a student
func (s *PendidikanService) Add(siswaID uint, req requests.CreatePendidikanRequest) (*responses.PendidikanResponse, error) {
	// Validate student exists
	_, err := s.siswaRepo.FindByID(siswaID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("student not found")
		}
		return nil, err
	}

	// Parse dates
	tanggalDiterima, err := time.Parse("2006-01-02", req.TanggalDiterima)
	if err != nil {
		return nil, errors.New("invalid date format for tanggal_diterima, use YYYY-MM-DD")
	}

	var tanggalIjazah *time.Time
	if req.TanggalIjazah != "" {
		parsed, err := time.Parse("2006-01-02", req.TanggalIjazah)
		if err != nil {
			return nil, errors.New("invalid date format for tanggal_ijazah")
		}
		tanggalIjazah = &parsed
	}

	var tanggalSKHUN *time.Time
	if req.TanggalSKHUN != "" {
		parsed, err := time.Parse("2006-01-02", req.TanggalSKHUN)
		if err != nil {
			return nil, errors.New("invalid date format for tanggal_skhun")
		}
		tanggalSKHUN = &parsed
	}

	pendidikan := &models.PendidikanSebelumnya{
		SiswaID:         siswaID,
		Tipe:            req.Tipe,
		TanggalDiterima: tanggalDiterima,
		AsalSekolah:     utils.SanitizeString(req.AsalSekolah),
		AlamatSekolah:   utils.SanitizeString(req.AlamatSekolah),
		NoIjazah:        utils.SanitizeString(req.NoIjazah),
		TanggalIjazah:   tanggalIjazah,
		NoSKHUN:         utils.SanitizeString(req.NoSKHUN),
		TanggalSKHUN:    tanggalSKHUN,
		KelasDiterima:   req.KelasDiterima,
		AlasanPindah:    utils.SanitizeString(req.AlasanPindah),
	}

	if err := s.pendidikanRepo.Create(pendidikan); err != nil {
		return nil, err
	}

	return s.toResponse(pendidikan), nil
}

// Update updates previous education
func (s *PendidikanService) Update(id uint, req requests.UpdatePendidikanRequest) (*responses.PendidikanResponse, error) {
	pendidikan, err := s.pendidikanRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("education record not found")
		}
		return nil, err
	}

	if req.Tipe != "" {
		pendidikan.Tipe = req.Tipe
	}
	if req.TanggalDiterima != "" {
		parsed, err := time.Parse("2006-01-02", req.TanggalDiterima)
		if err != nil {
			return nil, errors.New("invalid date format for tanggal_diterima")
		}
		pendidikan.TanggalDiterima = parsed
	}
	if req.AsalSekolah != "" {
		pendidikan.AsalSekolah = utils.SanitizeString(req.AsalSekolah)
	}
	if req.AlamatSekolah != "" {
		pendidikan.AlamatSekolah = utils.SanitizeString(req.AlamatSekolah)
	}
	if req.NoIjazah != "" {
		pendidikan.NoIjazah = utils.SanitizeString(req.NoIjazah)
	}
	if req.TanggalIjazah != "" {
		parsed, err := time.Parse("2006-01-02", req.TanggalIjazah)
		if err != nil {
			return nil, errors.New("invalid date format for tanggal_ijazah")
		}
		pendidikan.TanggalIjazah = &parsed
	}
	if req.NoSKHUN != "" {
		pendidikan.NoSKHUN = utils.SanitizeString(req.NoSKHUN)
	}
	if req.TanggalSKHUN != "" {
		parsed, err := time.Parse("2006-01-02", req.TanggalSKHUN)
		if err != nil {
			return nil, errors.New("invalid date format for tanggal_skhun")
		}
		pendidikan.TanggalSKHUN = &parsed
	}
	if req.KelasDiterima != "" {
		pendidikan.KelasDiterima = req.KelasDiterima
	}
	if req.AlasanPindah != "" {
		pendidikan.AlasanPindah = utils.SanitizeString(req.AlasanPindah)
	}

	if err := s.pendidikanRepo.Update(pendidikan); err != nil {
		return nil, err
	}

	return s.toResponse(pendidikan), nil
}

// Delete deletes previous education record
func (s *PendidikanService) Delete(id uint) error {
	_, err := s.pendidikanRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("education record not found")
		}
		return err
	}

	return s.pendidikanRepo.Delete(id)
}

// toResponse converts to DTO
func (s *PendidikanService) toResponse(p *models.PendidikanSebelumnya) *responses.PendidikanResponse {
	return &responses.PendidikanResponse{
		ID:              p.ID,
		Tipe:            p.Tipe,
		TanggalDiterima: p.TanggalDiterima,
		AsalSekolah:     p.AsalSekolah,
		AlamatSekolah:   p.AlamatSekolah,
		NoIjazah:        p.NoIjazah,
		TanggalIjazah:   p.TanggalIjazah,
		NoSKHUN:         p.NoSKHUN,
		TanggalSKHUN:    p.TanggalSKHUN,
		KelasDiterima:   p.KelasDiterima,
		AlasanPindah:    p.AlasanPindah,
	}
}
