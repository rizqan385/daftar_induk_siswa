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

// WaliService handles guardian business logic
type WaliService struct {
	siswaRepo *repositories.SiswaRepository
	waliRepo  *repositories.WaliRepository
}

// NewWaliService creates a new WaliService
func NewWaliService(siswaRepo *repositories.SiswaRepository, waliRepo *repositories.WaliRepository) *WaliService {
	return &WaliService{siswaRepo: siswaRepo, waliRepo: waliRepo}
}

// CreateOrUpdate creates or updates guardian for a student (One-to-One mostly, but can be replaced)
func (s *WaliService) CreateOrUpdate(siswaID uint, req requests.CreateWaliRequest) (*responses.WaliResponse, error) {
	// Validate student exists
	_, err := s.siswaRepo.FindByID(siswaID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("student not found")
		}
		return nil, err
	}

	// Parse date
	var tanggalLahir *time.Time
	if req.TanggalLahir != "" {
		parsed, err := time.Parse("2006-01-02", req.TanggalLahir)
		if err != nil {
			return nil, errors.New("invalid date format, use YYYY-MM-DD")
		}
		tanggalLahir = &parsed
	}

	// Check if exists
	existingWali, err := s.waliRepo.FindBySiswaID(siswaID)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	if existingWali != nil {
		// Update existing
		existingWali.Nama = utils.SanitizeString(req.Nama)
		existingWali.JenisKelamin = req.JenisKelamin
		existingWali.TempatLahir = utils.SanitizeString(req.TempatLahir)
		existingWali.TanggalLahir = tanggalLahir
		existingWali.Kewarganegaraan = utils.SanitizeString(req.Kewarganegaraan)
		existingWali.PendidikanTerakhir = utils.SanitizeString(req.PendidikanTerakhir)
		existingWali.Pekerjaan = utils.SanitizeString(req.Pekerjaan)
		existingWali.PenghasilanBulanan = req.PenghasilanBulanan
		existingWali.Alamat = utils.SanitizeString(req.Alamat)
		existingWali.NoTelepon = utils.SanitizeString(req.NoTelepon)
		existingWali.HubunganDenganSiswa = utils.SanitizeString(req.HubunganDenganSiswa)

		if err := s.waliRepo.Update(existingWali); err != nil {
			return nil, err
		}
		return s.toResponse(existingWali), nil
	}

	// Create new
	wali := &models.Wali{
		SiswaID:             siswaID,
		Nama:                utils.SanitizeString(req.Nama),
		JenisKelamin:        req.JenisKelamin,
		TempatLahir:         utils.SanitizeString(req.TempatLahir),
		TanggalLahir:        tanggalLahir,
		Kewarganegaraan:     utils.SanitizeString(req.Kewarganegaraan),
		PendidikanTerakhir:  utils.SanitizeString(req.PendidikanTerakhir),
		Pekerjaan:           utils.SanitizeString(req.Pekerjaan),
		PenghasilanBulanan:  req.PenghasilanBulanan,
		Alamat:              utils.SanitizeString(req.Alamat),
		NoTelepon:           utils.SanitizeString(req.NoTelepon),
		HubunganDenganSiswa: utils.SanitizeString(req.HubunganDenganSiswa),
	}

	if err := s.waliRepo.Create(wali); err != nil {
		return nil, err
	}

	return s.toResponse(wali), nil
}

// toResponse converts to DTO
func (s *WaliService) toResponse(wali *models.Wali) *responses.WaliResponse {
	return &responses.WaliResponse{
		ID:                  wali.ID,
		Nama:                wali.Nama,
		JenisKelamin:        wali.JenisKelamin,
		TempatLahir:         wali.TempatLahir,
		TanggalLahir:        wali.TanggalLahir,
		Kewarganegaraan:     wali.Kewarganegaraan,
		PendidikanTerakhir:  wali.PendidikanTerakhir,
		Pekerjaan:           wali.Pekerjaan,
		PenghasilanBulanan:  wali.PenghasilanBulanan,
		Alamat:              wali.Alamat,
		NoTelepon:           wali.NoTelepon,
		HubunganDenganSiswa: wali.HubunganDenganSiswa,
	}
}
