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

// OrangTuaService handles parent business logic
type OrangTuaService struct {
	siswaRepo    *repositories.SiswaRepository
	orangTuaRepo *repositories.OrangTuaRepository
}

// NewOrangTuaService creates a new OrangTuaService
func NewOrangTuaService(siswaRepo *repositories.SiswaRepository, orangTuaRepo *repositories.OrangTuaRepository) *OrangTuaService {
	return &OrangTuaService{siswaRepo: siswaRepo, orangTuaRepo: orangTuaRepo}
}

// Create adds a parent to a student
func (s *OrangTuaService) Create(siswaID uint, req requests.CreateOrangTuaRequest) (*responses.OrangTuaResponse, error) {
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

	orangTua := &models.OrangTua{
		SiswaID:            siswaID,
		Tipe:               req.Tipe,
		Nama:               utils.SanitizeString(req.Nama),
		TempatLahir:        utils.SanitizeString(req.TempatLahir),
		TanggalLahir:       tanggalLahir,
		Kewarganegaraan:    utils.SanitizeString(req.Kewarganegaraan),
		PendidikanTerakhir: utils.SanitizeString(req.PendidikanTerakhir),
		Pekerjaan:          utils.SanitizeString(req.Pekerjaan),
		PenghasilanBulanan: req.PenghasilanBulanan,
		Alamat:             utils.SanitizeString(req.Alamat),
		NoTelepon:          utils.SanitizeString(req.NoTelepon),
		MasihHidup:         req.MasihHidup,
	}

	if err := s.orangTuaRepo.Create(orangTua); err != nil {
		return nil, err
	}

	return &responses.OrangTuaResponse{
		ID:                 orangTua.ID,
		Tipe:               orangTua.Tipe,
		Nama:               orangTua.Nama,
		TempatLahir:        orangTua.TempatLahir,
		TanggalLahir:       orangTua.TanggalLahir,
		Kewarganegaraan:    orangTua.Kewarganegaraan,
		PendidikanTerakhir: orangTua.PendidikanTerakhir,
		Pekerjaan:          orangTua.Pekerjaan,
		PenghasilanBulanan: orangTua.PenghasilanBulanan,
		Alamat:             orangTua.Alamat,
		NoTelepon:          orangTua.NoTelepon,
		MasihHidup:         orangTua.MasihHidup,
	}, nil
}

// Update updates parent data
func (s *OrangTuaService) Update(id uint, req requests.UpdateOrangTuaRequest) (*responses.OrangTuaResponse, error) {
	orangTua, err := s.orangTuaRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("parent not found")
		}
		return nil, err
	}

	if req.Tipe != "" {
		orangTua.Tipe = req.Tipe
	}
	if req.Nama != "" {
		orangTua.Nama = utils.SanitizeString(req.Nama)
	}
	if req.TempatLahir != "" {
		orangTua.TempatLahir = utils.SanitizeString(req.TempatLahir)
	}
	if req.TanggalLahir != "" {
		parsed, err := time.Parse("2006-01-02", req.TanggalLahir)
		if err != nil {
			return nil, errors.New("invalid date format, use YYYY-MM-DD")
		}
		orangTua.TanggalLahir = &parsed
	}
	if req.Kewarganegaraan != "" {
		orangTua.Kewarganegaraan = utils.SanitizeString(req.Kewarganegaraan)
	}
	if req.PendidikanTerakhir != "" {
		orangTua.PendidikanTerakhir = utils.SanitizeString(req.PendidikanTerakhir)
	}
	if req.Pekerjaan != "" {
		orangTua.Pekerjaan = utils.SanitizeString(req.Pekerjaan)
	}
	if req.PenghasilanBulanan > 0 {
		orangTua.PenghasilanBulanan = req.PenghasilanBulanan
	}
	if req.Alamat != "" {
		orangTua.Alamat = utils.SanitizeString(req.Alamat)
	}
	if req.NoTelepon != "" {
		orangTua.NoTelepon = utils.SanitizeString(req.NoTelepon)
	}
	if req.MasihHidup != nil {
		orangTua.MasihHidup = *req.MasihHidup
	}

	if err := s.orangTuaRepo.Update(orangTua); err != nil {
		return nil, err
	}

	return &responses.OrangTuaResponse{
		ID:                 orangTua.ID,
		Tipe:               orangTua.Tipe,
		Nama:               orangTua.Nama,
		TempatLahir:        orangTua.TempatLahir,
		TanggalLahir:       orangTua.TanggalLahir,
		Kewarganegaraan:    orangTua.Kewarganegaraan,
		PendidikanTerakhir: orangTua.PendidikanTerakhir,
		Pekerjaan:          orangTua.Pekerjaan,
		PenghasilanBulanan: orangTua.PenghasilanBulanan,
		Alamat:             orangTua.Alamat,
		NoTelepon:          orangTua.NoTelepon,
		MasihHidup:         orangTua.MasihHidup,
	}, nil
}

// Delete deletes parent data
func (s *OrangTuaService) Delete(id uint) error {
	_, err := s.orangTuaRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("parent not found")
		}
		return err
	}

	return s.orangTuaRepo.Delete(id)
}
