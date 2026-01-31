package services

import (
	"errors"
	"mime/multipart"
	"time"

	"github.com/kampunk/backend/dtos/requests"
	"github.com/kampunk/backend/dtos/responses"
	"github.com/kampunk/backend/models"
	"github.com/kampunk/backend/repositories"
	"github.com/kampunk/backend/utils"
	"gorm.io/gorm"
)

// SiswaService handles student business logic
type SiswaService struct {
	siswaRepo     *repositories.SiswaRepository
	alamatRepo    *repositories.AlamatRepository
	orangTuaRepo  *repositories.OrangTuaRepository
	waliRepo      *repositories.WaliRepository
	kesehatanRepo *repositories.KesehatanRepository
}

// NewSiswaService creates a new SiswaService
func NewSiswaService(
	siswaRepo *repositories.SiswaRepository,
	alamatRepo *repositories.AlamatRepository,
	orangTuaRepo *repositories.OrangTuaRepository,
	waliRepo *repositories.WaliRepository,
	kesehatanRepo *repositories.KesehatanRepository,
) *SiswaService {
	return &SiswaService{
		siswaRepo:     siswaRepo,
		alamatRepo:    alamatRepo,
		orangTuaRepo:  orangTuaRepo,
		waliRepo:      waliRepo,
		kesehatanRepo: kesehatanRepo,
	}
}

// Create creates a new student
func (s *SiswaService) Create(req requests.CreateSiswaRequest) (*responses.SiswaDetailResponse, error) {
	// Validate NISN
	if !utils.ValidateNISN(req.NISN) {
		return nil, errors.New("NISN must be 10 digits")
	}

	// Check if NISN exists
	exists, err := s.siswaRepo.ExistsByNISN(req.NISN)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.New("NISN already exists")
	}

	// Check if NoInduk exists
	exists, err = s.siswaRepo.ExistsByNoInduk(req.NoInduk)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.New("school registration number already exists")
	}

	// Parse date
	tanggalLahir, err := time.Parse("2006-01-02", req.TanggalLahir)
	if err != nil {
		return nil, errors.New("invalid date format, use YYYY-MM-DD")
	}

	// Create siswa
	siswa := &models.Siswa{
		NoInduk:         utils.SanitizeString(req.NoInduk),
		NISN:            req.NISN,
		NamaLengkap:     utils.SanitizeString(req.NamaLengkap),
		NamaPanggilan:   utils.SanitizeString(req.NamaPanggilan),
		JenisKelamin:    req.JenisKelamin,
		TempatLahir:     utils.SanitizeString(req.TempatLahir),
		TanggalLahir:    tanggalLahir,
		Agama:           utils.SanitizeString(req.Agama),
		AnakKe:          req.AnakKe,
		JumlahSaudara:   req.JumlahSaudara,
		Kewarganegaraan: utils.SanitizeString(req.Kewarganegaraan),
		BahasaRumah:     utils.SanitizeString(req.BahasaRumah),
	}

	if err := s.siswaRepo.Create(siswa); err != nil {
		return nil, err
	}

	return s.toDetailResponse(siswa), nil
}

// FindByID finds a student by ID
func (s *SiswaService) FindByID(id uint) (*responses.SiswaDetailResponse, error) {
	siswa, err := s.siswaRepo.FindByIDWithRelations(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("student not found")
		}
		return nil, err
	}

	return s.toDetailResponse(siswa), nil
}

// FindAll finds all students with pagination
func (s *SiswaService) FindAll(req requests.PaginationRequest) ([]responses.SiswaListResponse, utils.Pagination, error) {
	if req.Page < 1 {
		req.Page = 1
	}
	if req.PageSize < 1 || req.PageSize > 100 {
		req.PageSize = 20
	}

	siswaList, total, err := s.siswaRepo.FindAll(req.Page, req.PageSize, req.Search, req.SortBy, req.SortDir)
	if err != nil {
		return nil, utils.Pagination{}, err
	}

	var response []responses.SiswaListResponse
	for _, siswa := range siswaList {
		response = append(response, responses.SiswaListResponse{
			ID:           siswa.ID,
			NoInduk:      siswa.NoInduk,
			NISN:         siswa.NISN,
			NamaLengkap:  siswa.NamaLengkap,
			JenisKelamin: siswa.JenisKelamin,
			FotoPath:     siswa.FotoPath,
			CreatedAt:    siswa.CreatedAt,
		})
	}

	totalPages := int(total) / req.PageSize
	if int(total)%req.PageSize > 0 {
		totalPages++
	}

	pagination := utils.Pagination{
		Page:       req.Page,
		PageSize:   req.PageSize,
		TotalItems: total,
		TotalPages: totalPages,
	}

	return response, pagination, nil
}

