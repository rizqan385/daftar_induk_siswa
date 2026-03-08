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

// KesehatanService handles health business logic
type KesehatanService struct {
	siswaRepo     *repositories.SiswaRepository
	kesehatanRepo *repositories.KesehatanRepository
}

// NewKesehatanService creates a new KesehatanService
func NewKesehatanService(siswaRepo *repositories.SiswaRepository, kesehatanRepo *repositories.KesehatanRepository) *KesehatanService {
	return &KesehatanService{siswaRepo: siswaRepo, kesehatanRepo: kesehatanRepo}
}

// CreateOrUpdate creates or updates health data for a student
func (s *KesehatanService) CreateOrUpdate(siswaID uint, req requests.CreateKesehatanRequest) (*responses.KesehatanResponse, error) {
	// Validate student exists
	_, err := s.siswaRepo.FindByID(siswaID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("student not found")
		}
		return nil, err
	}

	// Check if exists
	existingKesehatan, err := s.kesehatanRepo.FindBySiswaID(siswaID)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	if existingKesehatan != nil {
		// Update existing
		existingKesehatan.BeratBadanMasuk = req.BeratBadanMasuk
		existingKesehatan.TinggiBadanMasuk = req.TinggiBadanMasuk
		existingKesehatan.BeratBadanKeluar = req.BeratBadanKeluar
		existingKesehatan.TinggiBadanKeluar = req.TinggiBadanKeluar
		existingKesehatan.GolonganDarah = req.GolonganDarah
		existingKesehatan.KesanggupanJasmani = utils.SanitizeString(req.KesanggupanJasmani)

		if err := s.kesehatanRepo.Update(existingKesehatan); err != nil {
			return nil, err
		}
		return s.toResponse(existingKesehatan), nil
	}

	// Create new
	kesehatan := &models.KesehatanSiswa{
		SiswaID:            siswaID,
		BeratBadanMasuk:    req.BeratBadanMasuk,
		TinggiBadanMasuk:   req.TinggiBadanMasuk,
		BeratBadanKeluar:   req.BeratBadanKeluar,
		TinggiBadanKeluar:  req.TinggiBadanKeluar,
		GolonganDarah:      req.GolonganDarah,
		KesanggupanJasmani: utils.SanitizeString(req.KesanggupanJasmani),
	}

	if err := s.kesehatanRepo.Create(kesehatan); err != nil {
		return nil, err
	}

	return s.toResponse(kesehatan), nil
}

// AddRiwayatPenyakit adds disease history
func (s *KesehatanService) AddRiwayatPenyakit(kesehatanID uint, req requests.CreateRiwayatPenyakitRequest) (*responses.RiwayatPenyakitResponse, error) {
	penyakit := &models.RiwayatPenyakit{
		KesehatanID:   kesehatanID,
		JenisPenyakit: utils.SanitizeString(req.JenisPenyakit),
		Tahun:         req.Tahun,
		LamaSakit:     utils.SanitizeString(req.LamaSakit),
		Keterangan:    utils.SanitizeString(req.Keterangan),
	}

	if err := s.kesehatanRepo.AddRiwayatPenyakit(penyakit); err != nil {
		return nil, err
	}

	return &responses.RiwayatPenyakitResponse{
		ID:            penyakit.ID,
		JenisPenyakit: penyakit.JenisPenyakit,
		Tahun:         penyakit.Tahun,
		LamaSakit:     penyakit.LamaSakit,
		Keterangan:    penyakit.Keterangan,
	}, nil
}

// DeleteRiwayatPenyakit deletes disease history
func (s *KesehatanService) DeleteRiwayatPenyakit(id uint) error {
	return s.kesehatanRepo.DeleteRiwayatPenyakit(id)
}

// toResponse converts to DTO
func (s *KesehatanService) toResponse(kesehatan *models.KesehatanSiswa) *responses.KesehatanResponse {
	resp := &responses.KesehatanResponse{
		ID:                 kesehatan.ID,
		BeratBadanMasuk:    kesehatan.BeratBadanMasuk,
		TinggiBadanMasuk:   kesehatan.TinggiBadanMasuk,
		BeratBadanKeluar:   kesehatan.BeratBadanKeluar,
		TinggiBadanKeluar:  kesehatan.TinggiBadanKeluar,
		GolonganDarah:      kesehatan.GolonganDarah,
		KesanggupanJasmani: kesehatan.KesanggupanJasmani,
	}

	for _, p := range kesehatan.RiwayatPenyakit {
		resp.RiwayatPenyakit = append(resp.RiwayatPenyakit, responses.RiwayatPenyakitResponse{
			ID:            p.ID,
			JenisPenyakit: p.JenisPenyakit,
			Tahun:         p.Tahun,
			LamaSakit:     p.LamaSakit,
			Keterangan:    p.Keterangan,
		})
	}

	return resp
}