// Update updates a student
func (s *SiswaService) Update(id uint, req requests.UpdateSiswaRequest) (*responses.SiswaDetailResponse, error) {
	siswa, err := s.siswaRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("student not found")
		}
		return nil, err
	}

	// Update fields if provided
	if req.NamaLengkap != "" {
		siswa.NamaLengkap = utils.SanitizeString(req.NamaLengkap)
	}
	if req.NamaPanggilan != "" {
		siswa.NamaPanggilan = utils.SanitizeString(req.NamaPanggilan)
	}
	if req.JenisKelamin != "" {
		siswa.JenisKelamin = req.JenisKelamin
	}
	if req.TempatLahir != "" {
		siswa.TempatLahir = utils.SanitizeString(req.TempatLahir)
	}
	if req.TanggalLahir != "" {
		tanggalLahir, err := time.Parse("2006-01-02", req.TanggalLahir)
		if err != nil {
			return nil, errors.New("invalid date format, use YYYY-MM-DD")
		}
		siswa.TanggalLahir = tanggalLahir
	}
	if req.Agama != "" {
		siswa.Agama = utils.SanitizeString(req.Agama)
	}
	if req.AnakKe > 0 {
		siswa.AnakKe = req.AnakKe
	}
	siswa.JumlahSaudara = req.JumlahSaudara
	if req.Kewarganegaraan != "" {
		siswa.Kewarganegaraan = utils.SanitizeString(req.Kewarganegaraan)
	}
	if req.BahasaRumah != "" {
		siswa.BahasaRumah = utils.SanitizeString(req.BahasaRumah)
	}

	if err := s.siswaRepo.Update(siswa); err != nil {
		return nil, err
	}

	return s.toDetailResponse(siswa), nil
}

// Delete soft deletes a student
func (s *SiswaService) Delete(id uint) error {
	_, err := s.siswaRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("student not found")
		}
		return err
	}

	return s.siswaRepo.Delete(id)
}

// UploadFoto uploads student photo
func (s *SiswaService) UploadFoto(id uint, file *multipart.FileHeader) (string, error) {
	// Validate student exists
	siswa, err := s.siswaRepo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", errors.New("student not found")
		}
		return "", err
	}

	// Validate image file
	if err := utils.ValidateImageFile(file); err != nil {
		return "", err
	}

	// Delete old photo if exists
	if siswa.FotoPath != "" {
		_ = utils.DeleteFile(siswa.FotoPath)
	}

	// Save new photo
	fotoPath, err := utils.SaveUploadedFile(file, "photos")
	if err != nil {
		return "", err
	}

	// Update database
	if err := s.siswaRepo.UpdateFotoPath(id, fotoPath); err != nil {
		return "", err
	}

	return fotoPath, nil
}

// toDetailResponse converts model to response
func (s *SiswaService) toDetailResponse(siswa *models.Siswa) *responses.SiswaDetailResponse {
	resp := &responses.SiswaDetailResponse{
		ID:              siswa.ID,
		NoInduk:         siswa.NoInduk,
		NISN:            siswa.NISN,
		NamaLengkap:     siswa.NamaLengkap,
		NamaPanggilan:   siswa.NamaPanggilan,
		JenisKelamin:    siswa.JenisKelamin,
		TempatLahir:     siswa.TempatLahir,
		TanggalLahir:    siswa.TanggalLahir,
		Agama:           siswa.Agama,
		AnakKe:          siswa.AnakKe,
		JumlahSaudara:   siswa.JumlahSaudara,
		Kewarganegaraan: siswa.Kewarganegaraan,
		BahasaRumah:     siswa.BahasaRumah,
		FotoPath:        siswa.FotoPath,
		CreatedAt:       siswa.CreatedAt,
		UpdatedAt:       siswa.UpdatedAt,
	}

	// Map related data
	if siswa.Alamat != nil {
		resp.Alamat = &responses.AlamatResponse{
			ID:             siswa.Alamat.ID,
			AlamatLengkap:  siswa.Alamat.AlamatLengkap,
			Kelurahan:      siswa.Alamat.Kelurahan,
			Kecamatan:      siswa.Alamat.Kecamatan,
			Kota:           siswa.Alamat.Kota,
			Provinsi:       siswa.Alamat.Provinsi,
			KodePos:        siswa.Alamat.KodePos,
			NoTelepon:      siswa.Alamat.NoTelepon,
			TinggalDengan:  siswa.Alamat.TinggalDengan,
			JarakKeSekolah: siswa.Alamat.JarakKeSekolah,
			Transportasi:   siswa.Alamat.Transportasi,
		}
	}

	for _, ortu := range siswa.OrangTua {
		resp.OrangTua = append(resp.OrangTua, responses.OrangTuaResponse{
			ID:                 ortu.ID,
			Tipe:               ortu.Tipe,
			Nama:               ortu.Nama,
			TempatLahir:        ortu.TempatLahir,
			TanggalLahir:       ortu.TanggalLahir,
			Kewarganegaraan:    ortu.Kewarganegaraan,
			PendidikanTerakhir: ortu.PendidikanTerakhir,
			Pekerjaan:          ortu.Pekerjaan,
			PenghasilanBulanan: ortu.PenghasilanBulanan,
			Alamat:             ortu.Alamat,
			NoTelepon:          ortu.NoTelepon,
			MasihHidup:         ortu.MasihHidup,
		})
	}

	if siswa.Wali != nil {
		resp.Wali = &responses.WaliResponse{
			ID:                  siswa.Wali.ID,
			Nama:                siswa.Wali.Nama,
			JenisKelamin:        siswa.Wali.JenisKelamin,
			TempatLahir:         siswa.Wali.TempatLahir,
			TanggalLahir:        siswa.Wali.TanggalLahir,
			Kewarganegaraan:     siswa.Wali.Kewarganegaraan,
			PendidikanTerakhir:  siswa.Wali.PendidikanTerakhir,
			Pekerjaan:           siswa.Wali.Pekerjaan,
			PenghasilanBulanan:  siswa.Wali.PenghasilanBulanan,
			Alamat:              siswa.Wali.Alamat,
			NoTelepon:           siswa.Wali.NoTelepon,
			HubunganDenganSiswa: siswa.Wali.HubunganDenganSiswa,
		}
	}

	return resp
}

// AddMeninggalkanSekolah adds leaving school record
func (s *SiswaService) AddMeninggalkanSekolah(siswaID uint, req requests.CreateMeninggalkanSekolahRequest) (*responses.MeninggalkanSekolahResponse, error) {
	// Validate student exists
	_, err := s.siswaRepo.FindByID(siswaID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("student not found")
		}
		return nil, err
	}

	// Parse date
	parsedTanggal, err := time.Parse("2006-01-02", req.Tanggal)
	if err != nil {
		return nil, errors.New("invalid date format, use YYYY-MM-DD")
	}

	data := &models.MeninggalkanSekolah{
		SiswaID:             siswaID,
		Tipe:                req.Tipe,
		Tanggal:             parsedTanggal,
		SekolahTujuan:       utils.SanitizeString(req.SekolahTujuan),
		AlamatSekolahTujuan: utils.SanitizeString(req.AlamatSekolahTujuan),
		NoIjazah:            utils.SanitizeString(req.NoIjazah),
		Alasan:              utils.SanitizeString(req.Alasan),
	}

	if err := s.siswaRepo.AddMeninggalkanSekolah(data); err != nil {
		return nil, err
	}

	return &responses.MeninggalkanSekolahResponse{
		ID:                  data.ID,
		Tipe:                data.Tipe,
		Tanggal:             data.Tanggal,
		SekolahTujuan:       data.SekolahTujuan,
		AlamatSekolahTujuan: data.AlamatSekolahTujuan,
		NoIjazah:            data.NoIjazah,
		Alasan:              data.Alasan,
	}, nil
}
